const mongoose = require('mongoose');

const pengabdianSchema = new mongoose.Schema({
    judul: { type: String, required: true },
    skema: { type: String, required: true },
    ketua: { type: String, required: true },
    anggota1: { type: String },
    anggota2: { type: String },
    anggota3: { type: String },
    anggota4: { type: String },
    tahun: { type: Number, required: true },
    dana: { type: Number, required: true },
    sumberDana: { 
        type: String, 
        required: true, 
        enum: ['Pusat', 'PNBP'] 
    },
    prodi: { type: String },
    nilai: { type: Number },
    nomorKontrakLPPM: { type: String },
    nip: { type: String },
    jumlahAnggota: { type: Number },
    jumlahMhsTerlibat: { type: Number }
}, {
    collection: 'pengabdian'
});

module.exports = mongoose.model('Pengabdian', pengabdianSchema);
