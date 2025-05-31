const mongoose = require('mongoose');

const menu_sitioSchema = new mongoose.Schema({
  sitio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sitio', required: true },
  plato_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Plato', required: true },
  valor_plato: { type: Number, required: true }
});

// Forzar colección explícita
module.exports = mongoose.model('Menu_sitio', menu_sitioSchema, 'menu_sitio');