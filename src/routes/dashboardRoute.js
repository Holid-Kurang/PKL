const express = require("express");
const router = express.Router();
const dashboardControl = require("../controllers/dashboardControl");
const isLogin = require("../middlewares/isLogin");
const { uploadSingle } = require("../middlewares/uploadMiddleware");

// API routes untuk backend dashboard
router.get('/api/dashboard/:category', isLogin, dashboardControl.getAllData);
router.post('/api/dashboard/:category/create', isLogin, dashboardControl.createData);
router.post('/api/dashboard/:category/update/:id', isLogin, dashboardControl.updateData);
router.delete('/api/dashboard/:category/delete/:id', isLogin, dashboardControl.deleteData);
router.post('/api/dashboard/:category/import', isLogin, uploadSingle, dashboardControl.importDataFromExcel);
router.get('/api/dashboard/:category/export', isLogin, dashboardControl.exportDataToExcel);
router.get('/api/dashboard/:category/template', isLogin, dashboardControl.downloadTemplate);

// Route untuk render halaman dashboard tanpa kategori (default)
router.get('/dashboard', isLogin, dashboardControl.renderDashboard);

// Route untuk render halaman dashboard dengan kategori spesifik (tabel CRUD)
router.get('/dashboard/:section/:category', isLogin, dashboardControl.renderDashboardTable);

module.exports = router;