const mongoose = require('mongoose');

const ciudadSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  pais_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pais', required: true },
  imageUrl: { type: String, required: false }
}, { collection: 'ciudad' });

module.exports = mongoose.model('Ciudad', ciudadSchema);