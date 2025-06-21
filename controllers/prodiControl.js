const penelitianPNBPModel = require('../models/penelitian/pnbp');
const penelitianPusatModel = require('../models/penelitian/pusat');
const penelitianMandiriModel = require('../models/penelitian/mandiri');
const pengabdianPNBPModel = require('../models/pengabdian/pnbp');
const publikasiBukuModel = require('../models/publikasi/bukuModel');
const publikasiJupengModel = require('../models/publikasi/jupengModel');
const publikasiHakiModel = require('../models/publikasi/HAKIModel');

exports.getSipilStats = async (req, res) => {
    try {

        const [
            penelitianPusatResults,
            penelitianPNBPResults,
            penelitianMandiriResults
        ] = await Promise.all([
            // Query #1: Penelitian Pusat, hanya untuk Prodi S1 Teknik Sipil
            penelitianPusatModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { PRODI: "S1 Teknik Sipil" } },
                            { $group: { _id: "$TAHUN", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $match: { PRODI: "S1 Teknik Sipil" } },
                            { $group: { _id: "$TAHUN", total: { $sum: "$BIAYA" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $match: { PRODI: "S1 Teknik Sipil" } },
                            { $group: { _id: "$TAHUN", avg: { $avg: "$BIAYA" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #2: Penelitian PNBP, hanya untuk Prodi S1 Teknik Sipil
            penelitianPNBPModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { Prodi: "S1 Teknik Sipil" } },
                            { $group: { _id: "$Tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $match: { Prodi: "S1 Teknik Sipil" } },
                            { $group: { _id: "$Tahun", total: { $sum: "$Biaya" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $match: { Prodi: "S1 Teknik Sipil" } },
                            { $group: { _id: "$Tahun", avg: { $avg: "$Biaya" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgNilaiPerTahun": [
                            { $match: { Prodi: "S1 Teknik Sipil" } },
                            { $group: { _id: "$Tahun", avg: { $avg: "$Nilai" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #3: Penelitian Mandiri, hanya untuk Prodi S1 Teknik Sipil
            penelitianMandiriModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { Prodi: "S1 Teknik Sipil" } },
                            { $group: { _id: "$tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $match: { Prodi: "S1 Teknik Sipil" } },
                            { $group: { _id: "$tahun", total: { $sum: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $match: { Prodi: "S1 Teknik Sipil" } },
                            { $group: { _id: "$tahun", avg: { $avg: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ])
        ]);

        const [
            pengabdianPnbpResults
        ] = await Promise.all([
            // Query #2: Mengambil semua data agregasi untuk Penelitian PNBP, hanya untuk Prodi S1 Teknik Sipil
            pengabdianPNBPModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { Prodi: "S1 Teknik Sipil" } },
                            { $group: { _id: "$Tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $match: { Prodi: "S1 Teknik Sipil" } },
                            { $group: { _id: "$Tahun", total: { $sum: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $match: { Prodi: "S1 Teknik Sipil" } },
                            { $group: { _id: "$Tahun", avg: { $avg: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgNilaiPerTahun": [
                            { $match: { Prodi: "S1 Teknik Sipil" } },
                            { $group: { _id: "$Tahun", avg: { $avg: "$Nilai" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),
        ]);

        const [
            publikasiJupengResults,
            publikasiHakiResults,
            publikasiBukuResults
        ] = await Promise.all([
            // Query #1: Mengambil semua data Jupeng untuk Prodi S1 Teknik Sipil
            publikasiJupengModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { _prodi_nama: "S1 Teknik Sipil" } },
                            { $group: { _id: "$jurnal_tahun", totalPublikasi: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #2: Mengambil semua data HAKI untuk Prodi S1 Teknik Sipil
            publikasiHakiModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { _prodi_nama: "S1 Teknik Sipil" } },
                            { $group: { _id: "$hki_tahun", jumlahHKI: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahPerJenis": [
                            { $match: { _prodi_nama: "S1 Teknik Sipil" } },
                            { $group: { _id: "$hki_jenis", jumlahHKI: { $sum: 1 } } }
                        ],
                    }
                }
            ]),

            // Query #3: Mengambil semua data Buku untuk Prodi S1 Teknik Sipil
            publikasiBukuModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { _prodi_nama: "S1 Teknik Sipil" } },
                            { $group: { _id: "$buku_tahun", jumlahBuku: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ])
        ]);

        const isLogin = req.session.isLogin || false;
        res.render('prodi', {
            title: 'Data SIPIL',
            prodi: 'S1 Teknik Sipil',
            isLogin,
            penelitianPusat: penelitianPusatResults[0],
            penelitianPNBP: penelitianPNBPResults[0],
            penelitianMandiri: penelitianMandiriResults[0],
            pengabdianPNBP: pengabdianPnbpResults[0],
            publikasiJupeng: publikasiJupengResults[0],
            publikasiHaki: publikasiHakiResults[0],
            publikasiBuku: publikasiBukuResults[0]
        });
    } catch (error) {
        console.error('Error fetching SIPIL data:', error);
        res.status(500).send('Internal Server Error');
    }
}
exports.getMesinStats = async (req, res) => {
    try {

        const [
            penelitianPusatResults,
            penelitianPNBPResults,
            penelitianMandiriResults
        ] = await Promise.all([
            // Query #1: Penelitian Pusat, hanya untuk Prodi S1 Teknik Mesin
            penelitianPusatModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { PRODI: "S1 Teknik Mesin" } },
                            { $group: { _id: "$TAHUN", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $match: { PRODI: "S1 Teknik Mesin" } },
                            { $group: { _id: "$TAHUN", total: { $sum: "$BIAYA" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $match: { PRODI: "S1 Teknik Mesin" } },
                            { $group: { _id: "$TAHUN", avg: { $avg: "$BIAYA" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #2: Penelitian PNBP, hanya untuk Prodi S1 Teknik Mesin
            penelitianPNBPModel.aggregate([
                { $match: { Prodi: "S1 Teknik Mesin" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: "$Biaya" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Biaya" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgNilaiPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Nilai" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #3: Penelitian Mandiri, hanya untuk Prodi S1 Teknik Mesin
            penelitianMandiriModel.aggregate([
                { $match: { Prodi: "S1 Teknik Mesin" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$tahun", total: { $sum: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$tahun", avg: { $avg: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ])
        ]);

        const [
            pengabdianPnbpResults,
        ] = await Promise.all([
            // Query #2: Mengambil semua data agregasi untuk Penelitian PNBP, hanya untuk Prodi S1 Teknik Mesin
            pengabdianPNBPModel.aggregate([
                { $match: { Prodi: "S1 Teknik Mesin" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgNilaiPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Nilai" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),
        ]);

        const [
            publikasiJupengResults,
            publikasiHakiResults,
            publikasiBukuResults
        ] = await Promise.all([
            // Query #1: Mengambil semua data Jupeng untuk Prodi S1 Teknik Mesin
            publikasiJupengModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { _prodi_nama: "S1 Teknik Mesin" } },
                            { $group: { _id: "$jurnal_tahun", totalPublikasi: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #2: Mengambil semua data HAKI untuk Prodi S1 Teknik Mesin
            publikasiHakiModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { _prodi_nama: "S1 Teknik Mesin" } },
                            { $group: { _id: "$hki_tahun", jumlahHKI: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahPerJenis": [
                            { $group: { _id: "$hki_jenis", jumlahHKI: { $sum: 1 } } }
                        ],
                    }
                }
            ]),

            // Query #3: Mengambil semua data Buku untuk Prodi S1 Teknik Mesin
            publikasiBukuModel.aggregate([
                { $match: { _prodi_nama: "S1 Teknik Mesin" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$buku_tahun", jumlahBuku: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ])
        ]);

        const isLogin = req.session.isLogin || false;
        res.render('prodi', {
            title: 'Data MESIN',
            prodi: 'S1 Teknik Mesin',
            isLogin,
            penelitianPusat: penelitianPusatResults[0],
            penelitianPNBP: penelitianPNBPResults[0],
            penelitianMandiri: penelitianMandiriResults[0],
            pengabdianPNBP: pengabdianPnbpResults[0],
            publikasiJupeng: publikasiJupengResults[0],
            publikasiHaki: publikasiHakiResults[0],
            publikasiBuku: publikasiBukuResults[0]
        });
    } catch (error) {
        console.error('Error fetching MESIN data:', error);
        res.status(500).send('Internal Server Error');
    }
}
exports.getElektroStats = async (req, res) => {
    try {

        const [
            penelitianPusatResults,
            penelitianPNBPResults,
            penelitianMandiriResults
        ] = await Promise.all([
            // Query #1: Penelitian Pusat, hanya untuk Prodi S1 Teknik Elektro
            penelitianPusatModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { PRODI: "S1 Teknik Elektro" } },
                            { $group: { _id: "$TAHUN", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $match: { PRODI: "S1 Teknik Elektro" } },
                            { $group: { _id: "$TAHUN", total: { $sum: "$BIAYA" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $match: { PRODI: "S1 Teknik Elektro" } },
                            { $group: { _id: "$TAHUN", avg: { $avg: "$BIAYA" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #2: Penelitian PNBP, hanya untuk Prodi S1 Teknik Elektro
            penelitianPNBPModel.aggregate([
                { $match: { Prodi: "S1 Teknik Elektro" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: "$Biaya" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Biaya" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgNilaiPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Nilai" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #3: Penelitian Mandiri, hanya untuk Prodi S1 Teknik Elektro
            penelitianMandiriModel.aggregate([
                { $match: { Prodi: "S1 Teknik Elektro" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$tahun", total: { $sum: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$tahun", avg: { $avg: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ])
        ]);

        const [
            pengabdianPnbpResults
        ] = await Promise.all([
            // Query #2: Mengambil semua data agregasi untuk Penelitian PNBP, hanya untuk Prodi S1 Teknik Elektro
            pengabdianPNBPModel.aggregate([
                { $match: { Prodi: "S1 Teknik Elektro" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgNilaiPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Nilai" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),
        ]);

        const [
            publikasiJupengResults,
            publikasiHakiResults,
            publikasiBukuResults
        ] = await Promise.all([
            // Query #1: Mengambil semua data Jupeng untuk Prodi S1 Teknik Elektro
            publikasiJupengModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { _prodi_nama: "S1 Teknik Elektro" } },
                            { $group: { _id: "$jurnal_tahun", totalPublikasi: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #2: Mengambil semua data HAKI untuk Prodi S1 Teknik Elektro
            publikasiHakiModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { _prodi_nama: "S1 Teknik Elektro" } },
                            { $group: { _id: "$hki_tahun", jumlahHKI: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahPerJenis": [
                            { $group: { _id: "$hki_jenis", jumlahHKI: { $sum: 1 } } }
                        ],
                    }
                }
            ]),

            // Query #3: Mengambil semua data Buku untuk Prodi S1 Teknik Elektro
            publikasiBukuModel.aggregate([
                { $match: { _prodi_nama: "S1 Teknik Elektro" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$buku_tahun", jumlahBuku: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ])
        ]);

        const isLogin = req.session.isLogin || false;
        res.render('prodi', {
            title: 'Data ELEKTRO',
            prodi: 'S1 Teknik Elektro',
            isLogin,
            penelitianPusat: penelitianPusatResults[0],
            penelitianPNBP: penelitianPNBPResults[0],
            penelitianMandiri: penelitianMandiriResults[0],
            pengabdianPNBP: pengabdianPnbpResults[0],
            publikasiJupeng: publikasiJupengResults[0],
            publikasiHaki: publikasiHakiResults[0],
            publikasiBuku: publikasiBukuResults[0]
        });
    } catch (error) {
        console.error('Error fetching ELEKTRO data:', error);
        res.status(500).send('Internal Server Error');
    }
}
exports.getArsitekturStats = async (req, res) => {
    try {

        const [
            penelitianPusatResults,
            penelitianPNBPResults,
            penelitianMandiriResults
        ] = await Promise.all([
            // Query #1: Penelitian Pusat, hanya untuk Prodi S1 Arsitektur
            penelitianPusatModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { PRODI: "S1 Arsitektur" } },
                            { $group: { _id: "$TAHUN", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $match: { PRODI: "S1 Arsitektur" } },
                            { $group: { _id: "$TAHUN", total: { $sum: "$BIAYA" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $match: { PRODI: "S1 Arsitektur" } },
                            { $group: { _id: "$TAHUN", avg: { $avg: "$BIAYA" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #2: Penelitian PNBP, hanya untuk Prodi S1 Arsitektur
            penelitianPNBPModel.aggregate([
                { $match: { Prodi: "S1 Arsitektur" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: "$Biaya" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Biaya" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgNilaiPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Nilai" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #3: Penelitian Mandiri, hanya untuk Prodi S1 Arsitektur
            penelitianMandiriModel.aggregate([
                { $match: { Prodi: "S1 Arsitektur" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$tahun", total: { $sum: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$tahun", avg: { $avg: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ])
        ]);

        const [
            pengabdianPnbpResults
        ] = await Promise.all([
            // Query #2: Mengambil semua data agregasi untuk Penelitian PNBP, hanya untuk Prodi S1 Arsitektur
            pengabdianPNBPModel.aggregate([
                { $match: { Prodi: "S1 Arsitektur" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgNilaiPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Nilai" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),
        ]);

        const [
            publikasiJupengResults,
            publikasiHakiResults,
            publikasiBukuResults
        ] = await Promise.all([
            // Query #1: Mengambil semua data Jupeng untuk Prodi S1 Arsitektur
            publikasiJupengModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { _prodi_nama: "S1 Arsitektur" } },
                            { $group: { _id: "$jurnal_tahun", totalPublikasi: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #2: Mengambil semua data HAKI untuk Prodi S1 Arsitektur
            publikasiHakiModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { _prodi_nama: "S1 Arsitektur" } },
                            { $group: { _id: "$hki_tahun", jumlahHKI: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahPerJenis": [
                            { $group: { _id: "$hki_jenis", jumlahHKI: { $sum: 1 } } }
                        ],
                    }
                }
            ]),

            // Query #3: Mengambil semua data Buku untuk Prodi S1 Arsitektur
            publikasiBukuModel.aggregate([
                { $match: { _prodi_nama: "S1 Arsitektur" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$buku_tahun", jumlahBuku: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ])
        ]);

        const isLogin = req.session.isLogin || false;
        res.render('prodi', {
            title: 'Data ARSITEKTUR',
            prodi: 'S1 Arsitektur',
            isLogin,
            penelitianPusat: penelitianPusatResults[0],
            penelitianPNBP: penelitianPNBPResults[0],
            penelitianMandiri: penelitianMandiriResults[0],
            pengabdianPNBP: pengabdianPnbpResults[0],
            publikasiJupeng: publikasiJupengResults[0],
            publikasiHaki: publikasiHakiResults[0],
            publikasiBuku: publikasiBukuResults[0]
        });
    } catch (error) {
        console.error('Error fetching ARSITEKTUR data:', error);
        res.status(500).send('Internal Server Error');
    }
}
exports.getInformatikaStats = async (req, res) => {
    try {

        const [
            penelitianPusatResults,
            penelitianPNBPResults,
            penelitianMandiriResults
        ] = await Promise.all([
            // Query #1: Penelitian Pusat, hanya untuk Prodi S1 Teknik Informatika
            penelitianPusatModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { PRODI: "S1 Teknik Informatika" } },
                            { $group: { _id: "$TAHUN", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $match: { PRODI: "S1 Teknik Informatika" } },
                            { $group: { _id: "$TAHUN", total: { $sum: "$BIAYA" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $match: { PRODI: "S1 Teknik Informatika" } },
                            { $group: { _id: "$TAHUN", avg: { $avg: "$BIAYA" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #2: Penelitian PNBP, hanya untuk Prodi S1 Teknik Informatika
            penelitianPNBPModel.aggregate([
                { $match: { Prodi: "S1 Teknik Informatika" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: "$Biaya" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Biaya" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgNilaiPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Nilai" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #3: Penelitian Mandiri, hanya untuk Prodi S1 Teknik Informatika
            penelitianMandiriModel.aggregate([
                { $match: { Prodi: "S1 Teknik Informatika" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$tahun", total: { $sum: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$tahun", avg: { $avg: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ])
        ]);

        const [
            pengabdianPnbpResults
        ] = await Promise.all([
            // Query #2: Mengambil semua data agregasi untuk Penelitian PNBP, hanya untuk Prodi S1 Teknik Informatika
            pengabdianPNBPModel.aggregate([
                { $match: { Prodi: "S1 Teknik Informatika" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgNilaiPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Nilai" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),
        ]);

        const [
            publikasiJupengResults,
            publikasiHakiResults,
            publikasiBukuResults
        ] = await Promise.all([
            // Query #1: Mengambil semua data Jupeng untuk Prodi S1 Teknik Informatika
            publikasiJupengModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { _prodi_nama: "S1 Teknik Informatika" } },
                            { $group: { _id: "$jurnal_tahun", totalPublikasi: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #2: Mengambil semua data HAKI untuk Prodi S1 Teknik Informatika
            publikasiHakiModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { _prodi_nama: "S1 Teknik Informatika" } },
                            { $group: { _id: "$hki_tahun", jumlahHKI: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahPerJenis": [
                            { $group: { _id: "$hki_jenis", jumlahHKI: { $sum: 1 } } }
                        ],
                    }
                }
            ]),

            // Query #3: Mengambil semua data Buku untuk Prodi S1 Teknik Informatika
            publikasiBukuModel.aggregate([
                { $match: { _prodi_nama: "S1 Teknik Informatika" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$buku_tahun", jumlahBuku: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ])
        ]);

        const isLogin = req.session.isLogin || false;
        res.render('prodi', {
            title: 'Data INFORMATIKA',
            prodi: 'S1 Teknik Informatika',
            isLogin,
            penelitianPusat: penelitianPusatResults[0],
            penelitianPNBP: penelitianPNBPResults[0],
            penelitianMandiri: penelitianMandiriResults[0],
            pengabdianPNBP: pengabdianPnbpResults[0],
            publikasiJupeng: publikasiJupengResults[0],
            publikasiHaki: publikasiHakiResults[0],
            publikasiBuku: publikasiBukuResults[0]
        });
    } catch (error) {
        console.error('Error fetching INFORMATIKA data:', error);
        res.status(500).send('Internal Server Error');
    }
}
exports.getIndustriStats = async (req, res) => {
    try {

        const [
            penelitianPusatResults,
            penelitianPNBPResults,
            penelitianMandiriResults
        ] = await Promise.all([
            // Query #1: Penelitian Pusat, hanya untuk Prodi S1 Teknik Industri
            penelitianPusatModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { PRODI: "S1 Teknik Industri" } },
                            { $group: { _id: "$TAHUN", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $match: { PRODI: "S1 Teknik Industri" } },
                            { $group: { _id: "$TAHUN", total: { $sum: "$BIAYA" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $match: { PRODI: "S1 Teknik Industri" } },
                            { $group: { _id: "$TAHUN", avg: { $avg: "$BIAYA" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #2: Penelitian PNBP, hanya untuk Prodi S1 Teknik Industri
            penelitianPNBPModel.aggregate([
                { $match: { Prodi: "S1 Teknik Industri" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: "$Biaya" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Biaya" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgNilaiPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Nilai" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #3: Penelitian Mandiri, hanya untuk Prodi S1 Teknik Industri
            penelitianMandiriModel.aggregate([
                { $match: { Prodi: "S1 Teknik Industri" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$tahun", total: { $sum: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$tahun", avg: { $avg: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ])
        ]);

        const [
            pengabdianPnbpResults
        ] = await Promise.all([
            // Query #2: Mengambil semua data agregasi untuk Penelitian PNBP, hanya untuk Prodi S1 Teknik Industri
            pengabdianPNBPModel.aggregate([
                { $match: { Prodi: "S1 Teknik Industri" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgNilaiPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Nilai" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),
        ]);

        const [
            publikasiJupengResults,
            publikasiHakiResults,
            publikasiBukuResults
        ] = await Promise.all([
            // Query #1: Mengambil semua data Jupeng untuk Prodi S1 Teknik Industri
            publikasiJupengModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { _prodi_nama: "S1 Teknik Industri" } },
                            { $group: { _id: "$jurnal_tahun", totalPublikasi: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #2: Mengambil semua data HAKI untuk Prodi S1 Teknik Industri
            publikasiHakiModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { _prodi_nama: "S1 Teknik Industri" } },
                            { $group: { _id: "$hki_tahun", jumlahHKI: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahPerJenis": [
                            { $group: { _id: "$hki_jenis", jumlahHKI: { $sum: 1 } } }
                        ],
                    }
                }
            ]),

            // Query #3: Mengambil semua data Buku untuk Prodi S1 Teknik Industri
            publikasiBukuModel.aggregate([
                { $match: { _prodi_nama: "S1 Teknik Industri" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$buku_tahun", jumlahBuku: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ])
        ]);

        const isLogin = req.session.isLogin || false;
        res.render('prodi', {
            title: 'Data INDUSTRI',
            prodi: 'S1 Teknik Industri',
            isLogin,
            penelitianPusat: penelitianPusatResults[0],
            penelitianPNBP: penelitianPNBPResults[0],
            penelitianMandiri: penelitianMandiriResults[0],
            pengabdianPNBP: pengabdianPnbpResults[0],
            publikasiJupeng: publikasiJupengResults[0],
            publikasiHaki: publikasiHakiResults[0],
            publikasiBuku: publikasiBukuResults[0]
        });
    } catch (error) {
        console.error('Error fetching INDUSTRI data:', error);
        res.status(500).send('Internal Server Error');
    }
}
exports.getS2SipilStats = async (req, res) => {
    try {

        const [
            penelitianPusatResults,
            penelitianPNBPResults,
            penelitianMandiriResults
        ] = await Promise.all([
            // Query #1: Penelitian Pusat, hanya untuk Prodi S2 Teknik Sipil
            penelitianPusatModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { PRODI: "S2 Teknik Sipil" } },
                            { $group: { _id: "$TAHUN", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $match: { PRODI: "S2 Teknik Sipil" } },
                            { $group: { _id: "$TAHUN", total: { $sum: "$BIAYA" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $match: { PRODI: "S2 Teknik Sipil" } },
                            { $group: { _id: "$TAHUN", avg: { $avg: "$BIAYA" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #2: Penelitian PNBP, hanya untuk Prodi S2 Teknik Sipil
            penelitianPNBPModel.aggregate([
                { $match: { Prodi: "S2 Teknik Sipil" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: "$Biaya" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Biaya" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgNilaiPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Nilai" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #3: Penelitian Mandiri, hanya untuk Prodi S2 Teknik Sipil
            penelitianMandiriModel.aggregate([
                { $match: { Prodi: "S2 Teknik Sipil" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$tahun", total: { $sum: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$tahun", avg: { $avg: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ])
        ]);

        const [
            pengabdianPnbpResults
        ] = await Promise.all([
            // Query #2: Mengambil semua data agregasi untuk Penelitian PNBP, hanya untuk Prodi S2 Teknik Sipil
            pengabdianPNBPModel.aggregate([
                { $match: { Prodi: "S2 Teknik Sipil" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgNilaiPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Nilai" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),
        ]);

        const [
            publikasiJupengResults,
            publikasiHakiResults,
            publikasiBukuResults
        ] = await Promise.all([
            // Query #1: Mengambil semua data Jupeng untuk Prodi S2 Teknik Sipil
            publikasiJupengModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { _prodi_nama: "S2 Teknik Sipil" } },
                            { $group: { _id: "$jurnal_tahun", totalPublikasi: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #2: Mengambil semua data HAKI untuk Prodi S2 Teknik Sipil
            publikasiHakiModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { _prodi_nama: "S2 Teknik Sipil" } },
                            { $group: { _id: "$hki_tahun", jumlahHKI: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahPerJenis": [
                            { $group: { _id: "$hki_jenis", jumlahHKI: { $sum: 1 } } }
                        ],
                    }
                }
            ]),

            // Query #3: Mengambil semua data Buku untuk Prodi S2 Teknik Sipil
            publikasiBukuModel.aggregate([
                { $match: { _prodi_nama: "S2 Teknik Sipil" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$buku_tahun", jumlahBuku: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ])
        ]);

        const isLogin = req.session.isLogin || false;
        res.render('prodi', {
            title: 'Data S2 SIPIL',
            prodi: 'S2 Teknik Sipil',
            isLogin,
            penelitianPusat: penelitianPusatResults[0],
            penelitianPNBP: penelitianPNBPResults[0],
            penelitianMandiri: penelitianMandiriResults[0],
            pengabdianPNBP: pengabdianPnbpResults[0],
            publikasiJupeng: publikasiJupengResults[0],
            publikasiHaki: publikasiHakiResults[0],
            publikasiBuku: publikasiBukuResults[0]
        });
    } catch (error) {
        console.error('Error fetching S2 SIPIL data:', error);
        res.status(500).send('Internal Server Error');
    }
}
exports.getS2TeknologiInformasiStats = async (req, res) => {
    try {

        const [
            penelitianPusatResults,
            penelitianPNBPResults,
            penelitianMandiriResults
        ] = await Promise.all([
            // Query #1: Penelitian Pusat, hanya untuk Prodi S2 Teknologi Informasi
            penelitianPusatModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { PRODI: "S2 Teknologi Informasi" } },
                            { $group: { _id: "$TAHUN", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $match: { PRODI: "S2 Teknologi Informasi" } },
                            { $group: { _id: "$TAHUN", total: { $sum: "$BIAYA" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $match: { PRODI: "S2 Teknologi Informasi" } },
                            { $group: { _id: "$TAHUN", avg: { $avg: "$BIAYA" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #2: Penelitian PNBP, hanya untuk Prodi S2 Teknologi Informasi
            penelitianPNBPModel.aggregate([
                { $match: { Prodi: "S2 Teknologi Informasi" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: "$Biaya" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Biaya" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgNilaiPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Nilai" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #3: Penelitian Mandiri, hanya untuk Prodi S2 Teknologi Informasi
            penelitianMandiriModel.aggregate([
                { $match: { Prodi: "S2 Teknologi Informasi" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$tahun", total: { $sum: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$tahun", avg: { $avg: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ])
        ]);

        const [
            pengabdianPnbpResults
        ] = await Promise.all([
            // Query #2: Mengambil semua data agregasi untuk Penelitian PNBP, hanya untuk Prodi S2 Teknologi Informasi
            pengabdianPNBPModel.aggregate([
                { $match: { Prodi: "S2 Teknologi Informasi" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahDanaPerTahun": [
                            { $group: { _id: "$Tahun", total: { $sum: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgDanaPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Dana" } } },
                            { $sort: { _id: 1 } }
                        ],
                        "avgNilaiPerTahun": [
                            { $group: { _id: "$Tahun", avg: { $avg: "$Nilai" } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),
        ]);

        const [
            publikasiJupengResults,
            publikasiHakiResults,
            publikasiBukuResults
        ] = await Promise.all([
            // Query #1: Mengambil semua data Jupeng untuk Prodi S2 Teknologi Informasi
            publikasiJupengModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { _prodi_nama: "S2 Teknologi Informasi" } },
                            { $group: { _id: "$jurnal_tahun", totalPublikasi: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ]),

            // Query #2: Mengambil semua data HAKI untuk Prodi S2 Teknologi Informasi
            publikasiHakiModel.aggregate([
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $match: { _prodi_nama: "S2 Teknologi Informasi" } },
                            { $group: { _id: "$hki_tahun", jumlahHKI: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                        "jumlahPerJenis": [
                            { $group: { _id: "$hki_jenis", jumlahHKI: { $sum: 1 } } }
                        ],
                    }
                }
            ]),

            // Query #3: Mengambil semua data Buku untuk Prodi S2 Teknologi Informasi
            publikasiBukuModel.aggregate([
                { $match: { _prodi_nama: "S2 Teknologi Informasi" } },
                {
                    $facet: {
                        "jumlahPerTahun": [
                            { $group: { _id: "$buku_tahun", jumlahBuku: { $sum: 1 } } },
                            { $sort: { _id: 1 } }
                        ],
                    }
                }
            ])
        ]);

        const isLogin = req.session.isLogin || false;
        res.render('prodi', {
            title: 'Data S2 TEKNOLOGI INFORMASI',
            prodi: 'S2 Teknologi Informasi',
            isLogin,
            penelitianPusat: penelitianPusatResults[0],
            penelitianPNBP: penelitianPNBPResults[0],
            penelitianMandiri: penelitianMandiriResults[0],
            pengabdianPNBP: pengabdianPnbpResults[0],
            publikasiJupeng: publikasiJupengResults[0],
            publikasiHaki: publikasiHakiResults[0],
            publikasiBuku: publikasiBukuResults[0]
        });
    } catch (error) {
        console.error('Error fetching S2 TEKNOLOGI INFORMASI data:', error);
        res.status(500).send('Internal Server Error');
    }
}