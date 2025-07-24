const mongoose = require('mongoose');

const PenelitianPusatSchema = new mongoose.Schema({
    JUDUL: { type: String, required: true },
    SKEMA: { type: String, required: true },
    NAMA: { type: String, required: true },
    Anggota: [{ type: String }],
    BIAYA: { type: Number },
    TAHUN: { type: Number, required: true },
    PRODI: { type: String },
    NIDN: { type: String },
    NIP: { type: String },
}, {
    collection: 'penelitianPusat'
});

module.exports = mongoose.model('penelitianPusat', PenelitianPusatSchema);