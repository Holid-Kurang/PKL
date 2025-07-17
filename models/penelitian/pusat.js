const mongoose = require('mongoose');

const PenelitianPusatSchema = new mongoose.Schema({
    JUDUL: { type: String, required: true },
    SKEMA: { type: String, required: true },
    NAMA: { type: String, required: true },
    Anggota1: { type: String },
    Anggota2: { type: String },
    Anggota3: { type: String },
    Anggota4: { type: String },
    BIAYA: { type: Number },
    TAHUN: { type: Number, required: true },
    PRODI: { type: String },
    NIDN: { type: String },
    NIP: { type: String },
}, {
    collection: 'penelitianPusat'
});

module.exports = mongoose.model('penelitianPusat', PenelitianPusatSchema);