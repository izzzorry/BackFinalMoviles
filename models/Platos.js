const mongoose = require('mongoose');

const platosSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  ciudadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ciudad', required: true },
  imageUrl: { type: String, required: false }
});

module.exports = mongoose.model('Platos', platosSchema);
