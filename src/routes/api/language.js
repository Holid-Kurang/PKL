const express = require('express');
const router = express.Router();
const { availableLanguages } = require('../../config/lang');

// Route untuk mengubah bahasa
router.post('/change-language', (req, res) => {
    const { language } = req.body;
    
    if (!availableLanguages.includes(language)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid language' 
        });
    }
    
    // Simpan bahasa di session dan cookie
    if (req.session) {
        req.session.language = language;
    }
    
    res.cookie('language', language, { 
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 tahun
        httpOnly: true 
    });
    
    res.json({ 
        success: true, 
        message: 'Language changed successfully',
        language: language
    });
});

// Route untuk mendapatkan bahasa saat ini
router.get('/current-language', (req, res) => {
    const currentLang = req.session?.language || req.cookies?.language || 'id';
    res.json({
        success: true,
        language: currentLang
    });
});

module.exports = router;
