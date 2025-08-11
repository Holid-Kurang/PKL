const express = require("express");
const router = express.Router();

const hakiModel = require("../models/publikasi/HAKIModel");
const bukuModel = require("../models/publikasi/bukuModel");
const jupengModel = require("../models/publikasi/jupengModel");
const kategoriOptionModel = require('../models/kategoriOptionModel');

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

        // Mengolah data gabungan untuk cards statistik
        const tahunSekarang = new Date().getFullYear();

        // 1. Total publikasi tahun ini dari semua jenis
        const jupengTahunIni = jupengData[0].jumlahPerTahun.find(item => item._id === tahunSekarang)?.totalPublikasi || 0;
        const hakiTahunIni = hakiData[0].jumlahPerTahun.find(item => item._id === tahunSekarang)?.jumlahHKI || 0;
        const bukuTahunIni = bukuData[0].jumlahPerTahun.find(item => item._id === tahunSekarang)?.jumlahBuku || 0;
        const totalPublikasiTahunIni = jupengTahunIni + hakiTahunIni + bukuTahunIni;

        // 2. Gabungkan data prodi dari semua jenis publikasi tahun ini
        const prodiDataTahunIni = {};

        // Tambahkan data dari jupeng tahun ini
        const jupengProdiTahunIni = await jupengModel.aggregate([
            { $match: { jurnal_tahun: tahunSekarang } },
            { $group: { _id: "$_prodi_nama", count: { $sum: 1 } } }
        ]);

        // Tambahkan data dari haki tahun ini
        const hakiProdiTahunIni = await hakiModel.aggregate([
            { $match: { hki_tahun: tahunSekarang } },
            { $group: { _id: "$_prodi_nama", count: { $sum: 1 } } }
        ]);

        // Tambahkan data dari buku tahun ini
        const bukuProdiTahunIni = await bukuModel.aggregate([
            { $match: { buku_tahun: tahunSekarang } },
            { $group: { _id: "$_prodi_nama", count: { $sum: 1 } } }
        ]);

        // Gabungkan semua data prodi
        [...jupengProdiTahunIni, ...hakiProdiTahunIni, ...bukuProdiTahunIni].forEach(item => {
            if (item._id) {
                prodiDataTahunIni[item._id] = (prodiDataTahunIni[item._id] || 0) + item.count;
            }
        });

        // Cari prodi paling produktif
        let prodiPalingProduktif = 'Tidak ada data';
        let jumlahProdiTerproduktif = 0;
        Object.entries(prodiDataTahunIni).forEach(([prodi, jumlah]) => {
            if (jumlah > jumlahProdiTerproduktif) {
                prodiPalingProduktif = prodi;
                jumlahProdiTerproduktif = jumlah;
            }
        });

        // 3. Jenis publikasi terpopuler tahun ini
        const jenisPublikasiTahunIni = {
            'Jurnal Pengabdian': jupengTahunIni,
            'HAKI': hakiTahunIni,
            'Buku': bukuTahunIni
        };

        let jenisPublikasiTerpopuler = 'Tidak ada data';
        let jumlahJenisTerpopuler = 0;
        Object.entries(jenisPublikasiTahunIni).forEach(([jenis, jumlah]) => {
            if (jumlah > jumlahJenisTerpopuler) {
                jenisPublikasiTerpopuler = jenis;
                jumlahJenisTerpopuler = jumlah;
            }
        });

        // 4. Total publikasi keseluruhan
        const totalJupeng = jupengData[0].jumlahPerTahun.reduce((sum, item) => sum + item.totalPublikasi, 0);
        const totalHaki = hakiData[0].jumlahPerTahun.reduce((sum, item) => sum + item.jumlahHKI, 0);
        const totalBuku = bukuData[0].jumlahPerTahun.reduce((sum, item) => sum + item.jumlahBuku, 0);
        const totalPublikasiKeseluruhan = totalJupeng + totalHaki + totalBuku;

        // Buat objek gabunganData
        const gabunganData = {
            totalPublikasiTahunIni,
            tahunAktif: tahunSekarang,
            prodiPalingProduktif,
            jumlahProdiTerproduktif,
            jenisPublikasiTerpopuler,
            jumlahJenisTerpopuler,
            totalPublikasiKeseluruhan
        };
        const isLogin = req.session.isLogin || false;

        let prodiOptions = await kategoriOptionModel.find({ kategori: 'Program Studi' });
        prodiOptions = prodiOptions.length > 0 ? prodiOptions[0].option : []; // Ambil opsi prodi dari kategori

        // Hasil dari $facet adalah array dengan satu objek, jadi kita ambil elemen pertama [0]
        res.render("publikasi", {
            title: "Publikasi",
            isLogin,
            jupengData: jupengData[0],
            hakiData: hakiData[0],
            bukuData: bukuData[0],
            gabunganData,
            prodiOptions
        });

    } catch (error) {
        console.error("Error fetching publication data:", error);
        res.status(500).send("Gagal memuat data publikasi");
    }
});

module.exports = router;
