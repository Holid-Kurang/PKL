const mongoose = require('mongoose');

const HAKISchema = new mongoose.Schema({
    Judul: {
        type: String,
        required: true
    },
    HkiJenis: {
        type: String,
        required: true
    },
    HkiFile: {
        type: String,
        required: true
    },
    HkiBulan: {
        type: String,
        required: true
    },
    Tahun: {
        type: Number,
        required: true
    },
    PenggunaKode: {
        type: String,
        required: true
    },
    PenggunaNama: {
        type: String,
        required: true
    },
    Prodi: {
        type: String,
        required: true
    }
}, {
    collection: 'publikasiHAKI'
});

module.exports = mongoose.model('publikasiHAKI', HAKISchema);