const mongoose = require('mongoose');

const pnbpSchema = new mongoose.Schema({
    Judul: { type: String, required: true },
    Skema: { type: String, required: true },
    Ketua: { type: String, required: true },
    Anggota: [{ type: String }],
    Dana: { type: Number },
    Nilai: { type: Number },
    Prodi: { type: String },
    Tahun: { type: Number }
}, { collection: 'pengabdianPNBP' });

module.exports = mongoose.model('pengabdianPNBP', pnbpSchema);