const express = require("express");
const router = express.Router();

const hakiModel = require("../models/publikasi/HAKIModel");
const bukuModel = require("../models/publikasi/bukuModel");
const jupengModel = require("../models/publikasi/jupengModel");

router.get("/publikasi", async (req, res) => {
    try {
        const [
            jupengData,
            hakiData,
            bukuData
        ] = await Promise.all([
            // Query #1: Mengambil semua data Jupeng dalam satu kali jalan
            jupengModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$jurnal_tahun", totalPublikasi: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahPerProdi": [
                            { $group: { _id: "$_prodi_nama", count: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ]
                    }
                }
            ]),

            // Query #2: Mengambil semua data HAKI dalam satu kali jalan
            hakiModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$hki_tahun", jumlahHKI: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahPerJenis": [
                            { $group: { _id: "$hki_jenis", jumlahHKI: { $sum: 1 } } }
                        ],
                        "jumlahPerProdi": [
                            { $group: { _id: "$_prodi_nama", jumlahHKI: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ]
                    }
                }
            ]),

            // Query #3: Mengambil semua data Buku dalam satu kali jalan
            bukuModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$buku_tahun", jumlahBuku: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahPerProdi": [
                            { $group: { _id: "$_prodi_nama", jumlahBuku: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ]
                    }
                }
            ])
        ]);

        const isLogin = req.session.isLogin || false;
        
        // Hasil dari $facet adalah array dengan satu objek, jadi kita ambil elemen pertama [0]
        res.render("publikasi", {
            title: "Publikasi",
            isLogin,
            jupengData: jupengData[0],
            hakiData: hakiData[0],
            bukuData: bukuData[0]
        });

    } catch (error) {
        console.error("Error fetching publication data:", error);
        res.status(500).send("Gagal memuat data publikasi");
    }
});

module.exports = router;
