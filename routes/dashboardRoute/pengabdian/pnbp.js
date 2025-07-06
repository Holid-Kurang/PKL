const express = require("express");
const router = express.Router();
const multer = require("multer");
const pnbpControl = require("../../../controllers/pengabdian/pnbpControl");
const isLogin = require("../../../middlewares/isLogin");

// Konfigurasi Multer untuk menyimpan file di memori sementara
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Halaman utama
router.get("/dashboard/pengabdian/pnbp", isLogin, pnbpControl.getAllData);
router.post("/dashboard/pengabdian/pnbp/create", isLogin, pnbpControl.createData);
router.put("/dashboard/pengabdian/pnbp/update/:id", isLogin, pnbpControl.updateData);
router.delete("/dashboard/pengabdian/pnbp/delete/:id", isLogin, pnbpControl.deleteData);
router.get("/dashboard/pengabdian/pnbp/export", isLogin, pnbpControl.exportData);
router.post("/dashboard/pengabdian/pnbp/import", isLogin, upload.single("file"), pnbpControl.importData);

module.exports = router;