const express = require("express");
const router = express.Router();
const homeStatsControl = require("../controllers/homeStatsControl");

// API endpoint untuk mendapatkan data dashboard
router.get("/api/dashboard/summary", homeStatsControl.getDashboardSummary);

// API endpoint untuk mendapatkan prodi options saja
router.get("/api/prodi-options", homeStatsControl.getProdiOptionsAPI);

// Halaman utama
router.get("/", homeStatsControl.renderHome);

module.exports = router;