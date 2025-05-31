const mongoose = require('mongoose');

const sitioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  ciudad_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ciudad', required: true },
  tipo: { type: String, required: true },
  geoposicion: { type: String, required: false },
  imageUrl: { type: String, required: false }
});

module.exports = mongoose.model('Sitio', sitioSchema);
