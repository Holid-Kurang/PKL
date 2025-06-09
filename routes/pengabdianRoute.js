const express = require("express");
const router = express.Router();

const pusatModel = require("../models/pengabdian/pusat");
const pnbpModel = require("../models/pengabdian/pnbp");
// Halaman utama
router.get("/pengabdian", async (req, res) => {
    try {
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
        });

    } catch (error) {
        console.error("Error fetching research data:", error);
        res.status(500).send("Gagal memuat data penelitian");
    }
});

module.exports = router;