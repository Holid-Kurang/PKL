const mongoose = require('mongoose');

const pnbpSchema = new mongoose.Schema({
    Judul: { type: String, required: true },
    SKEMA: { type: String, required: true },
    Prodi: { type: String, required: true },
    Ketua: { type: String, required: true },
    Anggota1: { type: String },
    Anggota2: { type: String },
    Anggota3: { type: String },
    Anggota4: { type: String },
    Biaya: { type: Number, required: true },
    Tahun: { type: Number, required: true },
    RataRataNilai: { type: Number },
}, {
    collection: 'penelitianPNBP'
});

module.exports = mongoose.model('penelitianPNBP', pnbpSchema);