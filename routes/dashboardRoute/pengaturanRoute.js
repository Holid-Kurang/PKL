const express = require('express');
const router = express.Router();
const isLogin = require('../../middlewares/isLogin');
const kategoriControl = require('../../controllers/kategoriControl');

// Render pengaturan page
router.get('/dashboard/pengaturan', isLogin, (req, res) => {
    res.render('dashboard/pengaturan', {
        title: 'Pengaturan Kategori',
        isLogin: req.session.isLogin
    });
});

// API routes for kategori management
router.get('/api/kategori', isLogin, kategoriControl.getAllKategori);
router.post('/api/kategori', isLogin, kategoriControl.addKategori);
router.put('/api/kategori/:id', isLogin, kategoriControl.updateKategori);
router.delete('/api/kategori/:id', isLogin, kategoriControl.deleteKategori);
router.post('/api/kategori/:id/option', isLogin, kategoriControl.addOption);
router.delete('/api/kategori/:id/option', isLogin, kategoriControl.removeOption);

module.exports = router;
