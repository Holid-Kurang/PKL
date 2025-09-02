const express = require("express");
const router = express.Router();
const multer = require("multer");
const bukuControl = require("../../../controllers/publikasi/bukuControl");
const isLogin = require("../../../middlewares/isLogin");

// Konfigurasi Multer untuk menyimpan file di memori sementara
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Halaman utama
router.get("/dashboard/publikasi/buku", isLogin, bukuControl.getAllData);
router.post("/dashboard/publikasi/buku/create", isLogin, bukuControl.createData);
router.put("/dashboard/publikasi/buku/update/:id", isLogin, bukuControl.updateData);
router.delete("/dashboard/publikasi/buku/delete/:id", isLogin, bukuControl.deleteData);
router.get("/dashboard/publikasi/buku/export", isLogin, bukuControl.exportData);
router.post("/dashboard/publikasi/buku/import", isLogin, upload.single("file"), bukuControl.importData);

module.exports = router;