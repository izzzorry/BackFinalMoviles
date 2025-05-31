const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuarios', required: true },
  famousPersonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Famosos', required: true },
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sitio', required: true },
  tagDate: { type: Date, required: true },
  geoposicion: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  photoUrl: { type: String, required: false }  // <-- ruta o URL de la foto
});


module.exports = mongoose.model('Tag', tagSchema);
