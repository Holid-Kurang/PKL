const { getMultiModelStats } = require('../services/statsService');
const { catchAsync } = require('../middlewares/errorHandler');

// Note: pengabdian-pusat has no prodiField, so it gets fewer facets
const FULL_FACETS = {
    'pengabdian-pusat': [
        'jumlahPerTahun',
        'jumlahDanaPerTahun',
        'avgDanaPerTahun'
    ],
    'pengabdian-pnbp': [
        'jumlahPerTahun', 'jumlahPerProdi',
        'jumlahDanaPerTahun', 'jumlahDanaPerProdi',
        'avgDanaPerTahun', 'avgDanaPerProdi',
        'avgNilaiPerTahun', 'avgNilaiPerProdi'
    ],
};

const CATEGORIES = ['pengabdian-pusat', 'pengabdian-pnbp'];

const SUMMARY_FACETS = {
    'pengabdian-pusat': ['jumlahPerTahun', 'jumlahDanaPerTahun', 'avgDanaPerTahun'],
    'pengabdian-pnbp': ['jumlahPerTahun', 'jumlahDanaPerTahun', 'avgDanaPerTahun', 'jumlahPerProdi'],
};

exports.renderPengabdian = catchAsync(async (req, res) => {
    const currentYear = new Date().getFullYear();

    // Run both queries in parallel: full chart data + current-year summary
    const [fullStats, yearStats] = await Promise.all([
        getMultiModelStats(FULL_FACETS),
        getMultiModelStats(SUMMARY_FACETS, { yearFilter: currentYear })
    ]);

    // Compute current-year summary
    let totalDanaTahunIni = 0;
    let totalPengabdianTahunIni = 0;
    const avgCosts = [];
    const prodiCountsTahunIni = {};

    for (const key of CATEGORIES) {
        const ys = yearStats[key];

        totalDanaTahunIni += ys.jumlahDanaPerTahun?.[0]?.total || 0;
        totalPengabdianTahunIni += ys.jumlahPerTahun?.[0]?.total || 0;

        if (ys.avgDanaPerTahun?.[0]?.avg) {
            avgCosts.push(ys.avgDanaPerTahun[0].avg);
        }

        // Only pengabdian-pnbp has prodi data
        (ys.jumlahPerProdi || []).forEach(item => {
            if (item._id && item._id !== '-') {
                prodiCountsTahunIni[item._id] = (prodiCountsTahunIni[item._id] || 0) + item.total;
            }
        });
    }

    const rataRataDanaTahunIni = avgCosts.length > 0
        ? avgCosts.reduce((s, v) => s + v, 0) / avgCosts.length
        : 0;

    const prodiTeraktif = Object.keys(prodiCountsTahunIni).length > 0
        ? Object.keys(prodiCountsTahunIni).reduce((a, b) =>
            prodiCountsTahunIni[a] > prodiCountsTahunIni[b] ? a : b)
        : "";

    const gabunganData = {
        totalDanaKeseluruhan: totalDanaTahunIni,
        rataRataDanaGabungan: rataRataDanaTahunIni,
        prodiTeraktif,
        prodiCounts: prodiCountsTahunIni,
        pengabdianTahunAktif: totalPengabdianTahunIni,
        tahunAktif: currentYear
    };

    const isLogin = req.session.isLogin || false;
    const { languages } = require('../config/lang');
    const currentLang = req.language || 'id';

    res.render("pengabdian", {
        title: "Pengabdian",
        isLogin,
        pusatData: fullStats['pengabdian-pusat'],
        pnbpData: fullStats['pengabdian-pnbp'],
        gabunganData,
        pageTranslations: JSON.stringify(languages[currentLang])
    });
});
