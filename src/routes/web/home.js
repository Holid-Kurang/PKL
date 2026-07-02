const express = require("express");
const router = express.Router();
const homeStatsControl = require("../../controllers/homeStatsControl");

// Halaman utama
router.get("/", homeStatsControl.renderHome);

module.exports = router;
