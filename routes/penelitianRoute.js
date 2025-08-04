const express = require("express");
const router = express.Router();

const pusatModel = require("../models/penelitian/pusat");
const pnbpModel = require("../models/penelitian/pnbp");
const mandiriModel = require("../models/penelitian/mandiri");

// Halaman utama penelitian
router.get("/penelitian", async (req, res) => {
    try {

        // Aggregate data gabungan dari ketiga jenis penelitian
        const currentYear = new Date().getFullYear();

        const hasilRangkuman = await Promise.all([
            // Total biaya keseluruhan dari semua penelitian
            Promise.all([
                pusatModel.aggregate([{ $group: { _id: null, total: { $sum: "$BIAYA" } } }]),
                pnbpModel.aggregate([{ $group: { _id: null, total: { $sum: "$Biaya" } } }]),
                mandiriModel.aggregate([{ $group: { _id: null, total: { $sum: "$Dana" } } }])
            ]),
            
            // Rata-rata biaya per penelitian dari semua jenis
            Promise.all([
                pusatModel.aggregate([{ $group: { _id: null, avg: { $avg: "$BIAYA" } } }]),
                pnbpModel.aggregate([{ $group: { _id: null, avg: { $avg: "$Biaya" } } }]),
                mandiriModel.aggregate([{ $group: { _id: null, avg: { $avg: "$Dana" } } }])
            ]),
            
            // Prodi teraktif (jumlah penelitian per prodi)
            Promise.all([
                pusatModel.aggregate([{ $group: { _id: "$PRODI", count: { $sum: 1 } } }]),
                pnbpModel.aggregate([{ $group: { _id: "$Prodi", count: { $sum: 1 } } }]),
                mandiriModel.aggregate([{ $group: { _id: "$Prodi", count: { $sum: 1 } } }])
            ]),
            
            // Total prodi terlibat (unique prodi)
            Promise.all([
                pusatModel.distinct("PRODI"),
                pnbpModel.distinct("Prodi"),
                mandiriModel.distinct("Prodi")
            ]),
            
            // Penelitian tahun aktif (tahun berjalan)
            Promise.all([
                pusatModel.countDocuments({ TAHUN: currentYear }),
                pnbpModel.countDocuments({ Tahun: currentYear }),
                mandiriModel.countDocuments({ tahun: currentYear })
            ])
        ]);

        // Hitung total biaya keseluruhan
        const totalBiayaKeseluruhan = hasilRangkuman[0].reduce((sum, result) => {
            return sum + (result[0]?.total || 0);
        }, 0);

        // Hitung rata-rata biaya gabungan
        const avgBiayaResults = hasilRangkuman[1];
        const totalAvgBiaya = avgBiayaResults.reduce((sum, result) => {
            return sum + (result[0]?.avg || 0);
        }, 0);
        const rataRataBiayaGabungan = totalAvgBiaya / avgBiayaResults.length;

        // Gabungkan data prodi dan cari yang teraktif
        const prodiCounts = {};
        hasilRangkuman[2].forEach(prodiData => {
            prodiData.forEach(item => {
            const prodi = item._id;
            if (prodi !== "-") {
                prodiCounts[prodi] = (prodiCounts[prodi] || 0) + item.count;
            }
            });
        });
        const prodiTeraktif = Object.keys(prodiCounts).reduce((a, b) => 
            prodiCounts[a] > prodiCounts[b] ? a : b, "");

        // Hitung total prodi unik
        const allProdi = new Set();
        hasilRangkuman[3].forEach(prodiList => {
            prodiList.forEach(prodi => {
            if (prodi !== "-") {
                allProdi.add(prodi);
            }
            });
        });
        const totalProdiTerlibat = allProdi.size;

        // Total penelitian tahun aktif
        const penelitianTahunAktif = hasilRangkuman[4].reduce((sum, count) => sum + count, 0);

        const gabunganData = {
            totalBiayaKeseluruhan,
            rataRataBiayaGabungan,
            prodiTeraktif,
            totalProdiTerlibat,
            penelitianTahunAktif,
            tahunAktif: currentYear
        };
        console.log("Gabungan Data:", gabunganData);
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
            mandiriData: mandiriResults[0]
        });

    } catch (error) {
        console.error("Error fetching research data:", error);
        res.status(500).send("Gagal memuat data penelitian");
    }
});

module.exports = router;
