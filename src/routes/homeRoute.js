const express = require("express");
const router = express.Router();

const hakiModel = require("../models/publikasi/HAKIModel");
const bukuModel = require("../models/publikasi/bukuModel");
const jupengModel = require("../models/publikasi/jupengModel");
const penelitianPNBPModel = require("../models/penelitian/pnbp");
const penelitianPusatModel = require("../models/penelitian/pusat");
const penelitianMandiriModel = require("../models/penelitian/mandiri");
const pengabdianPNBPModel = require("../models/pengabdian/pnbp");
const pengabdianPusatModel = require("../models/pengabdian/pusat");
const kategoriOptionModel = require('../models/kategoriOptionModel');

function calculateStats(counts) {
    // Menghitung total dari semua nilai dalam objek counts
    const total = Object.values(counts).reduce((sum, val) => sum + val, 0);

    // Menemukan kategori dengan nilai tertinggi
    let topCategory = 'N/A';
    let topValue = 0;
    for (const [key, value] of Object.entries(counts)) {
        if (value > topValue) {
            topValue = value;
            topCategory = key;
        }
    }

    // Menghitung persentase kategori teratas
    const topPercentage = total > 0 ? (topValue / total) * 100 : 0;

    return {
        counts,
        total,
        topCategory,
        topPercentage
    };
}

// Fungsi untuk mengumpulkan data per program studi
async function getProdiData() {
    try {
        // Ambil semua data dari setiap model
        const [penelitianPNBP, penelitianPusat, penelitianMandiri,
            pengabdianPNBP, pengabdianPusat,
            haki, buku, jupeng] = await Promise.all([
                penelitianPNBPModel.find({}, 'Prodi'),
                penelitianPusatModel.find({}, 'Prodi'),
                penelitianMandiriModel.find({}, 'Prodi'),
                pengabdianPNBPModel.find({}, 'Prodi'),
                pengabdianPusatModel.find({}, 'Prodi'),
                hakiModel.find({}, 'Prodi'),
                bukuModel.find({}, 'Prodi'),
                jupengModel.find({}, 'Prodi')
            ]);

        // Kumpulkan semua program studi unik
        const prodiSet = new Set();

        penelitianPNBP.forEach(item => item.Prodi && prodiSet.add(item.Prodi));
        penelitianPusat.forEach(item => item.Prodi && prodiSet.add(item.Prodi));
        penelitianMandiri.forEach(item => item.Prodi && prodiSet.add(item.Prodi));
        pengabdianPNBP.forEach(item => item.Prodi && prodiSet.add(item.Prodi));
        pengabdianPusat.forEach(item => item.Prodi && prodiSet.add(item.Prodi));
        haki.forEach(item => item.Prodi && prodiSet.add(item.Prodi));
        buku.forEach(item => item.Prodi && prodiSet.add(item.Prodi));
        jupeng.forEach(item => item.Prodi && prodiSet.add(item.Prodi));

        // Buat array data per prodi
        const prodiData = Array.from(prodiSet).map(prodi => {
            return {
                name: prodi,
                penelitian: {
                    pusat: penelitianPusat.filter(item => item.Prodi === prodi).length,
                    pnbp: penelitianPNBP.filter(item => item.Prodi === prodi).length,
                    mandiri: penelitianMandiri.filter(item => item.Prodi === prodi).length
                },
                pengabdian: {
                    pnbp: pengabdianPNBP.filter(item => item.Prodi === prodi).length,
                    pusat: pengabdianPusat.filter(item => item.Prodi === prodi).length
                },
                publikasi: {
                    haki: haki.filter(item => item.Prodi === prodi).length,
                    buku: buku.filter(item => item.Prodi === prodi).length,
                    jupeng: jupeng.filter(item => item.Prodi === prodi).length
                }
            };
        });

        // Urutkan berdasarkan nama prodi
        return prodiData.sort((a, b) => a.name.localeCompare(b.name));

    } catch (error) {
        console.error('Error getting prodi data:', error);
        return [];
    }
}

// API endpoint untuk mendapatkan data dashboard
router.get("/api/dashboard-data", async (req, res) => {
    try {
        const [totalHAKI, totalBuku, totalJupeng,
            totalPNBP, totalPusat, totalMandiri,
            totalPengabdianPNBP, totalPengabdianPusat, prodiData] = await Promise.all([
                hakiModel.countDocuments(),
                bukuModel.countDocuments(),
                jupengModel.countDocuments(),
                penelitianPNBPModel.countDocuments(),
                penelitianPusatModel.countDocuments(),
                penelitianMandiriModel.countDocuments(),
                pengabdianPNBPModel.countDocuments(),
                pengabdianPusatModel.countDocuments(),
                getProdiData()
            ]);

        const publikasiCounts = {
            "HAKI": totalHAKI,
            "Buku": totalBuku,
            "Jurnal Pengabdian": totalJupeng
        };

        const penelitianCounts = {
            "PNBP": totalPNBP,
            "Pusat": totalPusat,
            "Mandiri": totalMandiri
        };

        const pengabdianCounts = {
            "PNBP": totalPengabdianPNBP,
            "Pusat": totalPengabdianPusat
        };

        const penelitianStats = calculateStats({
            "PNBP": totalPNBP,
            "Pusat": totalPusat,
            "Mandiri": totalMandiri
        });

        const pengabdianStats = calculateStats({
            "PNBP": totalPengabdianPNBP,
            "Pusat": totalPengabdianPusat
        });

        const publikasiStats = calculateStats({
            "HAKI": totalHAKI,
            "Buku": totalBuku,
            "Jurnal Pengabdian": totalJupeng
        });

        let prodiOptions = await kategoriOptionModel.find({ kategori: 'Program Studi' });
        prodiOptions = prodiOptions.length > 0 ? prodiOptions[0].option : [];

        res.json({
            success: true,
            data: {
                publikasiCounts,
                penelitianCounts,
                pengabdianCounts,
                penelitianStats,
                pengabdianStats,
                publikasiStats,
                prodiData,
                prodiOptions
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data'
        });
    }
});

// API endpoint untuk mendapatkan prodi options saja
router.get("/api/prodi-options", async (req, res) => {
    try {
        let prodiOptions = await kategoriOptionModel.find({ kategori: 'Program Studi' });
        prodiOptions = prodiOptions.length > 0 ? prodiOptions[0].option : [];

        res.json({
            success: true,
            data: prodiOptions
        });
    } catch (error) {
        console.error('Error fetching prodi options:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching prodi options'
        });
    }
});

// Halaman utama
router.get("/", async (req, res) => {
    const isLogin = req.session.isLogin || false;
    const { languages } = require('../../config/lang');
    const currentLang = req.language || 'id';

    res.render("index", {
        title: "Home",
        isLogin,
        pageTranslations: JSON.stringify(languages[currentLang])
    });
});
module.exports = router;
