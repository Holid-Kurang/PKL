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
    res.render("index", {
        title: "Home",
        isLogin,
        publikasiCounts,
        penelitianCounts,
        pengabdianCounts
    });
});

module.exports = router;
