const express = require("express");
const router = express.Router();

// Halaman utama
router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", (req, res) => {
    
    const { username, password } = req.body;
    
    // Simulasi login
    console.log(req.body);
    if (username === "admin" && password === "admin") {
        req.session.isLogin = true;
        res.redirect("/");
    } else {
        res.render("login");
    }
});

module.exports = router;