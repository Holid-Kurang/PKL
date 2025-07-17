const mongoose = require('mongoose');

const MandiriSchema = new mongoose.Schema({
    Judul: { type: String, required: true },
    Skema: { type: String, required: true },
    Ketua: { type: String, required: true },
    Anggota1: { type: String },
    Anggota2: { type: String },
    Anggota3: { type: String },
    Anggota4: { type: String },
    Dana: { type: Number, required: true },
    tahun: { type: Number, required: true },
    Prodi: { type: String, required: true },
}, {
    collection: 'penelitianMandiri'
});

module.exports = mongoose.model('penelitianMandiri', MandiriSchema);