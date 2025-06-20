const express = require("express");
const router = express.Router();
const multer = require("multer");
const pusatControl = require("../../../controllers/penelitian/pusatControl");

// Konfigurasi Multer untuk menyimpan file di memori sementara
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Halaman utama
router.get("/dashboard/penelitian/pusat", isAuthenticated, pusatControl.getAllData);
router.post("/dashboard/penelitian/pusat/create", isAuthenticated, pusatControl.createData);
router.post("/dashboard/penelitian/pusat/update/:id", isAuthenticated, pusatControl.updateData);
router.post("/dashboard/penelitian/pusat/delete/:id", isAuthenticated, pusatControl.deleteData);
router.get("/dashboard/penelitian/pusat/export", isAuthenticated, pusatControl.exportData);
router.post("/dashboard/penelitian/pusat/import", isAuthenticated, upload.single("file"), pusatControl.importData);

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.isLogin) {
        return next();
    }
    res.send(`<script>alert('Unauthorized: Please log in first'); window.location.href = '/login';</script>`);
}

module.exports = router;