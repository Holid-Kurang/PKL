const mongoose = require('mongoose');

const PenelitianPusatSchema = new mongoose.Schema({
    TAHUN: { type: Number, required: true },
    SKEMA: { type: String, required: true },
    NAMA: { type: String, required: true },
    Anggota1: { type: String },
    Anggota2: { type: String },
    Anggota3: { type: String },
    Anggota4: { type: String },
    NIP: { type: String },
    NIDN: { type: String },
    PRODI: { type: String },
    JUDUL: { type: String, required: true },
    BIAYA: { type: Number }
}, {
    collection: 'penelitianPusat'
});

module.exports = mongoose.model('penelitianPusat', PenelitianPusatSchema);