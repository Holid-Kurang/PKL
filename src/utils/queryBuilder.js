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

/**
 * Build filter query untuk tahun dan prodi
 * @param {String|Number} tahun - Filter tahun (opsional)
 * @param {String} prodi - Filter prodi (opsional)
 * @param {Object} modelSchema - Mongoose model schema object
 * @returns {Object} MongoDB filter query object
 */
const buildFilterQuery = (tahun, prodi, modelSchema) => {
    const filterConditions = {};

    // Cari field yang berisi 'tahun' (case-insensitive) dengan tipe Number atau String
    if (tahun) {
        const tahunField = Object.keys(modelSchema).find(key =>
            key.toLowerCase().includes('tahun')
        );
        if (tahunField) {
            const fieldType = modelSchema[tahunField].type || modelSchema[tahunField];
            if (fieldType === Number) {
                filterConditions[tahunField] = Number(tahun);
            } else {
                filterConditions[tahunField] = String(tahun);
            }
        }
    }

    // Cari field yang berisi 'prodi' (case-insensitive) dengan tipe String
    if (prodi) {
        const prodiField = Object.keys(modelSchema).find(key =>
            key.toLowerCase().includes('prodi')
        );
        if (prodiField) {
            filterConditions[prodiField] = prodi;
        }
    }

    return filterConditions;
};

/**
 * Gabungkan search query dan filter query
 * @param {Object} searchQuery - Query dari buildSearchQuery
 * @param {Object} filterQuery - Query dari buildFilterQuery
 * @returns {Object} Combined MongoDB query
 */
const buildCombinedQuery = (searchQuery, filterQuery) => {
    const hasSearch = searchQuery && Object.keys(searchQuery).length > 0;
    const hasFilter = filterQuery && Object.keys(filterQuery).length > 0;

    if (!hasSearch && !hasFilter) return {};
    if (!hasFilter) return searchQuery;
    if (!hasSearch) return filterQuery;

    // Gabungkan $or dari search dengan filter lainnya menggunakan $and
    return {
        $and: [
            searchQuery,
            filterQuery
        ]
    };
};

module.exports = {
    buildSearchQuery,
    buildSortObject,
    buildFilterQuery,
    buildCombinedQuery
};
