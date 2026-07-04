const kategoriOptionModel = require('../models/kategoriOptionModel');
const { getOrSet } = require('./cacheService');

/**
 * Get all Program Studi options from the database.
 * Results are cached with key 'kategori:prodi'.
 * 
 * @returns {Promise<string[]>} Array of prodi names
 */
async function getProdiOptions() {
    return getOrSet('kategori:prodi', async () => {
        const result = await kategoriOptionModel.find({ kategori: 'Program Studi' });
        return result.length > 0 ? result[0].option : [];
    });
}

/**
 * Get options for a specific kategori.
 * Results are cached with key 'kategori:{kategoriName}'.
 * 
 * @param {string} kategori - The kategori name to look up
 * @returns {Promise<string[]>} Array of option values
 */
async function getKategoriOptions(kategori) {
    const cacheKey = `kategori:${kategori}`;
    return getOrSet(cacheKey, async () => {
        const result = await kategoriOptionModel.find({ kategori });
        return result.length > 0 ? result[0].option : [];
    });
}

module.exports = { getProdiOptions, getKategoriOptions };
