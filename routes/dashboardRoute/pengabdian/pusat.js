const express = require("express");
const router = express.Router();
const multer = require("multer");
const pusatControl = require("../../../controllers/pengabdian/pusatControl");
const isLogin = require("../../../middlewares/isLogin");

// Konfigurasi Multer untuk menyimpan file di memori sementara
const storage = multer.memoryStorage();
const upload = multer({ storage: storage});
// Halaman utama
router.get("/dashboard/pengabdian/pusat", isLogin, pusatControl.getAllData);
router.post("/dashboard/pengabdian/pusat/create", isLogin, pusatControl.createData);
router.put("/dashboard/pengabdian/pusat/update/:id", isLogin, pusatControl.updateData);
router.delete("/dashboard/pengabdian/pusat/delete/:id", isLogin, pusatControl.deleteData);
router.get("/dashboard/pengabdian/pusat/export", isLogin, pusatControl.exportData);
router.post("/dashboard/pengabdian/pusat/import", isLogin, upload.single("file"), pusatControl.importData);
router.get("/dashboard/pengabdian/pusat/template", isLogin, pusatControl.downloadTemplate);

module.exports = router;