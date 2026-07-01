const { getMultiModelStats, getCountValue, getDocumentCount, modelFieldMap } = require('../services/statsService');
const { getProdiOptions } = require('../services/kategoriService');
const { calculateStats } = require('../utils/statsUtils');
const { catchAsync } = require('../middlewares/errorHandler');

/**
 * Build per-prodi breakdown data using DB-level aggregation.
 * Replaces the previous approach that loaded all documents into memory.
 */
async function getProdiData() {
    const categoriesWithProdi = [
        'penelitian-pusat', 'penelitian-pnbp', 'penelitian-mandiri',
        'pengabdian-pnbp',
        'publikasi-buku', 'publikasi-haki', 'publikasi-jupeng'
    ];

    const requests = {};
    categoriesWithProdi.forEach(key => {
        requests[key] = ['jumlahPerProdi'];
    });

    const stats = await getMultiModelStats(requests);

    // Collect all unique prodis
    const prodiSet = new Set();
    for (const [key, data] of Object.entries(stats)) {
        if (data.jumlahPerProdi) {
            data.jumlahPerProdi.forEach(item => {
                if (item._id) prodiSet.add(item._id);
            });
        }
    }

    // Helper to get count for a specific prodi from a category's results
    const getCount = (category, prodi) => {
        const data = stats[category]?.jumlahPerProdi;
        if (!data) return 0;
        const found = data.find(item => item._id === prodi);
        return found ? getCountValue(found, category) : 0;
    };

    // Build prodi data array
    const prodiData = Array.from(prodiSet).map(prodi => ({
        name: prodi,
        penelitian: {
            pusat: getCount('penelitian-pusat', prodi),
            pnbp: getCount('penelitian-pnbp', prodi),
            mandiri: getCount('penelitian-mandiri', prodi)
        },
        pengabdian: {
            pnbp: getCount('pengabdian-pnbp', prodi),
            pusat: 0 // pengabdian-pusat has no Prodi field
        },
        publikasi: {
            haki: getCount('publikasi-haki', prodi),
            buku: getCount('publikasi-buku', prodi),
            jupeng: getCount('publikasi-jupeng', prodi)
        }
    }));

    // Urutkan berdasarkan nama prodi
    return prodiData.sort((a, b) => a.name.localeCompare(b.name));
}

// API endpoint untuk mendapatkan data dashboard summary
exports.getDashboardSummary = catchAsync(async (req, res) => {
    const [
        totalHAKI, totalBuku, totalJupeng,
        totalPNBP, totalPusat, totalMandiri,
        totalPengabdianPNBP, totalPengabdianPusat,
        prodiData, prodiOptions
    ] = await Promise.all([
        getDocumentCount('publikasi-haki'),
        getDocumentCount('publikasi-buku'),
        getDocumentCount('publikasi-jupeng'),
        getDocumentCount('penelitian-pnbp'),
        getDocumentCount('penelitian-pusat'),
        getDocumentCount('penelitian-mandiri'),
        getDocumentCount('pengabdian-pnbp'),
        getDocumentCount('pengabdian-pusat'),
        getProdiData(),
        getProdiOptions()
    ]);

    const publikasiCounts = {
        "HAKI": totalHAKI,
        "Buku": totalBuku,
        "Jurnal Pengabdian": totalJupeng
    };

    const penelitianCounts = {
        "PNBP": totalPNBP,
        "Pusat": totalPusat,
        "Mandiri": totalMandiri
    };

    const pengabdianCounts = {
        "PNBP": totalPengabdianPNBP,
        "Pusat": totalPengabdianPusat
    };

    const penelitianStats = calculateStats({
        "PNBP": totalPNBP,
        "Pusat": totalPusat,
        "Mandiri": totalMandiri
    });

    const pengabdianStats = calculateStats({
        "PNBP": totalPengabdianPNBP,
        "Pusat": totalPengabdianPusat
    });

    const publikasiStats = calculateStats({
        "HAKI": totalHAKI,
        "Buku": totalBuku,
        "Jurnal Pengabdian": totalJupeng
    });

    res.json({
        success: true,
        data: {
            publikasiCounts,
            penelitianCounts,
            pengabdianCounts,
            penelitianStats,
            pengabdianStats,
            publikasiStats,
            prodiData,
            prodiOptions
        }
    });
});

// API endpoint untuk mendapatkan prodi options saja
exports.getProdiOptionsAPI = catchAsync(async (req, res) => {
    const prodiOptions = await getProdiOptions();

    res.json({
        success: true,
        data: prodiOptions
    });
});

// Halaman utama
exports.renderHome = catchAsync(async (req, res) => {
    const isLogin = req.session.isLogin || false;
    const { languages } = require('../../config/lang');
    const currentLang = req.language || 'id';

    res.render("index", {
        title: "Home",
        isLogin,
        pageTranslations: JSON.stringify(languages[currentLang])
    });
});
