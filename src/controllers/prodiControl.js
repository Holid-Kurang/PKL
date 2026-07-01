const { getMultiModelStats } = require('../services/statsService');
const { getProdiOptions } = require('../services/kategoriService');
const { createProdiSlug } = require('../utils/slugUtils');
const AppError = require('../utils/AppError');
const { catchAsync } = require('../middlewares/errorHandler');

// Facets for the prodi page (all filtered by prodi, no per-prodi breakdowns needed)
const PRODI_FACETS = {
    'penelitian-pusat': ['jumlahPerTahun', 'jumlahDanaPerTahun', 'avgDanaPerTahun'],
    'penelitian-pnbp': ['jumlahPerTahun', 'jumlahDanaPerTahun', 'avgDanaPerTahun', 'avgNilaiPerTahun'],
    'penelitian-mandiri': ['jumlahPerTahun', 'jumlahDanaPerTahun', 'avgDanaPerTahun'],
    'pengabdian-pnbp': ['jumlahPerTahun', 'jumlahDanaPerTahun', 'avgDanaPerTahun', 'avgNilaiPerTahun'],
    'publikasi-buku': ['jumlahPerTahun'],
    'publikasi-jupeng': ['jumlahPerTahun'],
    'publikasi-haki': ['jumlahPerTahun', 'jumlahPerJenis'],
};

// Map service category keys to template variable names (prodi.ejs expects these)
const TEMPLATE_KEY_MAP = {
    'penelitian-pusat': 'penelitianPusat',
    'penelitian-pnbp': 'penelitianPNBP',
    'penelitian-mandiri': 'penelitianMandiri',
    'pengabdian-pnbp': 'pengabdianPNBP',
    'publikasi-buku': 'publikasiBuku',
    'publikasi-jupeng': 'publikasiJupeng',
    'publikasi-haki': 'publikasiHaki',
};

// Route handler dinamis untuk semua prodi
exports.getProdiStats = catchAsync(async (req, res, next) => {
    const prodiSlug = req.params.prodi;

    // Ambil semua prodi dari database
    const prodiOptions = await getProdiOptions();

    // Cari prodi yang sesuai dengan slug
    const prodiName = prodiOptions.find(prodi =>
        createProdiSlug(prodi) === prodiSlug
    );

    if (!prodiName) {
        return next(new AppError('Program Studi tidak ditemukan', 404));
    }

    // Get all stats filtered by prodi in parallel
    const stats = await getMultiModelStats(PRODI_FACETS, { prodiFilter: prodiName });

    // Map to template variable names
    const templateData = {};
    for (const [serviceKey, templateKey] of Object.entries(TEMPLATE_KEY_MAP)) {
        templateData[templateKey] = stats[serviceKey] || {};
    }

    const isLogin = req.session.isLogin || false;

    res.render("prodi", {
        title: prodiName,
        prodi: prodiName,
        isLogin,
        ...templateData,
        prodiOptions
    });
});
