const mongoose = require('mongoose');

const pnbpSchema = new mongoose.Schema({
    Judul: { type: String, required: true },
    Skema: { type: String, required: true },
    Ketua: { type: String, required: true },
    Anggota: [{ type: String }],
    Biaya: { type: Number, required: true },
    Tahun: { type: Number, required: true },
    Prodi: { type: String, required: true },
    Nilai: { type: Number },
}, {
    collection: 'penelitianPNBP'
});


module.exports = mongoose.model('penelitianPNBP', pnbpSchema);