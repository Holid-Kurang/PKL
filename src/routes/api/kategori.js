const express = require("express");
const router = express.Router();
const kategoriControl = require("../../controllers/kategoriControl");
const isLogin = require("../../middlewares/isLogin");

// API routes untuk kategori management
router.get('/kategori', isLogin, kategoriControl.getAllKategori);
router.post('/kategori', isLogin, kategoriControl.addKategori);
router.put('/kategori/:id', isLogin, kategoriControl.updateKategori);

// API routes untuk option management
router.post('/kategori/:id/option', isLogin, kategoriControl.addOption);
router.delete('/kategori/:id/option', isLogin, kategoriControl.removeOption);

module.exports = router;
