const mongoose = require('mongoose');

const PengabdianPusatSchema = new mongoose.Schema({
    Judul: { type: String, required: true },
    SKEMA: { type: String, required: true },
    Nama: { type: String, required: true },
    Anggota1: { type: String },
    Anggota2: { type: String },
    Anggota3: { type: String },
    Anggota4: { type: String },
    Dana: { type: Number, required: true },
    Tahun: { type: Number, required: true },
    NomorKontrakLPPM: { type: String, required: true },
    NIP: { type: String, required: true },
    JumlahAnggota: { type: Number, required: true },
    JumlahMshTerlibat: { type: Number, required: true }
}, { collection: 'pengabdianPusat' });

module.exports = mongoose.model('pengabdianPusat', PengabdianPusatSchema);