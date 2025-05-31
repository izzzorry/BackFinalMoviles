const mongoose = require('mongoose');

const ciudadSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  paisId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pais', required: true },
  imageUrl: { type: String, required: false }
}, { collection: 'ciudad' });  // <- Aquí forzas el nombre exacto de la colección existente

module.exports = mongoose.model('Ciudad', ciudadSchema);