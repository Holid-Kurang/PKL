const { getMultiModelStats, getCountValue } = require('../services/statsService');
const { catchAsync } = require('../middlewares/errorHandler');

const CATEGORIES = ['publikasi-jupeng', 'publikasi-haki', 'publikasi-buku'];

const FULL_FACETS = {
    'publikasi-jupeng': ['jumlahPerTahun', 'jumlahPerProdi'],
    'publikasi-haki': ['jumlahPerTahun', 'jumlahPerJenis', 'jumlahPerProdi'],
    'publikasi-buku': ['jumlahPerTahun', 'jumlahPerProdi'],
};

const SUMMARY_FACETS = {};
CATEGORIES.forEach(key => {
    SUMMARY_FACETS[key] = ['jumlahPerTahun', 'jumlahPerProdi'];
});

exports.renderPublikasi = catchAsync(async (req, res) => {
    const tahunSekarang = new Date().getFullYear();

    // Run full chart data + current-year summary in parallel
    const [fullStats, yearStats] = await Promise.all([
        getMultiModelStats(FULL_FACETS),
        getMultiModelStats(SUMMARY_FACETS, { yearFilter: tahunSekarang })
    ]);

    // 1. Total publikasi tahun ini dari semua jenis
    const jupengTahunIni = getCountValue(yearStats['publikasi-jupeng'].jumlahPerTahun?.[0], 'publikasi-jupeng');
    const hakiTahunIni = getCountValue(yearStats['publikasi-haki'].jumlahPerTahun?.[0], 'publikasi-haki');
    const bukuTahunIni = getCountValue(yearStats['publikasi-buku'].jumlahPerTahun?.[0], 'publikasi-buku');
    const totalPublikasiTahunIni = jupengTahunIni + hakiTahunIni + bukuTahunIni;

    // 2. Gabungkan data prodi dari semua jenis publikasi tahun ini
    const prodiDataTahunIni = {};
    for (const key of CATEGORIES) {
        (yearStats[key].jumlahPerProdi || []).forEach(item => {
            if (item._id) {
                prodiDataTahunIni[item._id] = (prodiDataTahunIni[item._id] || 0) + getCountValue(item, key);
            }
        });
    }

    // Cari prodi paling produktif
    let prodiPalingProduktif = 'Tidak ada data';
    let jumlahProdiTerproduktif = 0;
    Object.entries(prodiDataTahunIni).forEach(([prodi, jumlah]) => {
        if (jumlah > jumlahProdiTerproduktif) {
            prodiPalingProduktif = prodi;
            jumlahProdiTerproduktif = jumlah;
        }
    });

    // 3. Jenis publikasi terpopuler tahun ini
    const isLogin = req.session.isLogin || false;
    const { languages } = require('../config/lang');
    const currentLang = req.language || 'id';

    const jenisPublikasiLabels = {
        'id': {
            'Jurnal Pengabdian': 'Jurnal Pengabdian',
            'HAKI': 'HAKI',
            'Buku': 'Buku'
        },
        'en': {
            'Jurnal Pengabdian': 'Community Service Journal',
            'HAKI': 'Intellectual Property Rights',
            'Buku': 'Book'
        }
    };

    const jenisPublikasiTahunIni = {
        'Jurnal Pengabdian': jupengTahunIni,
        'HAKI': hakiTahunIni,
        'Buku': bukuTahunIni
    };

    let jenisPublikasiTerpopuler = currentLang === 'en' ? 'No data available' : 'Tidak ada data';
    let jumlahJenisTerpopuler = 0;
    Object.entries(jenisPublikasiTahunIni).forEach(([jenis, jumlah]) => {
        if (jumlah > jumlahJenisTerpopuler) {
            jenisPublikasiTerpopuler = jenisPublikasiLabels[currentLang][jenis] || jenis;
            jumlahJenisTerpopuler = jumlah;
        }
    });

    // 4. Total publikasi keseluruhan (all years — from full stats)
    const totalJupeng = (fullStats['publikasi-jupeng'].jumlahPerTahun || [])
        .reduce((sum, item) => sum + (item.totalPublikasi || 0), 0);
    const totalHaki = (fullStats['publikasi-haki'].jumlahPerTahun || [])
        .reduce((sum, item) => sum + (item.jumlahHKI || 0), 0);
    const totalBuku = (fullStats['publikasi-buku'].jumlahPerTahun || [])
        .reduce((sum, item) => sum + (item.jumlahBuku || 0), 0);
    const totalPublikasiKeseluruhan = totalJupeng + totalHaki + totalBuku;

    const gabunganData = {
        totalPublikasiTahunIni,
        tahunAktif: tahunSekarang,
        prodiPalingProduktif,
        jumlahProdiTerproduktif,
        jenisPublikasiTerpopuler,
        jumlahJenisTerpopuler,
        totalPublikasiKeseluruhan
    };

    res.render("publikasi", {
        title: "Publikasi",
        isLogin,
        jupengData: fullStats['publikasi-jupeng'],
        hakiData: fullStats['publikasi-haki'],
        bukuData: fullStats['publikasi-buku'],
        gabunganData,
        pageTranslations: JSON.stringify(languages[currentLang])
    });
});
