const mongoose = require('mongoose');

const menu_sitioSchema = new mongoose.Schema({
  sitioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sitios', required: true },
  platoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Platos', required: true },
  valorPlato: { type: Number, required: true }
}, {
 // Forzar nombre exacto de la colección en MongoDB
});

module.exports = mongoose.model('Menu_sitio', menu_sitioSchema, 'menu_sitio');
