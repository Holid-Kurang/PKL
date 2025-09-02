const mongoose = require('mongoose');

const JupengSchema = new mongoose.Schema({
    jurnal_judul: { type: String, required: true },
    jurnal_url: { type: String },
    jurnal_file: { type: String },
    jurnal_tahun: { type: Number },
    jurnal_bulan: { type: String },
    pengguna_kode: { type: String },
    _pengguna_jenis: { type: String },
    _pengguna_nama: { type: String },
    _prodi_nama: { type: String },
    _personil_data_ketua: { type: String },
    _personil_data_ketua_kode: { type: String },
    _personil_data_ketua_jenis: { type: String }
}, {
    collection: 'publikasiJupeng'
});

module.exports = mongoose.model('publikasiJupeng', JupengSchema);