const mongoose = require('mongoose');

const publikasiSchema = new mongoose.Schema({
    // Common Fields
    judul: { type: String, required: true },
    tahun: { type: Number, required: true },
    pengguna_kode: { type: String, required: true },
    _pengguna_nama: { type: String, required: true },
    Prodi: { type: String, required: true },
    file: { type: String },
    bulan: { type: String },
    _pengguna_jenis: { type: String },

    // Discriminator
    jenisPublikasi: {
        type: String,
        required: true,
        enum: ['Buku', 'HAKI', 'Jurnal']
    },

    // Buku Specific Fields
    isbn: { type: String },
    jumlahHalaman: { type: Number },
    penerbit: { type: String },

    // HAKI Specific Fields
    jenisHki: { type: String },

    // Jurnal Specific Fields
    url: { type: String },
    _personil_data_ketua: { type: String },
    _personil_data_ketua_kode: { type: String },
    _personil_data_ketua_jenis: { type: String }
}, {
    collection: 'publikasi'
});

module.exports = mongoose.model('Publikasi', publikasiSchema);
