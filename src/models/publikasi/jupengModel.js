const mongoose = require('mongoose');

const JupengSchema = new mongoose.Schema({
    Judul: { type: String, required: true },
    JurnalUrl: { type: String },
    JurnalFile: { type: String },
    Tahun: { type: Number },
    JurnalBulan: { type: String },
    PenggunaKode: { type: String },
    PenggunaJenis: { type: String },
    PenggunaNama: { type: String },
    Prodi: { type: String },
    PersonilDataKetua: { type: String },
    PersonilDataKetuaKode: { type: String },
    PersonilDataKetuaJenis: { type: String }
}, {
    collection: 'publikasiJupeng'
});

module.exports = mongoose.model('publikasiJupeng', JupengSchema);