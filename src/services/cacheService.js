const NodeCache = require('node-cache');

/**
 * Centralized in-memory cache service.
 * 
 * Default TTL: 300 seconds (5 minutes).
 * checkperiod: 60 seconds — how often expired keys are purged.
 */
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

/**
 * Get a value from cache, or fetch it and store it if not cached.
 * 
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Async function to fetch data on cache miss
 * @param {number} [ttl] - Optional TTL override in seconds
 * @returns {Promise<*>} Cached or freshly fetched data
 */
async function getOrSet(key, fetchFn, ttl) {
    const cached = cache.get(key);
    if (cached !== undefined) {
        return cached;
    }

    const data = await fetchFn();
    if (ttl !== undefined) {
        cache.set(key, data, ttl);
    } else {
        cache.set(key, data);
    }
    return data;
}

/**
 * Invalidate all cache keys that start with the given prefix.
 * 
 * @param {string} prefix - Key prefix to match (e.g., 'stats:', 'count:', 'kategori:')
 */
function invalidateByPrefix(prefix) {
    const keys = cache.keys();
    const toDelete = keys.filter(k => k.startsWith(prefix));
    if (toDelete.length > 0) {
        cache.del(toDelete);
    }
}

/**
 * Invalidate all cache entries related to statistics data.
 * Call this after any CRUD operation on data models.
 */
function invalidateStatsCache() {
    invalidateByPrefix('stats:');
    invalidateByPrefix('count:');
}

/**
 * Invalidate all cache entries related to kategori options.
 * Call this after any CRUD operation on kategori.
 */
function invalidateKategoriCache() {
    invalidateByPrefix('kategori:');
}

/**
 * Flush the entire cache.
 */
function invalidateAll() {
    cache.flushAll();
}

/**
 * Get cache statistics for monitoring.
 * 
 * @returns {Object} Cache stats (hits, misses, keys, etc.)
 */
function getStats() {
    return cache.getStats();
}

module.exports = {
    getOrSet,
    invalidateByPrefix,
    invalidateStatsCache,
    invalidateKategoriCache,
    invalidateAll,
    getStats
};
