const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');

// Halaman login
router.get("/login", (req, res) => {
    res.render("login", { error: null, success: false, title: "Login" });
});

// Handle login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validasi input
        if (!username || !password) {
            return res.status(400).render("login", {
                error: "Username dan password harus diisi",
                success: false, title: "Login"
            });
        }

        // Cek panjang minimum
        if (username.length < 3) {
            return res.status(400).render("login", {
                error: "Username minimal 3 karakter",
                success: false, title: "Login"
            });
        }

        // Get admin credentials from environment
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        // Check if admin credentials are properly configured
        if (!adminPasswordHash) {
            logger.error('ADMIN_PASSWORD_HASH not configured in environment');
            return res.status(500).render("login", {
                error: "Terjadi kesalahan konfigurasi sistem",
                success: false, title: "Login"
            });
        }

        // Verify username and password
        if (username === adminUsername) {
            const isValidPassword = await bcrypt.compare(password, adminPasswordHash);

            if (isValidPassword) {
                // Regenerate session ID to prevent session fixation
                req.session.regenerate((err) => {
                    if (err) {
                        logger.error('Session regeneration error:', err);
                        return res.status(500).render("login", {
                            error: "Terjadi kesalahan saat login",
                            success: false, title: "Login"
                        });
                    }

                    // Set session data
                    req.session.isLogin = true;
                    req.session.username = username;
                    req.session.loginTime = new Date();

                    // Save session
                    req.session.save((err) => {
                        if (err) {
                            logger.error('Session save error:', err);
                            return res.status(500).render("login", {
                                error: "Terjadi kesalahan saat menyimpan sesi",
                                success: false, title: "Login"
                            });
                        }

                        logger.info(`User ${username} logged in successfully`);
                        return res.redirect("/dashboard");
                    });
                });
                return;
            }
        }

        // Login gagal
        logger.warn(`Failed login attempt for username: ${username}`);
        return res.status(401).render("login", {
            error: "Username atau password salah",
            success: false, title: "Login"
        });
    } catch (error) {
        logger.error('Login error:', error);
        return res.status(500).render("login", {
            error: "Terjadi kesalahan sistem. Silakan coba lagi.",
            success: false, title: "Login"
        });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            logger.error('Logout error:', err);
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

module.exports = router;