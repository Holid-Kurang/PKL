const express = require("express");
const router = express.Router();

// Halaman utama
router.get("/login", (req, res) => {
    res.render("login");
});
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Simple authentication check
    if (username === "admin" && password === "admin") {
        req.session.isLogin = true;
        return res.redirect("/");
    }
    res.status(401).render("login", { error: "Invalid credentials" });
});

router.get('/dashboard/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to destroy session');
        }
        res.status(200).redirect('/');
    });
});



module.exports = router;