const express = require("express");
const router = express.Router();
const { renderPengabdian } = require("../../controllers/pengabdianStatsControl");

// Halaman utama pengabdian
router.get("/pengabdian", renderPengabdian);

module.exports = router;
