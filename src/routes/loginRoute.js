const express = require("express");
const router = express.Router();

// Halaman login
router.get("/login", (req, res) => {
    res.render("login", { error: null, success: null });
});

// Handle login
router.post("/login", (req, res) => {
    try {
        const { username, password } = req.body;

        // Validasi input
        if (!username || !password) {
            return res.status(400).render("login", {
                error: "Username dan password harus diisi",
                success: null
            });
        }

        // Cek panjang minimum
        if (username.length < 3) {
            return res.status(400).render("login", {
                error: "Username minimal 3 karakter",
                success: null
            });
        }

        // Simple authentication check
        if (username === "admin" && password === "admin") {
            req.session.isLogin = true;
            req.session.username = username;
            return res.redirect("/dashboard");
        }

        // Login gagal
        return res.status(401).render("login", {
            error: "Username atau password salah",
            success: null
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).render("login", {
            error: "Terjadi kesalahan sistem. Silakan coba lagi.",
            success: null
        });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({
                success: false,
                message: 'Gagal logout. Silakan coba lagi.'
            });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({
            success: true,
            message: 'Logout berhasil',
            redirect: '/'
        });
    });
});

router.get('/dashboard/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).render('login', {
                error: 'Gagal logout. Silakan coba lagi.',
                success: null
            });
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

module.exports = router;