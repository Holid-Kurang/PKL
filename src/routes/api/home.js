const express = require("express");
const router = express.Router();
const homeStatsControl = require("../../controllers/homeStatsControl");

// API endpoint untuk mendapatkan data summary
router.get("/data-summary", homeStatsControl.getDataSummary);

// API endpoint untuk mendapatkan prodi options saja
router.get("/prodi-options", homeStatsControl.getProdiOptionsAPI);

module.exports = router;
