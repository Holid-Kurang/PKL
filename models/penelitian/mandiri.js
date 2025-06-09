const mongoose = require('mongoose');

const MandiriSchema = new mongoose.Schema({
    tahun: {
        type: Number,
        required: true
    },
    Ketua: {
        type: String,
        required: true
    },
    Anggota1: {
        type: String
    },
    Anggota2: {
        type: String
    },
    Anggota3: {
        type: String
    },
    Anggota4: {
        type: String
    },
    Skema: {
        type: String,
        required: true
    },
    Judul: {
        type: String,
        required: true
    },
    Prodi: {
        type: String,
        required: true
    },
    Dana: {
        type: Number,
        required: true
    }
}, {
    collection: 'penelitianMandiri'
});

module.exports = mongoose.model('penelitianMandiri', MandiriSchema);