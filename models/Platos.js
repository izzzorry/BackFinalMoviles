const mongoose = require('mongoose');

const platosSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  ciudad_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ciudad', required: true },
  imageUrl: { type: String, required: false }
}, {
  collection: 'platos' // 🔧 Fuerza el nombre real en tu base
});

module.exports = mongoose.model('Plato', platosSchema);