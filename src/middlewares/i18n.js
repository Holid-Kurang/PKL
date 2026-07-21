const { languages, getTranslation, defaultLanguage } = require('../config/lang');

const i18n = (req, res, next) => {
    // Ambil bahasa dari session, cookie, atau default
    const lang = req.session?.language || req.cookies?.language || defaultLanguage;
    
    // Validasi bahasa yang dipilih
    const validLang = languages[lang] ? lang : defaultLanguage;
    
    // Set helper function untuk template
    res.locals.translate = (key) => {
        return getTranslation(validLang, key);
    };
    
    // Set informasi bahasa
    res.locals.currentLang = validLang;
    res.locals.availableLanguages = Object.keys(languages);
    
    // Set bahasa di request untuk penggunaan di controller
    req.language = validLang;
    
    next();
};

module.exports = i18n;
