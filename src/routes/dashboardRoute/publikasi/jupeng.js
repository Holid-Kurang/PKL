const express = require("express");
const router = express.Router();
const multer = require("multer");
const jupengControl = require("../../../controllers/publikasi/jupengControl");
const isLogin = require("../../../middlewares/isLogin");

// Konfigurasi Multer untuk menyimpan file di memori sementara
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Halaman utama
router.get("/dashboard/publikasi/jupeng", isLogin, jupengControl.getAllData);
router.post("/dashboard/publikasi/jupeng/create", isLogin, jupengControl.createData);
router.put("/dashboard/publikasi/jupeng/update/:id", isLogin, jupengControl.updateData);
router.delete("/dashboard/publikasi/jupeng/delete/:id", isLogin, jupengControl.deleteData);
router.get("/dashboard/publikasi/jupeng/export", isLogin, jupengControl.exportData);
router.post("/dashboard/publikasi/jupeng/import", isLogin, upload.single("file"), jupengControl.importData);

module.exports = router;