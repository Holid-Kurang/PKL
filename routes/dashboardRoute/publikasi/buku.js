const express = require("express");
const router = express.Router();

const bukuControl = require("../../../controllers/publikasi/bukuControl");

// Halaman utama
router.get("/dashboard/publikasi/buku", isAuthenticated, bukuControl.getAllData);
router.post("/dashboard/publikasi/buku/create", isAuthenticated, bukuControl.createData);
router.post("/dashboard/publikasi/buku/update/:id", isAuthenticated, bukuControl.updateData);
router.post("/dashboard/publikasi/buku/delete/:id", isAuthenticated, bukuControl.deleteData);
router.get("/dashboard/publikasi/buku/export", isAuthenticated, bukuControl.exportData);


// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.isLogin) {
        return next();
    }
    res.send(`<script>alert('Unauthorized: Please log in first'); window.location.href = '/login';</script>`);
}

module.exports = router;