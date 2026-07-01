const express = require("express");
const router = express.Router();
const { renderPublikasi } = require("../controllers/publikasiStatsControl");

// Halaman utama publikasi
router.get("/publikasi", renderPublikasi);

module.exports = router;
