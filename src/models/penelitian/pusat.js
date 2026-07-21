const mongoose = require('mongoose');

const PenelitianPusatSchema = new mongoose.Schema({
    Judul: { type: String, required: true },
    Skema: { type: String, required: true },
    Nama: { type: String, required: true },
    Anggota: [{ type: String }],
    Biaya: { type: Number },
    Tahun: { type: Number, required: true },
    Prodi: { type: String },
    NIDN: { type: String },
    NIP: { type: String },
}, {
    collection: 'penelitianPusat'
});

module.exports = mongoose.model('penelitianPusat', PenelitianPusatSchema);