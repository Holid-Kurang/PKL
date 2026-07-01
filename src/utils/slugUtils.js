/**
 * Convert a prodi name into a URL-friendly slug.
 * 
 * @param {string} prodiName - The program studi name
 * @returns {string} URL slug
 */
function createProdiSlug(prodiName) {
    return prodiName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');
}

module.exports = { createProdiSlug };
