const kategoriOptionModel = require('../models/kategoriOptionModel');

/**
 * Get all Program Studi options from the database.
 * 
 * @returns {Promise<string[]>} Array of prodi names
 */
async function getProdiOptions() {
    const result = await kategoriOptionModel.find({ kategori: 'Program Studi' });
    return result.length > 0 ? result[0].option : [];
}

/**
 * Get options for a specific kategori.
 * 
 * @param {string} kategori - The kategori name to look up
 * @returns {Promise<string[]>} Array of option values
 */
async function getKategoriOptions(kategori) {
    const result = await kategoriOptionModel.find({ kategori });
    return result.length > 0 ? result[0].option : [];
}

module.exports = { getProdiOptions, getKategoriOptions };
