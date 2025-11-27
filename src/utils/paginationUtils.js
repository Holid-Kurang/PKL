/**
 * Pagination Utilities
 * Fungsi-fungsi untuk menghitung dan membangun pagination data
 */

/**
 * Calculate skip value untuk MongoDB query
 * @param {Number} page - Current page number (1-indexed)
 * @param {Number} limit - Items per page
 * @returns {Number} Skip value untuk MongoDB query
 */
const calculateSkip = (page, limit) => {
    return (page - 1) * limit;
};

/**
 * Calculate total pages
 * @param {Number} totalRecords - Total number of records
 * @param {Number} limit - Items per page
 * @returns {Number} Total pages
 */
const calculateTotalPages = (totalRecords, limit) => {
    return Math.ceil(totalRecords / limit);
};

/**
 * Build pagination object untuk response
 * @param {Number} page - Current page number
 * @param {Number} limit - Items per page
 * @param {Number} totalRecords - Total number of records
 * @returns {Object} Pagination object dengan currentPage, totalPages, totalRecords, limit, hasNextPage, hasPrevPage
 */
const buildPaginationObject = (page, limit, totalRecords) => {
    const totalPages = calculateTotalPages(totalRecords, limit);

    return {
        currentPage: page,
        totalPages,
        totalRecords,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    };
};

/**
 * Validate pagination parameters
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @param {Number} maxLimit - Maximum allowed limit (default: 1000)
 * @returns {Object} { isValid: Boolean, error: String }
 */
const validatePaginationParams = (page, limit, maxLimit = 1000) => {
    if (page < 1) {
        return { isValid: false, error: 'Page number harus lebih dari 0' };
    }

    if (limit < 1) {
        return { isValid: false, error: 'Limit harus lebih dari 0' };
    }

    if (limit > maxLimit) {
        return { isValid: false, error: `Limit tidak boleh lebih dari ${maxLimit}` };
    }

    return { isValid: true, error: null };
};

/**
 * Parse dan normalize pagination parameters dari request query
 * @param {Object} query - Request query object
 * @param {Object} defaults - Default values { page, limit }
 * @returns {Object} { page, limit }
 */
const parsePaginationParams = (query, defaults = { page: 1, limit: 50 }) => {
    const page = parseInt(query.page) || defaults.page;
    const limit = parseInt(query.limit) || defaults.limit;

    return { page, limit };
};

module.exports = {
    calculateSkip,
    calculateTotalPages,
    buildPaginationObject,
    validatePaginationParams,
    parsePaginationParams
};
