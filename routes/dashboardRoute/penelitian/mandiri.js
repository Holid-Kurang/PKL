const express = require("express");
const router = express.Router();
const multer = require("multer");
const mandiriControl = require("../../../controllers/penelitian/mandiriControl");

// Konfigurasi Multer untuk menyimpan file di memori sementara
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Halaman utama
router.get("/dashboard/penelitian/mandiri", isAuthenticated, mandiriControl.getAllData);
router.post("/dashboard/penelitian/mandiri/create", isAuthenticated, mandiriControl.createData);
router.post("/dashboard/penelitian/mandiri/update/:id", isAuthenticated, mandiriControl.updateData);
router.post("/dashboard/penelitian/mandiri/delete/:id", isAuthenticated, mandiriControl.deleteData);
router.get("/dashboard/penelitian/mandiri/export", isAuthenticated, mandiriControl.exportData);
router.post("/dashboard/penelitian/mandiri/import", isAuthenticated, upload.single("file"), mandiriControl.importData);


// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.isLogin) {
        return next();
    }
    res.send(`<script>alert('Unauthorized: Please log in first'); window.location.href = '/login';</script>`);
}

module.exports = router;