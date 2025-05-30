const mongoose = require('mongoose');

const sitiosSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  ciudadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ciudad', required: true },
  tipo: { type: String, required: true }, // Ej: "Iglesia", "Estadio", "Museo"
  geoposicion: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  imageUrl: { type: String, required: false }
});

module.exports = mongoose.model('Sitios', sitiosSchema);
