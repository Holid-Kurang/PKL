const express = require("express");
const router = express.Router();
const multer = require("multer");
const pnbpControl = require("../../../controllers/penelitian/pnbpControl");
const isLogin = require("../../../middlewares/isLogin");

// Konfigurasi Multer untuk menyimpan file di memori sementara
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Halaman utama
router.get("/dashboard/penelitian/pnbp", isLogin, pnbpControl.getAllData);
router.post("/dashboard/penelitian/pnbp/create", isLogin, pnbpControl.createData);
router.put("/dashboard/penelitian/pnbp/update/:id", isLogin, pnbpControl.updateData);
router.delete("/dashboard/penelitian/pnbp/delete/:id", isLogin, pnbpControl.deleteData);
router.get("/dashboard/penelitian/pnbp/export", isLogin, pnbpControl.exportData);
router.post("/dashboard/penelitian/pnbp/import", isLogin, upload.single("file"), pnbpControl.importData);

module.exports = router;