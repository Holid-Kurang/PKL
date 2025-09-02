const mongoose = require('mongoose');

const KategoriOptionSchema = new mongoose.Schema({
  kategori: { type: String, required: true },
  option: [{ type: String }]
}, { 
  collection: 'KategoriOption' 
});

module.exports = mongoose.model('KategoriOption', KategoriOptionSchema);