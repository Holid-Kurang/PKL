const express = require("express");
const router = express.Router();
const multer = require("multer");
const pusatControl = require("../../../controllers/penelitian/pusatControl");
const isLogin = require("../../../middlewares/isLogin");

// Konfigurasi Multer untuk menyimpan file di memori sementara
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Halaman utama
router.get("/dashboard/penelitian/pusat", isLogin, pusatControl.getAllData);
router.post("/dashboard/penelitian/pusat/create", isLogin, pusatControl.createData);
router.put("/dashboard/penelitian/pusat/update/:id", isLogin, pusatControl.updateData);
router.delete("/dashboard/penelitian/pusat/delete/:id", isLogin, pusatControl.deleteData);
router.get("/dashboard/penelitian/pusat/export", isLogin, pusatControl.exportData);
router.post("/dashboard/penelitian/pusat/import", isLogin, upload.single("file"), pusatControl.importData);


module.exports = router;