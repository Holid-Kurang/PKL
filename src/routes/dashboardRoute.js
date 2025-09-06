const express = require("express");
const router = express.Router();
const dashboardControl = require("../controllers/dashboardControl");
const isLogin = require("../middlewares/isLogin")

// API routes untuk backend dashboard
router.get('/api/dashboard/:category', isLogin, dashboardControl.getAllData);
router.post('/api/dashboard/:category', isLogin, dashboardControl.createData);

// Route untuk render halaman dashboard
router.get('/dashboard', isLogin, dashboardControl.renderDashboard);

module.exports = router;