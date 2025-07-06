const express = require("express");
const router = express.Router();
const multer = require("multer");
const mandiriControl = require("../../../controllers/penelitian/mandiriControl");
const isLogin = require("../../../middlewares/isLogin");

// Konfigurasi Multer untuk menyimpan file di memori sementara
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Halaman utama
router.get("/dashboard/penelitian/mandiri", isLogin, mandiriControl.getAllData);
router.post("/dashboard/penelitian/mandiri/create", isLogin, mandiriControl.createData);
router.put("/dashboard/penelitian/mandiri/update/:id", isLogin, mandiriControl.updateData);
router.delete("/dashboard/penelitian/mandiri/delete/:id", isLogin, mandiriControl.deleteData);
router.get("/dashboard/penelitian/mandiri/export", isLogin, mandiriControl.exportData);
router.post("/dashboard/penelitian/mandiri/import", isLogin, upload.single("file"), mandiriControl.importData);

module.exports = router;