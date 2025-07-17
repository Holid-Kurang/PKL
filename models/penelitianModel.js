const mongoose = require('mongoose');

const penelitianSchema = new mongoose.Schema({
    judul: { type: String, required: true },
    skema: { type: String, required: true },
    prodi: { type: String, required: true },
    ketua: { type: String, required: true },
    anggota: [{ type: String }],
    tahun: { type: Number, required: true },
    biaya: { type: Number, required: true },
    sumberDana: { 
        type: String, 
        required: true, 
        enum: ['Pusat', 'PNBP', 'Mandiri'] 
    },
    nip: { type: String },
    nidn: { type: String },
    nilai: { type: Number },
}, {
    collection: 'penelitian'
});

module.exports = mongoose.model('Penelitian', penelitianSchema);
