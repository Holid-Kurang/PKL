/**
 * Calculate summary statistics from a counts object.
 * 
 * @param {Object} counts - Object with category names as keys and counts as values
 * @returns {Object} { counts, total, topCategory, topPercentage }
 */
function calculateStats(counts) {
    // Menghitung total dari semua nilai dalam objek counts
    const total = Object.values(counts).reduce((sum, val) => sum + val, 0);

    // Menemukan kategori dengan nilai tertinggi
    let topCategory = 'N/A';
    let topValue = 0;
    for (const [key, value] of Object.entries(counts)) {
        if (value > topValue) {
            topValue = value;
            topCategory = key;
        }
    }

    // Menghitung persentase kategori teratas
    const topPercentage = total > 0 ? (topValue / total) * 100 : 0;

    return {
        counts,
        total,
        topCategory,
        topPercentage
    };
}

module.exports = { calculateStats };
