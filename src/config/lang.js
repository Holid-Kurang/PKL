const idLang = require('./languages/id');
const enLang = require('./languages/en');

const languages = {
    'id': idLang,
    'en': enLang
};

// Helper function untuk mendapatkan terjemahan
const getTranslation = (lang, key) => {
    const keys = key.split('.');
    let value = languages[lang];
    
    for (const k of keys) {
        value = value ? value[k] : undefined;
    }
    
    return value || key;
};

module.exports = {
    languages,
    getTranslation,
    defaultLanguage: 'id',
    availableLanguages: Object.keys(languages)
};