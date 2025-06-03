const mongoose = require('mongoose');

const HAKISchema = new mongoose.Schema({
    hki_judul: {
        type: String,
        required: true
    },
    hki_jenis: {
        type: String,
        required: true
    },
    hki_file: {
        type: String,
        required: true
    },
    hki_bulan: {
        type: String,
        required: true
    },
    hki_tahun: {
        type: Number,
        required: true
    },
    pengguna_kode: {
        type: String,
        required: true
    },
    _pengguna_nama: {
        type: String,
        required: true
    },
    _prodi_nama: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('publikasiHAKI', HAKISchema);