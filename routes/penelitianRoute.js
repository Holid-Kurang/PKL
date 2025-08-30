const express = require("express");
const router = express.Router();

const pusatModel = require("../models/penelitian/pusat");
const pnbpModel = require("../models/penelitian/pnbp");
const mandiriModel = require("../models/penelitian/mandiri");
const kategoriOptionModel = require('../models/kategoriOptionModel');

// Halaman utama penelitian
router.get("/penelitian", async (req, res) => {
    try {

        // Rangkuman data penelitian tahun ini
        const currentYear = new Date().getFullYear();

        const hasilRangkumanTahunIni = await Promise.all([
            // Total biaya penelitian tahun ini
            Promise.all([
                pusatModel.aggregate([
                    { $match: { TAHUN: currentYear } },
                    { $group: { _id: null, total: { $sum: "$BIAYA" } } }
                ]),
                pnbpModel.aggregate([
                    { $match: { Tahun: currentYear } },
                    { $group: { _id: null, total: { $sum: "$Biaya" } } }
                ]),
                mandiriModel.aggregate([
                    { $match: { tahun: currentYear } },
                    { $group: { _id: null, total: { $sum: "$Dana" } } }
                ])
            ]),

            // Rata-rata biaya penelitian tahun ini
            Promise.all([
                pusatModel.aggregate([
                    { $match: { TAHUN: currentYear } },
                    { $group: { _id: null, avg: { $avg: "$BIAYA" } } }
                ]),
                pnbpModel.aggregate([
                    { $match: { Tahun: currentYear } },
                    { $group: { _id: null, avg: { $avg: "$Biaya" } } }
                ]),
                mandiriModel.aggregate([
                    { $match: { tahun: currentYear } },
                    { $group: { _id: null, avg: { $avg: "$Dana" } } }
                ])
            ]),

            // Jumlah penelitian per prodi tahun ini
            Promise.all([
                pusatModel.aggregate([
                    { $match: { TAHUN: currentYear } },
                    { $group: { _id: "$PRODI", count: { $sum: 1 } } }
                ]),
                pnbpModel.aggregate([
                    { $match: { Tahun: currentYear } },
                    { $group: { _id: "$Prodi", count: { $sum: 1 } } }
                ]),
                mandiriModel.aggregate([
                    { $match: { tahun: currentYear } },
                    { $group: { _id: "$Prodi", count: { $sum: 1 } } }
                ])
            ]),

            // Total penelitian tahun ini
            Promise.all([
                pusatModel.countDocuments({ TAHUN: currentYear }),
                pnbpModel.countDocuments({ Tahun: currentYear }),
                mandiriModel.countDocuments({ tahun: currentYear })
            ])
        ]);

        // Hitung total biaya tahun ini
        const totalBiayaTahunIni = hasilRangkumanTahunIni[0].reduce((sum, result) => {
            return sum + (result[0]?.total || 0);
        }, 0);

        // Hitung rata-rata biaya tahun ini
        const avgBiayaResults = hasilRangkumanTahunIni[1];
        const totalAvgBiaya = avgBiayaResults.reduce((sum, result) => {
            return sum + (result[0]?.avg || 0);
        }, 0);
        const validAvgCount = avgBiayaResults.filter(result => result[0]?.avg).length;
        const rataRataBiayaTahunIni = validAvgCount > 0 ? totalAvgBiaya / validAvgCount : 0;

        // Gabungkan data prodi tahun ini dan cari yang teraktif
        const prodiCountsTahunIni = {};
        hasilRangkumanTahunIni[2].forEach(prodiData => {
            prodiData.forEach(item => {
                const prodi = item._id;
                if (prodi && prodi !== "-") {
                    prodiCountsTahunIni[prodi] = (prodiCountsTahunIni[prodi] || 0) + item.count;
                }
            });
        });

        const prodiTeraktif = Object.keys(prodiCountsTahunIni).length > 0
            ? Object.keys(prodiCountsTahunIni).reduce((a, b) =>
                prodiCountsTahunIni[a] > prodiCountsTahunIni[b] ? a : b)
            : "";

        // Total penelitian tahun ini
        const totalPenelitianTahunIni = hasilRangkumanTahunIni[3].reduce((sum, count) => sum + count, 0);

        const gabunganData = {
            totalBiayaKeseluruhan: totalBiayaTahunIni,
            rataRataBiayaGabungan: rataRataBiayaTahunIni,
            prodiTeraktif,
            prodiCounts: prodiCountsTahunIni,
            penelitianTahunAktif: totalPenelitianTahunIni,
            tahunAktif: currentYear
        };
        const [
            pusatResults,
            pnbpResults,
            mandiriResults
        ] = await Promise.all([
            // Query #1: Mengambil semua data agregasi untuk Penelitian Pusat
            pusatModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$TAHUN", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahPerProdi": [
                            { $group: { _id: "$PRODI", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$TAHUN", total: { $sum: "$BIAYA" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerProdi": [
                            { $group: { _id: "$PRODI", total: { $sum: "$BIAYA" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$TAHUN", avg: { $avg: "$BIAYA" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerProdi": [
                            { $group: { _id: "$PRODI", avg: { $avg: "$BIAYA" } } },
                            { $sort: { _id: 1 } }
                        ]
                    }
                }
            ]),

            // Query #2: Mengambil semua data agregasi untuk Penelitian PNBP
            pnbpModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahPerProdi": [
                            { $group: { _id: "$Prodi", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: "$Biaya" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerProdi": [
                            { $group: { _id: "$Prodi", total: { $sum: "$Biaya" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Biaya" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerProdi": [
                            { $group: { _id: "$Prodi", avg: { $avg: "$Biaya" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgNilaiPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Nilai" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgNilaiPerProdi": [
                            { $group: { _id: "$Prodi", avg: { $avg: "$Nilai" } } },
                            { $sort: { _id: 1 } }
                        ]
                    }
                }
            ]),

            // Query #3: Mengambil semua data agregasi untuk Penelitian Mandiri
            mandiriModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahPerProdi": [
                            { $group: { _id: "$Prodi", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$tahun", total: { $sum: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerProdi": [
                            { $group: { _id: "$Prodi", total: { $sum: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$tahun", avg: { $avg: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerProdi": [
                            { $group: { _id: "$Prodi", avg: { $avg: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ]
                    }
                }
            ])
        ]);

        const isLogin = req.session.isLogin || false;

        // Hasil dari $facet adalah array dengan satu objek, jadi kita ambil elemen pertama [0]
        res.render("penelitian", {
            title: "Penelitian",
            isLogin,
            pusatData: pusatResults[0],
            pnbpData: pnbpResults[0],
            mandiriData: mandiriResults[0],
            gabunganData
        });

    } catch (error) {
        console.error("Error fetching research data:", error);
        res.status(500).send("Gagal memuat data penelitian");
    }
});

module.exports = router;
