const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');
const auth = require('../middleware/auth');

// Obtener todos los tags
router.get('/', auth, async (req, res) => {
  try {
    const tags = await Tag.find()
      .populate('userId')
      .populate('famousPersonId')
      .populate('siteId');
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Registrar un tag
router.post('/', auth, async (req, res) => {
  const tag = new Tag({
    userId: req.user.userId,
    famousPersonId: req.body.famousPersonId,
    siteId: req.body.siteId,
    tagDate: new Date(),
    location: {
      latitude: req.body.latitude,
      longitude: req.body.longitude
    }
  });

  try {
    const newTag = await tag.save();
    res.status(201).json(newTag);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;