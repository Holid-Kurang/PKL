const express = require("express");
const router = express.Router();
const multer = require("multer");
const dashboardControl = require("../controllers/dashboardControl");
const isLogin = require("../middlewares/isLogin")

// Konfigurasi Multer untuk menyimpan file di memori sementara
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// API routes untuk backend dashboard
router.get('/api/dashboard/:category', isLogin, dashboardControl.getAllData);
router.post('/api/dashboard/:category/create', isLogin, dashboardControl.createData);
router.post('/api/dashboard/:category/update/:id', isLogin, dashboardControl.updateData);
router.delete('/api/dashboard/:category/delete/:id', isLogin, dashboardControl.deleteData);
router.post('/api/dashboard/:category/import', isLogin, upload.single("file"), dashboardControl.importDataFromExcel);
router.get('/api/dashboard/:category/export', isLogin, dashboardControl.exportDataToExcel);

// Route untuk render halaman dashboard tanpa kategori (default)
router.get('/dashboard', isLogin, dashboardControl.renderDashboard);

module.exports = router;