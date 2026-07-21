const { getMultiModelStats } = require('../services/statsService');
const { catchAsync } = require('../middlewares/errorHandler');

const CATEGORIES = ['penelitian-pusat', 'penelitian-pnbp', 'penelitian-mandiri'];

// Facets needed for the full chart view (all years)
const FULL_FACETS = {
    'penelitian-pusat': [
        'jumlahPerTahun', 'jumlahPerProdi',
        'jumlahDanaPerTahun', 'jumlahDanaPerProdi',
        'avgDanaPerTahun', 'avgDanaPerProdi'
    ],
    'penelitian-pnbp': [
        'jumlahPerTahun', 'jumlahPerProdi',
        'jumlahDanaPerTahun', 'jumlahDanaPerProdi',
        'avgDanaPerTahun', 'avgDanaPerProdi',
        'avgNilaiPerTahun', 'avgNilaiPerProdi'
    ],
    'penelitian-mandiri': [
        'jumlahPerTahun', 'jumlahPerProdi',
        'jumlahDanaPerTahun', 'jumlahDanaPerProdi',
        'avgDanaPerTahun', 'avgDanaPerProdi'
    ],
};

// Facets needed for current-year summary cards
const SUMMARY_FACETS = {};
CATEGORIES.forEach(key => {
    SUMMARY_FACETS[key] = ['jumlahPerTahun', 'jumlahDanaPerTahun', 'avgDanaPerTahun', 'jumlahPerProdi'];
});

exports.renderPenelitian = catchAsync(async (req, res) => {
    const currentYear = new Date().getFullYear();

    // Run both queries in parallel: full chart data + current-year summary
    const [fullStats, yearStats] = await Promise.all([
        getMultiModelStats(FULL_FACETS),
        getMultiModelStats(SUMMARY_FACETS, { yearFilter: currentYear })
    ]);

    // Compute current-year summary from year-filtered stats
    let totalBiayaTahunIni = 0;
    let totalPenelitianTahunIni = 0;
    const avgCosts = [];
    const prodiCountsTahunIni = {};

    for (const key of CATEGORIES) {
        const ys = yearStats[key];

        // Total cost
        totalBiayaTahunIni += ys.jumlahDanaPerTahun?.[0]?.total || 0;

        // Total count
        totalPenelitianTahunIni += ys.jumlahPerTahun?.[0]?.total || 0;

        // Collect averages (to compute average of averages)
        if (ys.avgDanaPerTahun?.[0]?.avg) {
            avgCosts.push(ys.avgDanaPerTahun[0].avg);
        }

        // Merge prodi counts
        (ys.jumlahPerProdi || []).forEach(item => {
            if (item._id && item._id !== '-') {
                prodiCountsTahunIni[item._id] = (prodiCountsTahunIni[item._id] || 0) + item.total;
            }
        });
    }

    const rataRataBiayaTahunIni = avgCosts.length > 0
        ? avgCosts.reduce((s, v) => s + v, 0) / avgCosts.length
        : 0;

    const prodiTeraktif = Object.keys(prodiCountsTahunIni).length > 0
        ? Object.keys(prodiCountsTahunIni).reduce((a, b) =>
            prodiCountsTahunIni[a] > prodiCountsTahunIni[b] ? a : b)
        : "";

    const gabunganData = {
        totalBiayaKeseluruhan: totalBiayaTahunIni,
        rataRataBiayaGabungan: rataRataBiayaTahunIni,
        prodiTeraktif,
        prodiCounts: prodiCountsTahunIni,
        penelitianTahunAktif: totalPenelitianTahunIni,
        tahunAktif: currentYear
    };

    const isLogin = req.session.isLogin || false;
    const { languages } = require('../config/lang');
    const currentLang = req.language || 'id';

    res.render("penelitian", {
        title: "Penelitian",
        isLogin,
        pusatData: fullStats['penelitian-pusat'],
        pnbpData: fullStats['penelitian-pnbp'],
        mandiriData: fullStats['penelitian-mandiri'],
        gabunganData,
        pageTranslations: JSON.stringify(languages[currentLang])
    });
});
