const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  famousPersonId: { type: mongoose.Schema.Types.ObjectId, ref: 'FamousPerson', required: true },
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  tagDate: { type: Date, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  }
});

module.exports = mongoose.model('Tag', tagSchema);