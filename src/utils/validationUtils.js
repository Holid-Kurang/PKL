/**
 * Validation Utilities
 * Fungsi-fungsi untuk validasi data yang umum digunakan
 */

/**
 * Validate category terhadap whitelist models
 * @param {String} category - Category name
 * @param {Object} models - Object berisi mapping category ke model
 * @returns {Object} { isValid: Boolean, error: String }
 */
const validateCategory = (category, models) => {
    if (!models[category]) {
        return {
            isValid: false,
            error: 'Kategori tidak valid',
            validCategories: Object.keys(models)
        };
    }

    return { isValid: true, error: null };
};

/**
 * Validate request body tidak kosong
 * @param {Object} body - Request body
 * @returns {Object} { isValid: Boolean, error: String }
 */
const validateRequestBody = (body) => {
    if (!body || Object.keys(body).length === 0) {
        return { isValid: false, error: 'Data tidak boleh kosong' };
    }

    return { isValid: true, error: null };
};

/**
 * Validate required fields ada dalam object
 * @param {Object} data - Data object yang akan divalidasi
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} { isValid: Boolean, error: String, missingFields: Array }
 */
const validateRequiredFields = (data, requiredFields) => {
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
        return {
            isValid: false,
            error: `Field berikut wajib diisi: ${missingFields.join(', ')}`,
            missingFields
        };
    }

    return { isValid: true, error: null, missingFields: [] };
};

/**
 * Validate MongoDB ObjectId format
 * @param {String} id - ID yang akan divalidasi
 * @returns {Boolean} True jika valid ObjectId format
 */
const isValidObjectId = (id) => {
    const objectIdPattern = /^[a-f\d]{24}$/i;
    return objectIdPattern.test(id);
};

/**
 * Validate email format
 * @param {String} email - Email yang akan divalidasi
 * @returns {Boolean} True jika valid email format
 */
const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};

/**
 * Validate numeric string
 * @param {String|Number} value - Value yang akan divalidasi
 * @returns {Boolean} True jika value adalah number atau numeric string
 */
const isNumeric = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Sanitize string input (remove HTML tags)
 * @param {String} str - String yang akan di-sanitize
 * @returns {String} Cleaned string
 */
const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/<[^>]*>/g, '').trim();
};

module.exports = {
    validateCategory,
    validateRequestBody,
    validateRequiredFields,
    isValidObjectId,
    isValidEmail,
    isNumeric,
    sanitizeString
};
