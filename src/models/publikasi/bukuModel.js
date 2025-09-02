const mongoose = require('mongoose');

const BukuSchema = new mongoose.Schema({
    buku_judul: { type: String, required: true },
    buku_isbn: { type: String, required: true },
    buku_jumlah_halaman: { type: Number, required: true },
    buku_penerbit: { type: String, required: true },
    buku_file: { type: String, required: false },
    buku_tahun: { type: Number, required: true },
    pengguna_kode: { type: String, required: true },
    _pengguna_jenis: { type: String, required: true },
    _pengguna_nama: { type: String, required: true },
    _prodi_nama: { type: String, required: true }
}, {
    collection: 'publikasiBuku'
});

module.exports = mongoose.model('publikasiBuku', BukuSchema);