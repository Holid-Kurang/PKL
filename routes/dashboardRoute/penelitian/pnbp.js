const express = require("express");
const router = express.Router();

// Halaman utama
router.get("/dashboard/penelitian/pnbp", (req, res) => {
    res.render("dashboard/penelitian/dash-pnbp");
});

module.exports = router;