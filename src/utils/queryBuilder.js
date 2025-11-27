/**
 * Query Builder Utilities
 * Fungsi-fungsi untuk membangun MongoDB queries secara dinamis
 */

/**
 * Build search query berdasarkan model schema
 * @param {String} searchTerm - Search term dari user
 * @param {Object} modelSchema - Mongoose model schema object
 * @param {Array} excludeFields - Fields yang tidak boleh di-search
 * @returns {Object} MongoDB query object dengan $or operator
 */
const buildSearchQuery = (searchTerm, modelSchema, excludeFields = ['createdAt', 'updatedAt', '__v', '_id']) => {
    if (!searchTerm) {
        return {};
    }

    // Get searchable fields
    const searchableFields = Object.keys(modelSchema).filter(key =>
        !excludeFields.includes(key)
    );

    // Build $or query for all searchable fields
    const orConditions = searchableFields.map(field => {
        const fieldType = modelSchema[field].type || modelSchema[field];

        // For string fields, use regex search (case-insensitive)
        if (fieldType === String || (Array.isArray(fieldType) && fieldType[0] === String)) {
            return { [field]: { $regex: searchTerm, $options: 'i' } };
        }

        // For number fields, try exact match if search is a number
        if (fieldType === Number && !isNaN(searchTerm)) {
            return { [field]: Number(searchTerm) };
        }

        return null;
    }).filter(query => query !== null);

    // Return empty object if no valid conditions
    if (orConditions.length === 0) {
        return {};
    }

    return { $or: orConditions };
};

/**
 * Build sort object dari query parameters
 * @param {String} sortBy - Field name untuk sorting
 * @param {String} sortOrder - 'asc' atau 'desc'
 * @returns {Object} MongoDB sort object
 */
const buildSortObject = (sortBy = 'createdAt', sortOrder = 'desc') => {
    const order = sortOrder === 'asc' ? 1 : -1;
    return { [sortBy]: order };
};

module.exports = {
    buildSearchQuery,
    buildSortObject
};
