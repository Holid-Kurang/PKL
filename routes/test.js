const express = require("express");
const router = express.Router();

// Halaman utama
router.get("/test", (req, res) => {
    res.render("test");
});

module.exports = router;