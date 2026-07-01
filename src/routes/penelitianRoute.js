const express = require("express");
const router = express.Router();
const { renderPenelitian } = require("../controllers/penelitianStatsControl");

// Halaman utama penelitian
router.get("/penelitian", renderPenelitian);

module.exports = router;
