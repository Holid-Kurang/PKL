const express = require("express");
const router = express.Router();
const multer = require("multer");
const bukuControl = require("../../../controllers/publikasi/bukuControl");

// Konfigurasi Multer untuk menyimpan file di memori sementara
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Halaman utama
router.get("/dashboard/publikasi/buku", isAuthenticated, bukuControl.getAllData);
router.post("/dashboard/publikasi/buku/create", isAuthenticated, bukuControl.createData);
router.put("/dashboard/publikasi/buku/update/:id", isAuthenticated, bukuControl.updateData);
router.delete("/dashboard/publikasi/buku/delete/:id", isAuthenticated, bukuControl.deleteData);
router.get("/dashboard/publikasi/buku/export", isAuthenticated, bukuControl.exportData);
router.post("/dashboard/publikasi/buku/import", isAuthenticated, upload.single("file"), bukuControl.importData);

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.isLogin) {
        return next();
    }
    res.send(`<script>alert('Unauthorized: Please log in first'); window.location.href = '/login';</script>`);
}

module.exports = router;