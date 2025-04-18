const express = require("express");
const router = express.Router();

// Halaman utama
router.get("/", (req, res) => {
    const isLogin = req.session.isLogin || false;
    res.render("index", { title: "Home", isLogin: isLogin });
});

module.exports = router;
