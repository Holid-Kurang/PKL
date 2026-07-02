const express = require("express");
const router = express.Router();
const dashboardControl = require("../../controllers/dashboardControl");
const isLogin = require("../../middlewares/isLogin");
const { uploadSingle } = require("../../middlewares/uploadMiddleware");

// API routes untuk backend dashboard
router.get('/dashboard/:category', isLogin, dashboardControl.getAllData);
router.post('/dashboard/:category/create', isLogin, dashboardControl.createData);
router.post('/dashboard/:category/update/:id', isLogin, dashboardControl.updateData);
router.delete('/dashboard/:category/delete/:id', isLogin, dashboardControl.deleteData);
router.post('/dashboard/:category/import', isLogin, uploadSingle, dashboardControl.importDataFromExcel);
router.get('/dashboard/:category/export', isLogin, dashboardControl.exportDataToExcel);
router.get('/dashboard/:category/template', isLogin, dashboardControl.downloadTemplate);

module.exports = router;
