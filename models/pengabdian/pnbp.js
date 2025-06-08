const mongoose = require('mongoose');

const pnbpSchema = new mongoose.Schema({
    Judul: { type: String, required: true },
    SKEMA: { type: String, required: true },
    Ketua: { type: String, required: true },
    Anggota1: { type: String },
    Anggota2: { type: String },
    Anggota3: { type: String },
    Anggota4: { type: String },
    NilaiRataRata: { type: Number },
    BiayaDisetujui: { type: Number },
    Prodi: { type: String },
    Tahun: { type: Number }
}, { collection: 'pengabdianPNBP' });

module.exports = mongoose.model('pengabdianPNBP', pnbpSchema);