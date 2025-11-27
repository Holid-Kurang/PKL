const penelitianPNBPModel = require('../models/penelitian/pnbp');
const penelitianPusatModel = require('../models/penelitian/pusat');
const penelitianMandiriModel = require('../models/penelitian/mandiri');
const pengabdianPNBPModel = require('../models/pengabdian/pnbp');
const publikasiBukuModel = require('../models/publikasi/bukuModel');
const publikasiJupengModel = require('../models/publikasi/jupengModel');
const publikasiHakiModel = require('../models/publikasi/HAKIModel');
const kategoriOptionModel = require('../models/kategoriOptionModel');
const AppError = require('../utils/AppError');
const { catchAsync } = require('../middlewares/errorHandler');

// Fungsi generik untuk mendapatkan stats prodi
const getProdiStats = async (prodiName) => {
    const [
        penelitianPusatResults,
        penelitianPNBPResults,
        penelitianMandiriResults,
        pengabdianPNBPResults,
        publikasiBukuResults,
        publikasiJupengResults,
        publikasiHakiResults
    ] = await Promise.all([
        // Penelitian Pusat
        penelitianPusatModel.aggregate([
            {
                $facet: {
                    "jumlahPerTahun": [
                        { $match: { Prodi: prodiName } },
                        { $group: { _id: "$TAHUN", total: { $sum: 1 } } },
                        { $sort: { _id: 1 } }
                    ],
                    "jumlahDanaPerTahun": [
                        { $match: { Prodi: prodiName } },
                        { $group: { _id: "$TAHUN", total: { $sum: "$BIAYA" } } },
                        { $sort: { _id: 1 } }
                    ],
                    "avgDanaPerTahun": [
                        { $match: { Prodi: prodiName } },
                        { $group: { _id: "$TAHUN", avg: { $avg: "$BIAYA" } } },
                        { $sort: { _id: 1 } }
                    ],
                }
            }
        ]),
        // Penelitian PNBP
        penelitianPNBPModel.aggregate([
            {
                $facet: {
                    "jumlahPerTahun": [
                        { $match: { Prodi: prodiName } },
                        { $group: { _id: "$Tahun", total: { $sum: 1 } } },
                        { $sort: { _id: 1 } }
                    ],
                    "jumlahDanaPerTahun": [
                        { $match: { Prodi: prodiName } },
                        { $group: { _id: "$Tahun", total: { $sum: "$Biaya" } } },
                        { $sort: { _id: 1 } }
                    ],
                    "avgDanaPerTahun": [
                        { $match: { Prodi: prodiName } },
                        { $group: { _id: "$Tahun", avg: { $avg: "$Biaya" } } },
                        { $sort: { _id: 1 } }
                    ],
                    "avgNilaiPerTahun": [
                        { $match: { Prodi: prodiName } },
                        { $group: { _id: "$Tahun", avg: { $avg: "$Nilai" } } },
                        { $sort: { _id: 1 } }
                    ],
                }
            }
        ]),
        // Penelitian Mandiri
        penelitianMandiriModel.aggregate([
            {
                $facet: {
                    "jumlahPerTahun": [
                        { $match: { Prodi: prodiName } },
                        { $group: { _id: "$tahun", total: { $sum: 1 } } },
                        { $sort: { _id: 1 } }
                    ],
                    "jumlahDanaPerTahun": [
                        { $match: { Prodi: prodiName } },
                        { $group: { _id: "$tahun", total: { $sum: "$Dana" } } },
                        { $sort: { _id: 1 } }
                    ],
                    "avgDanaPerTahun": [
                        { $match: { Prodi: prodiName } },
                        { $group: { _id: "$tahun", avg: { $avg: "$Dana" } } },
                        { $sort: { _id: 1 } }
                    ],
                }
            }
        ]),
        // Pengabdian PNBP
        pengabdianPNBPModel.aggregate([
            {
                $facet: {
                    "jumlahPerTahun": [
                        { $match: { Prodi: prodiName } },
                        { $group: { _id: "$Tahun", total: { $sum: 1 } } },
                        { $sort: { _id: 1 } }
                    ],
                    "jumlahDanaPerTahun": [
                        { $match: { Prodi: prodiName } },
                        { $group: { _id: "$Tahun", total: { $sum: "$Dana" } } },
                        { $sort: { _id: 1 } }
                    ],
                    "avgDanaPerTahun": [
                        { $match: { Prodi: prodiName } },
                        { $group: { _id: "$Tahun", avg: { $avg: "$Dana" } } },
                        { $sort: { _id: 1 } }
                    ],
                    "avgNilaiPerTahun": [
                        { $match: { Prodi: prodiName } },
                        { $group: { _id: "$Tahun", avg: { $avg: "$Nilai" } } },
                        { $sort: { _id: 1 } }
                    ],
                }
            }
        ]),
        // Publikasi Buku
        publikasiBukuModel.aggregate([
            {
                $facet: {
                    "jumlahPerTahun": [
                        { $match: { Prodi: prodiName } },
                        { $group: { _id: "$buku_tahun", jumlahBuku: { $sum: 1 } } },
                        { $sort: { _id: 1 } }
                    ]
                }
            }
        ]),
        // Publikasi Jurnal Pengabdian
        publikasiJupengModel.aggregate([
            {
                $facet: {
                    "jumlahPerTahun": [
                        { $match: { Prodi: prodiName } },
                        { $group: { _id: "$jurnal_tahun", totalPublikasi: { $sum: 1 } } },
                        { $sort: { _id: 1 } }
                    ]
                }
            }
        ]),
        // Publikasi HAKI
        publikasiHakiModel.aggregate([
            {
                $facet: {
                    "jumlahPerTahun": [
                        { $match: { Prodi: prodiName } },
                        { $group: { _id: "$hki_tahun", jumlahHKI: { $sum: 1 } } },
                        { $sort: { _id: 1 } }
                    ],
                    "jumlahPerJenis": [
                        { $match: { Prodi: prodiName } },
                        { $group: { _id: "$hki_jenis", jumlahHKI: { $sum: 1 } } }
                    ]
                }
            }
        ])
    ]);

    // Ambil opsi prodi untuk navbar
    let prodiOptions = await kategoriOptionModel.find({ kategori: 'Program Studi' });
    prodiOptions = prodiOptions.length > 0 ? prodiOptions[0].option : [];

    return {
        penelitianPusat: penelitianPusatResults[0],
        penelitianPNBP: penelitianPNBPResults[0],
        penelitianMandiri: penelitianMandiriResults[0],
        pengabdianPNBP: pengabdianPNBPResults[0],
        publikasiBuku: publikasiBukuResults[0],
        publikasiJupeng: publikasiJupengResults[0],
        publikasiHaki: publikasiHakiResults[0],
        prodiOptions
    };
};

// Fungsi untuk mengubah nama prodi menjadi URL slug
const createProdiSlug = (prodiName) => {
    return prodiName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');
};

// Route handler dinamis untuk semua prodi
exports.getProdiStats = catchAsync(async (req, res, next) => {
    const prodiSlug = req.params.prodi;

    // Ambil semua prodi dari database
    let prodiOptions = await kategoriOptionModel.find({ kategori: 'Program Studi' });
    prodiOptions = prodiOptions.length > 0 ? prodiOptions[0].option : [];

    // Cari prodi yang sesuai dengan slug
    const prodiName = prodiOptions.find(prodi =>
        createProdiSlug(prodi) === prodiSlug
    );

    if (!prodiName) {
        return next(new AppError('Program Studi tidak ditemukan', 404));
    }

    const stats = await getProdiStats(prodiName);
    const isLogin = req.session.isLogin || false;

    res.render("prodi", {
        title: prodiName,
        prodi: prodiName,
        isLogin,
        ...stats
    });
});
