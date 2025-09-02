const mongoose = require('mongoose');

const PengabdianPusatSchema = new mongoose.Schema({
    Judul: { type: String, required: true },
    SKEMA: { type: String, required: true },
    Nama: { type: String, required: true },
    Anggota: [{ type: String }],
    Dana: { type: Number, required: true },
    Tahun: { type: Number, required: true },
    NomorKontrakLPPM: { type: String, required: true },
    NIP: { type: String, required: true },
    JumlahAnggota: { type: Number, required: true },
    JumlahMshTerlibat: { type: Number, required: true }
}, { collection: 'pengabdianPusat' });

module.exports = mongoose.model('pengabdianPusat', PengabdianPusatSchema);