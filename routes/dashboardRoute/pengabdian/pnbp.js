const express = require("express");
const router = express.Router();
const multer = require("multer");
const pnbpControl = require("../../../controllers/pengabdian/pnbpControl");

// Konfigurasi Multer untuk menyimpan file di memori sementara
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Halaman utama
router.get("/dashboard/pengabdian/pnbp", isAuthenticated, pnbpControl.getAllData);
router.post("/dashboard/pengabdian/pnbp/create", isAuthenticated, pnbpControl.createData);
router.put("/dashboard/pengabdian/pnbp/update/:id", isAuthenticated, pnbpControl.updateData);
router.delete("/dashboard/pengabdian/pnbp/delete/:id", isAuthenticated, pnbpControl.deleteData);
router.get("/dashboard/pengabdian/pnbp/export", isAuthenticated, pnbpControl.exportData);
router.post("/dashboard/pengabdian/pnbp/import", isAuthenticated, upload.single("file"), pnbpControl.importData);


// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.isLogin) {
        return next();
    }
    res.send(`<script>alert('Unauthorized: Please log in first'); window.location.href = '/login';</script>`);
}

module.exports = router;