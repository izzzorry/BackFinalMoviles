const mongoose = require('mongoose');

const famososSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  ciudad_nacimiento_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ciudad', required: true },
  categoria: { type: String, required: true },
  imageUrl: { type: String, required: false }
});

module.exports = mongoose.model('Famosos', famososSchema);

