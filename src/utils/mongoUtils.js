/**
 * MongoDB Utilities
 * Fungsi-fungsi helper untuk operasi MongoDB
 */

/**
 * Transform MongoDB Long type ke String
 * @param {Array} data - Array of MongoDB documents
 * @param {Array} fields - Array of field names yang perlu di-transform
 * @returns {Array} Transformed data dengan Long types converted to strings
 */
const transformMongoLongToString = (data, fields = ['pengguna_kode', '_personil_data_ketua_kode']) => {
    return data.map(item => {
        const transformed = { ...item };

        fields.forEach(field => {
            if (transformed[field] && typeof transformed[field] === 'object') {
                transformed[field] = transformed[field].toString();
            }
        });

        return transformed;
    });
};

/**
 * Get searchable fields dari model schema
 * @param {Object} modelSchema - Mongoose model schema object
 * @param {Array} excludeFields - Fields yang tidak boleh di-search
 * @returns {Array} Array of searchable field names
 */
const getSearchableFields = (modelSchema, excludeFields = ['createdAt', 'updatedAt', '__v', '_id']) => {
    return Object.keys(modelSchema).filter(key => !excludeFields.includes(key));
};

module.exports = {
    transformMongoLongToString,
    getSearchableFields
};
