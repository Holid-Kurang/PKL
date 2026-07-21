/**
 * Centralized field mapping for all data models.
 * 
 * Maps logical field names to actual MongoDB field names per model,
 * enabling generic aggregation pipelines despite inconsistent schema naming.
 * 
 * countAlias: the output field name used in $group { $sum: 1 } operations.
 *   - 'total' for penelitian/pengabdian (default)
 *   - Custom aliases for publikasi models (jumlahBuku, jumlahHKI, totalPublikasi)
 *     to preserve client-side chart compatibility.
 */
const modelFieldMap = {
    'penelitian-pusat': {
        model: require('../models/penelitian/pusat'),
        yearField: 'Tahun',
        costField: 'Biaya',
        prodiField: 'Prodi',
        countAlias: 'total',
    },
    'penelitian-pnbp': {
        model: require('../models/penelitian/pnbp'),
        yearField: 'Tahun',
        costField: 'Biaya',
        prodiField: 'Prodi',
        scoreField: 'Nilai',
        countAlias: 'total',
    },
    'penelitian-mandiri': {
        model: require('../models/penelitian/mandiri'),
        yearField: 'Tahun',
        costField: 'Dana',
        prodiField: 'Prodi',
        countAlias: 'total',
    },
    'pengabdian-pusat': {
        model: require('../models/pengabdian/pusat'),
        yearField: 'Tahun',
        costField: 'Dana',
        // No prodiField — this model does not have a Prodi field
        countAlias: 'total',
    },
    'pengabdian-pnbp': {
        model: require('../models/pengabdian/pnbp'),
        yearField: 'Tahun',
        costField: 'Dana',
        prodiField: 'Prodi',
        scoreField: 'Nilai',
        countAlias: 'total',
    },
    'publikasi-buku': {
        model: require('../models/publikasi/bukuModel'),
        yearField: 'Tahun',
        prodiField: 'Prodi',
        countAlias: 'jumlahBuku',
    },
    'publikasi-haki': {
        model: require('../models/publikasi/HAKIModel'),
        yearField: 'Tahun',
        prodiField: 'Prodi',
        typeField: 'HkiJenis',
        countAlias: 'jumlahHKI',
    },
    'publikasi-jupeng': {
        model: require('../models/publikasi/jupengModel'),
        yearField: 'Tahun',
        prodiField: 'Prodi',
        countAlias: 'totalPublikasi',
    },
};

module.exports = modelFieldMap;
