const express = require("express");
const router = express.Router();
const isLogin = require("../../middlewares/isLogin");

// Route untuk render halaman pengaturan
router.get('/dashboard/pengaturan', isLogin, (req, res) => {
    res.render('dashboard/pengaturan', {
        title: 'Pengaturan'
    });
});

module.exports = router;
