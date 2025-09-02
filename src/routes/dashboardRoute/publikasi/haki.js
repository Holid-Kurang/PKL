const express = require("express");
const router = express.Router();
const multer = require("multer");
const hakiControl = require("../../../controllers/publikasi/hakiControl");
const isLogin = require("../../../middlewares/isLogin");

// Konfigurasi Multer untuk menyimpan file di memori sementara
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Halaman utama
router.get("/dashboard/publikasi/haki", isLogin, hakiControl.getAllData);
router.post("/dashboard/publikasi/haki/create", isLogin, hakiControl.createData);
router.put("/dashboard/publikasi/haki/update/:id", isLogin, hakiControl.updateData);
router.delete("/dashboard/publikasi/haki/delete/:id", isLogin, hakiControl.deleteData);
router.get("/dashboard/publikasi/haki/export", isLogin, hakiControl.exportData);
router.post("/dashboard/publikasi/haki/import", isLogin, upload.single("file"), hakiControl.importData);

module.exports = router;