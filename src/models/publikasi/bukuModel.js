const mongoose = require('mongoose');

const BukuSchema = new mongoose.Schema({
    Judul: { type: String, required: true },
    BukuIsbn: { type: String, required: true },
    BukuJumlahHalaman: { type: Number, required: true },
    BukuPenerbit: { type: String, required: true },
    BukuFile: { type: String, required: false },
    Tahun: { type: Number, required: true },
    PenggunaKode: { type: String, required: true },
    PenggunaJenis: { type: String, required: true },
    PenggunaNama: { type: String, required: true },
    Prodi: { type: String, required: true }
}, {
    collection: 'publikasiBuku'
});

module.exports = mongoose.model('publikasiBuku', BukuSchema);