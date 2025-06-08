const mongoose = require('mongoose');

const MandiriSchema = new mongoose.Schema({
    tahun: {
        type: Number,
        required: true
    },
    ketuaPelaksana: {
        type: String,
        required: true
    },
    anggota1: {
        type: String
    },
    anggota2: {
        type: String
    },
    anggota3: {
        type: String
    },
    anggota4: {
        type: String
    },
    skema: {
        type: String,
        required: true
    },
    judulPenelitian: {
        type: String,
        required: true
    },
    prodi: {
        type: String,
        required: true
    },
    jumlahDana: {
        type: Number,
        required: true
    }
}, {
    collection: 'penelitianMandiri'
});

module.exports = mongoose.model('penelitianMandiri', MandiriSchema);