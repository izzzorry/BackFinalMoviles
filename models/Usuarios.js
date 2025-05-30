const mongoose = require('mongoose');

const usuariosSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Será hasheada
  perfil: { type: String, enum: ['Admin', 'Comun'], required: true },
  nombre: { type: String, required: true }
});

module.exports = mongoose.model('Usuarios', usuariosSchema);