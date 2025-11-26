const express = require("express");
const router = express.Router();
const kategoriControl = require("../controllers/kategoriControl");
const isLogin = require("../middlewares/isLogin");

// API routes untuk kategori management
router.get('/api/kategori', isLogin, kategoriControl.getAllKategori);
router.post('/api/kategori', isLogin, kategoriControl.addKategori);
router.put('/api/kategori/:id', isLogin, kategoriControl.updateKategori);
router.delete('/api/kategori/:id', isLogin, kategoriControl.deleteKategori);

// API routes untuk option management
router.post('/api/kategori/:id/option', isLogin, kategoriControl.addOption);
router.delete('/api/kategori/:id/option', isLogin, kategoriControl.removeOption);

// Route untuk render halaman pengaturan
router.get('/dashboard/pengaturan', isLogin, (req, res) => {
    res.render('dashboard/pengaturan', {
        title: 'Pengaturan Kategori'
    });
});

module.exports = router;
