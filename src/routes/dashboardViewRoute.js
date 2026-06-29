const express = require("express");
const router = express.Router();
const dashboardControl = require("../controllers/dashboardControl");
const isLogin = require("../middlewares/isLogin");

// Route untuk render halaman dashboard tanpa kategori (default)
router.get('/dashboard', isLogin, dashboardControl.renderDashboard);
// Route untuk render halaman dashboard dengan kategori spesifik (tabel CRUD)
router.get('/dashboard/:section/:category', isLogin, dashboardControl.renderDashboardTable);

module.exports = router;