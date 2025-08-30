const express = require("express");
const router = express.Router();

const pusatModel = require("../models/pengabdian/pusat");
const pnbpModel = require("../models/pengabdian/pnbp");
const kategoriOptionModel = require('../models/kategoriOptionModel');

// Halaman utama
router.get("/pengabdian", async (req, res) => {
    try {

        // Rangkuman data pengabdian tahun ini
        const currentYear = new Date().getFullYear();

        const hasilRangkumanTahunIni = await Promise.all([
            // Total dana pengabdian tahun ini
            Promise.all([
                pusatModel.aggregate([
                    { $match: { Tahun: currentYear } },
                    { $group: { _id: null, total: { $sum: "$Dana" } } }
                ]),
                pnbpModel.aggregate([
                    { $match: { Tahun: currentYear } },
                    { $group: { _id: null, total: { $sum: "$Dana" } } }
                ])
            ]),

            // Rata-rata dana pengabdian tahun ini
            Promise.all([
                pusatModel.aggregate([
                    { $match: { Tahun: currentYear } },
                    { $group: { _id: null, avg: { $avg: "$Dana" } } }
                ]),
                pnbpModel.aggregate([
                    { $match: { Tahun: currentYear } },
                    { $group: { _id: null, avg: { $avg: "$Dana" } } }
                ])
            ]),

            // Jumlah pengabdian per prodi tahun ini
            Promise.all([
                pusatModel.aggregate([
                    { $match: { Tahun: currentYear } },
                    { $group: { _id: "$Prodi", count: { $sum: 1 } } }
                ]),
                pnbpModel.aggregate([
                    { $match: { Tahun: currentYear } },
                    { $group: { _id: "$Prodi", count: { $sum: 1 } } }
                ])
            ]),

            // Total pengabdian tahun ini
            Promise.all([
                pusatModel.countDocuments({ Tahun: currentYear }),
                pnbpModel.countDocuments({ Tahun: currentYear })
            ])
        ]);

        // Hitung total dana tahun ini
        const totalDanaTahunIni = hasilRangkumanTahunIni[0].reduce((sum, result) => {
            return sum + (result[0]?.total || 0);
        }, 0);

        // Hitung rata-rata dana tahun ini
        const avgDanaResults = hasilRangkumanTahunIni[1];
        const totalAvgDana = avgDanaResults.reduce((sum, result) => {
            return sum + (result[0]?.avg || 0);
        }, 0);
        const validAvgCount = avgDanaResults.filter(result => result[0]?.avg).length;
        const rataRataDanaTahunIni = validAvgCount > 0 ? totalAvgDana / validAvgCount : 0;

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

        // Total pengabdian tahun ini
        const totalPengabdianTahunIni = hasilRangkumanTahunIni[3].reduce((sum, count) => sum + count, 0);

        const gabunganData = {
            totalDanaKeseluruhan: totalDanaTahunIni,
            rataRataDanaGabungan: rataRataDanaTahunIni,
            prodiTeraktif,
            prodiCounts: prodiCountsTahunIni,
            pengabdianTahunAktif: totalPengabdianTahunIni,
            tahunAktif: currentYear
        };

        const [
            pusatResults,
            pnbpResults,
        ] = await Promise.all([
            // Query #1: Mengambil semua data agregasi untuk Penelitian Pusat
            pusatModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
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
                            { $group: { _id: "$Tahun", total: { $sum: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerProdi": [
                            { $group: { _id: "$Prodi", total: { $sum: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerProdi": [
                            { $group: { _id: "$Prodi", avg: { $avg: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgNilaiPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Nilai" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgNilaiPerProdi": [
                            { $group: { _id: "$Prodi", avg: { $avg: "$Nilai" } } },
                            { $sort: { _id: 1 } }
                        ],
                        // "jumlahPerSkema": [
                        //     { $group: { _id: "$SKEMA", total: { $sum: 1 } } },
                        //     { $sort: { _id: 1 } }
                        // ],
                        // "jumlahDanaPerSkema": [
                        //     { $group: { _id: "$SKEMA", total: { $sum: "$Biaya Disetujui" } } },
                        //     { $sort: { _id: 1 } }
                        // ],
                        // "avgDanaPerSkema": [
                        //     { $group: { _id: "$SKEMA", avg: { $avg: "$Biaya Disetujui" } } },
                        //     { $sort: { _id: 1 } }
                        // ],
                        // "avgNilaiPerSkema": [
                        //     { $group: { _id: "$SKEMA", avg: { $avg: "$Nilai rata-rata" } } },
                        //     { $sort: { _id: 1 } }
                        // ],
                        // "jumlahPerSkemaPerTahun": [
                        //     { $group: { _id: { skema: "$SKEMA", tahun: "$Tahun" }, total: { $sum: 1 } } },
                        //     { $sort: { _id: 1 } }
                        // ]
                    }
                }
            ]),
        ]);
        const isLogin = req.session.isLogin || false;

        // Hasil dari $facet adalah array dengan satu objek, jadi kita ambil elemen pertama [0]
        res.render("pengabdian", {
            title: "Pengabdian",
            isLogin,
            pusatData: pusatResults[0],
            pnbpData: pnbpResults[0],
            gabunganData
        });

    } catch (error) {
        console.error("Error fetching research data:", error);
        res.status(500).send("Gagal memuat data penelitian");
    }
});

module.exports = router;