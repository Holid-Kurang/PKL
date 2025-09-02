const express = require("express");
const router = express.Router();

const prodiController = require("../controllers/prodiControl");

// Route dinamis untuk semua prodi berdasarkan slug
router.get("/prodi/:prodi", prodiController.getProdiStats);

module.exports = router;