const express = require("express");
const router = express.Router();
const multer = require("multer");
const jupengControl = require("../../../controllers/publikasi/jupengControl");

// Konfigurasi Multer untuk menyimpan file di memori sementara
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Halaman utama
router.get("/dashboard/publikasi/jupeng", isAuthenticated, jupengControl.getAllData);
router.post("/dashboard/publikasi/jupeng/create", isAuthenticated, jupengControl.createData);
router.put("/dashboard/publikasi/jupeng/update/:id", isAuthenticated, jupengControl.updateData);
router.delete("/dashboard/publikasi/jupeng/delete/:id", isAuthenticated, jupengControl.deleteData);
router.get("/dashboard/publikasi/jupeng/export", isAuthenticated, jupengControl.exportData);
router.post("/dashboard/publikasi/jupeng/import", isAuthenticated, upload.single("file"), jupengControl.importData);

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.isLogin) {
        return next();
    }
    res.send(`<script>alert('Unauthorized: Please log in first'); window.location.href = '/login';</script>`);
}

module.exports = router;