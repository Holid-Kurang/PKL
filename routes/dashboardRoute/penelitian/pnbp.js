const express = require("express");
const router = express.Router();

// Halaman utama
router.get("/dashboard/penelitian/pnbp", isAuthenticated, (req, res) => {
    res.render("dashboard/penelitian/dash-pnbp");
});

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.isLogin) {
        return next();
    }
    res.send(`<script>alert('Unauthorized: Please log in first'); window.location.href = '/login';</script>`);
}

module.exports = router;