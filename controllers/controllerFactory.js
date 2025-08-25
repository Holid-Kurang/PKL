const BaseController = require('./baseController');

// Import semua model
const mandiriModel = require('../models/penelitian/mandiri');
const pnbpPenelitianModel = require('../models/penelitian/pnbp');
const pusatPenelitianModel = require('../models/penelitian/pusat');
const pnbpPengabdianModel = require('../models/pengabdian/pnbp');
const pusatPengabdianModel = require('../models/pengabdian/pusat');
const bukuModel = require('../models/publikasi/bukuModel');
const hakiModel = require('../models/publikasi/HAKIModel');
const jupengModel = require('../models/publikasi/jupengModel');

// Konfigurasi untuk setiap controller
const controllerConfigs = {
    // Penelitian
    'penelitian-mandiri': {
        model: mandiriModel,
        viewPath: 'dashboard/penelitian/dash-mandiri',
        title: 'Penelitian Mandiri',
        searchFields: ['Judul', 'Ketua', 'Prodi', 'Skema'],
        excelFields: [
            { key: 'Judul', header: 'Judul' },
            { key: 'Skema', header: 'Skema' },
            { key: 'Ketua', header: 'Ketua' },
            { key: 'Anggota', header: 'Anggota' },
            { key: 'Dana', header: 'Dana' },
            { key: 'tahun', header: 'Tahun' },
            { key: 'Prodi', header: 'Prodi' }
        ]
    },
    'penelitian-pnbp': {
        model: pnbpPenelitianModel,
        viewPath: 'dashboard/penelitian/dash-pnbp',
        title: 'Penelitian PNBP',
        searchFields: ['Judul', 'Ketua', 'Prodi', 'SKEMA'],
        excelFields: [
            { key: 'Judul', header: 'Judul' },
            { key: 'SKEMA', header: 'Skema' },
            { key: 'Ketua', header: 'Ketua' },
            { key: 'Anggota', header: 'Anggota' },
            { key: 'Biaya', header: 'Biaya' },
            { key: 'Tahun', header: 'Tahun' },
            { key: 'Prodi', header: 'Prodi' },
            { key: 'Nilai', header: 'Nilai' }
        ]
    },
    'penelitian-pusat': {
        model: pusatPenelitianModel,
        viewPath: 'dashboard/penelitian/dash-pusat',
        title: 'Penelitian Pusat',
        searchFields: ['Judul', 'Ketua', 'Prodi', 'SKEMA'],
        excelFields: [
            { key: 'Judul', header: 'Judul' },
            { key: 'SKEMA', header: 'Skema' },
            { key: 'Ketua', header: 'Ketua' },
            { key: 'Anggota', header: 'Anggota' },
            { key: 'Biaya', header: 'Biaya' },
            { key: 'Tahun', header: 'Tahun' },
            { key: 'Prodi', header: 'Prodi' }
        ]
    },
    
    // Pengabdian
    'pengabdian-pnbp': {
        model: pnbpPengabdianModel,
        viewPath: 'dashboard/pengabdian/dash-pnbp',
        title: 'Pengabdian PNBP',
        searchFields: ['Judul', 'Ketua', 'Prodi', 'SKEMA'],
        excelFields: [
            { key: 'Judul', header: 'Judul' },
            { key: 'SKEMA', header: 'Skema' },
            { key: 'Ketua', header: 'Ketua' },
            { key: 'Anggota', header: 'Anggota' },
            { key: 'Biaya', header: 'Biaya' },
            { key: 'Tahun', header: 'Tahun' },
            { key: 'Prodi', header: 'Prodi' }
        ]
    },
    'pengabdian-pusat': {
        model: pusatPengabdianModel,
        viewPath: 'dashboard/pengabdian/dash-pusat',
        title: 'Pengabdian Pusat',
        searchFields: ['Judul', 'Ketua', 'Prodi', 'SKEMA'],
        excelFields: [
            { key: 'Judul', header: 'Judul' },
            { key: 'SKEMA', header: 'Skema' },
            { key: 'Ketua', header: 'Ketua' },
            { key: 'Anggota', header: 'Anggota' },
            { key: 'Biaya', header: 'Biaya' },
            { key: 'Tahun', header: 'Tahun' },
            { key: 'Prodi', header: 'Prodi' }
        ]
    },
    
    // Publikasi
    'publikasi-buku': {
        model: bukuModel,
        viewPath: 'dashboard/publikasi/dash-buku',
        title: 'Publikasi Buku',
        searchFields: ['Judul', 'Penulis', 'Prodi'],
        excelFields: [
            { key: 'Judul', header: 'Judul' },
            { key: 'Penulis', header: 'Penulis' },
            { key: 'Penerbit', header: 'Penerbit' },
            { key: 'Tahun', header: 'Tahun' },
            { key: 'Prodi', header: 'Prodi' }
        ]
    },
    'publikasi-haki': {
        model: hakiModel,
        viewPath: 'dashboard/publikasi/dash-haki',
        title: 'Publikasi HAKI',
        searchFields: ['Judul', 'Inventor', 'Prodi'],
        excelFields: [
            { key: 'Judul', header: 'Judul' },
            { key: 'Inventor', header: 'Inventor' },
            { key: 'Jenis', header: 'Jenis' },
            { key: 'Nomor', header: 'Nomor' },
            { key: 'Tahun', header: 'Tahun' },
            { key: 'Prodi', header: 'Prodi' }
        ]
    },
    'publikasi-jupeng': {
        model: jupengModel,
        viewPath: 'dashboard/publikasi/dash-jupeng',
        title: 'Jurnal Pengabdian',
        searchFields: ['Judul', 'Penulis', 'Prodi'],
        excelFields: [
            { key: 'Judul', header: 'Judul' },
            { key: 'Penulis', header: 'Penulis' },
            { key: 'Jurnal', header: 'Jurnal' },
            { key: 'Volume', header: 'Volume' },
            { key: 'Tahun', header: 'Tahun' },
            { key: 'Prodi', header: 'Prodi' }
        ]
    }
};

// Factory function untuk membuat controller
function createController(type) {
    const config = controllerConfigs[type];
    if (!config) {
        throw new Error(`Controller type '${type}' not found`);
    }
    
    return new BaseController(
        config.model,
        config.viewPath,
        config.title,
        config.searchFields,
        config.excelFields
    );
}

module.exports = {
    createController,
    controllerConfigs
};
