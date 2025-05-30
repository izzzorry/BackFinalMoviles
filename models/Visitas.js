const mongoose = require('mongoose');

const visitasSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuarios', required: true },
  sitioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sitios', required: true },
  visitaDate: { type: Date, required: true }
});

module.exports = mongoose.model('Visitas', visitasSchema);
