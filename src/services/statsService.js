const modelFieldMap = require('../config/modelFieldMap');

/**
 * Build a MongoDB $match stage from filter options.
 * Returns null if no filters apply.
 */
function buildMatchStage(config, { prodiFilter, yearFilter } = {}) {
    const match = {};
    if (prodiFilter && config.prodiField) match[config.prodiField] = prodiFilter;
    if (yearFilter != null && config.yearField) match[config.yearField] = yearFilter;
    return Object.keys(match).length > 0 ? match : null;
}

/**
 * Build all available facet pipelines for a given model config.
 * Each facet gets its own optional $match stage (inside the facet branch).
 * 
 * @param {Object} config - Model config from modelFieldMap
 * @param {Object|null} match - Match criteria to prepend to each facet branch
 * @returns {Object} Map of facet name → pipeline definition
 */
function buildAvailableFacets(config, match) {
    const m = match ? [{ $match: match }] : [];
    const alias = config.countAlias || 'total';

    const facets = {};

    // Count per year
    if (config.yearField) {
        facets.jumlahPerTahun = [
            ...m,
            { $group: { _id: `$${config.yearField}`, [alias]: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ];
    }

    // Count per prodi
    if (config.prodiField) {
        facets.jumlahPerProdi = [
            ...m,
            { $group: { _id: `$${config.prodiField}`, [alias]: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ];
    }

    // Sum cost per year
    if (config.costField && config.yearField) {
        facets.jumlahDanaPerTahun = [
            ...m,
            { $group: { _id: `$${config.yearField}`, total: { $sum: `$${config.costField}` } } },
            { $sort: { _id: 1 } }
        ];
    }

    // Sum cost per prodi
    if (config.costField && config.prodiField) {
        facets.jumlahDanaPerProdi = [
            ...m,
            { $group: { _id: `$${config.prodiField}`, total: { $sum: `$${config.costField}` } } },
            { $sort: { _id: 1 } }
        ];
    }

    // Avg cost per year
    if (config.costField && config.yearField) {
        facets.avgDanaPerTahun = [
            ...m,
            { $group: { _id: `$${config.yearField}`, avg: { $avg: `$${config.costField}` } } },
            { $sort: { _id: 1 } }
        ];
    }

    // Avg cost per prodi
    if (config.costField && config.prodiField) {
        facets.avgDanaPerProdi = [
            ...m,
            { $group: { _id: `$${config.prodiField}`, avg: { $avg: `$${config.costField}` } } },
            { $sort: { _id: 1 } }
        ];
    }

    // Avg score per year
    if (config.scoreField && config.yearField) {
        facets.avgNilaiPerTahun = [
            ...m,
            { $group: { _id: `$${config.yearField}`, avg: { $avg: `$${config.scoreField}` } } },
            { $sort: { _id: 1 } }
        ];
    }

    // Avg score per prodi
    if (config.scoreField && config.prodiField) {
        facets.avgNilaiPerProdi = [
            ...m,
            { $group: { _id: `$${config.prodiField}`, avg: { $avg: `$${config.scoreField}` } } },
            { $sort: { _id: 1 } }
        ];
    }

    // Count per type (e.g., HAKI jenis)
    if (config.typeField) {
        facets.jumlahPerJenis = [
            ...m,
            { $group: { _id: `$${config.typeField}`, [alias]: { $sum: 1 } } }
        ];
    }

    return facets;
}

/**
 * Run a $facet aggregation for a single model.
 * 
 * @param {string} categoryKey - Key in modelFieldMap (e.g., 'penelitian-pusat')
 * @param {string[]} facetNames - Which facets to include (e.g., ['jumlahPerTahun', 'jumlahPerProdi'])
 * @param {Object} [filters={}] - Optional filters: { prodiFilter, yearFilter }
 * @returns {Promise<Object>} Facet results (e.g., { jumlahPerTahun: [...], jumlahPerProdi: [...] })
 */
async function getModelStats(categoryKey, facetNames, filters = {}) {
    const config = modelFieldMap[categoryKey];
    if (!config) throw new Error(`Unknown category: ${categoryKey}`);

    const match = buildMatchStage(config, filters);
    const available = buildAvailableFacets(config, match);

    // Build $facet with only the requested facets that are available
    const facet = {};
    for (const name of facetNames) {
        if (available[name]) {
            facet[name] = available[name];
        }
    }

    // If no valid facets were requested, return empty object
    if (Object.keys(facet).length === 0) {
        return {};
    }

    const result = await config.model.aggregate([{ $facet: facet }]);
    return result[0];
}

/**
 * Run $facet aggregation for multiple models in parallel.
 * 
 * @param {Object} requests - Map of categoryKey → facetNames array
 *   e.g., { 'penelitian-pusat': ['jumlahPerTahun', 'jumlahPerProdi'], ... }
 * @param {Object} [filters={}] - Shared filters applied to all models
 * @returns {Promise<Object>} Map of categoryKey → facet results
 */
async function getMultiModelStats(requests, filters = {}) {
    const keys = Object.keys(requests);
    const results = await Promise.all(
        keys.map(key => getModelStats(key, requests[key], filters))
    );

    const stats = {};
    keys.forEach((key, i) => {
        stats[key] = results[i];
    });
    return stats;
}

/**
 * Get the count alias value from a facet result entry.
 * Handles the fact that different models use different aliases
 * (total, jumlahBuku, jumlahHKI, totalPublikasi).
 * 
 * @param {Object} entry - A single facet result entry (e.g., { _id: 2024, total: 5 })
 * @param {string} categoryKey - The model category key
 * @returns {number} The count value
 */
function getCountValue(entry, categoryKey) {
    if (!entry) return 0;
    const alias = modelFieldMap[categoryKey]?.countAlias || 'total';
    return entry[alias] || 0;
}

/**
 * Get total count documents for a model.
 * 
 * @param {string} categoryKey - Key in modelFieldMap
 * @param {Object} [query={}] - Optional query filter
 * @returns {Promise<number>} Document count
 */
async function getDocumentCount(categoryKey, query = {}) {
    const config = modelFieldMap[categoryKey];
    if (!config) throw new Error(`Unknown category: ${categoryKey}`);
    return config.model.countDocuments(query);
}

module.exports = {
    getModelStats,
    getMultiModelStats,
    getCountValue,
    getDocumentCount,
    modelFieldMap
};
