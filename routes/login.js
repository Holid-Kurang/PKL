const express = require("express");
const router = express.Router();

// Halaman utama
router.get("/login", (req, res) => {
    res.render("login");
});

module.exports = router;