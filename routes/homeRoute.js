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

// Halaman utama
router.get("/", async (req, res) => {
    const isLogin = req.session.isLogin || false;
    const [totalHAKI, totalBuku, totalJupeng,
        totalPNBP, totalPusat, totalMandiri,
        totalPengabdianPNBP, totalPengabdianPusat] = await Promise.all([
            hakiModel.countDocuments(),
            bukuModel.countDocuments(),
            jupengModel.countDocuments(),
            penelitianPNBPModel.countDocuments(),
            penelitianPusatModel.countDocuments(),
            penelitianMandiriModel.countDocuments(),
            pengabdianPNBPModel.countDocuments(),
            pengabdianPusatModel.countDocuments()
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
    res.render("index", {
        title: "Home",
        isLogin,
        publikasiCounts,
        penelitianCounts,
        pengabdianCounts,
        penelitianStats, 
        pengabdianStats,  
        publikasiStats
    });
});

module.exports = router;
