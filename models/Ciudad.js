const mongoose = require('mongoose');

const ciudadSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  paisId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pais', required: true },
  imageUrl: { type: String, required: false }
});

module.exports = mongoose.model('Ciudad', ciudadSchema);
