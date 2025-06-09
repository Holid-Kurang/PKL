const express = require("express");
const router = express.Router();

const pusatModel = require("../models/penelitian/pusat");
const pnbpModel = require("../models/penelitian/pnbp");
const mandiriModel = require("../models/penelitian/mandiri");

// Halaman utama penelitian
router.get("/penelitian", async (req, res) => {
    try {
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
