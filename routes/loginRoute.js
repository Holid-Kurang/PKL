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

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to destroy session');
        }
        res.status(200).send('Logged out successfully');
    });
});


module.exports = router;