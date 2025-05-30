const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
  population: { type: Number, required: true }
});

module.exports = mongoose.model('City', citySchema);