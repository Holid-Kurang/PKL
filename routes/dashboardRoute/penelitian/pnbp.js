const express = require("express");
const router = express.Router();
const multer = require("multer");
const pnbpControl = require("../../../controllers/penelitian/pnbpControl");

// Konfigurasi Multer untuk menyimpan file di memori sementara
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Halaman utama
router.get("/dashboard/penelitian/pnbp", isAuthenticated, pnbpControl.getAllData);
router.post("/dashboard/penelitian/pnbp/create", isAuthenticated, pnbpControl.createData);
router.post("/dashboard/penelitian/pnbp/update/:id", isAuthenticated, pnbpControl.updateData);
router.post("/dashboard/penelitian/pnbp/delete/:id", isAuthenticated, pnbpControl.deleteData);
router.get("/dashboard/penelitian/pnbp/export", isAuthenticated, pnbpControl.exportData);
router.post("/dashboard/penelitian/pnbp/import", isAuthenticated, upload.single("file"), pnbpControl.importData);

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.isLogin) {
        return next();
    }
    res.send(`<script>alert('Unauthorized: Please log in first'); window.location.href = '/login';</script>`);
}

module.exports = router;