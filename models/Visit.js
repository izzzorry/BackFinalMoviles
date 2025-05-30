const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  visitDate: { type: Date, required: true }
});

module.exports = mongoose.model('Visit', visitSchema);