const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true }
});

module.exports = mongoose.model('Dish', dishSchema);