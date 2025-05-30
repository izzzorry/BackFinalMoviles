const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');
const auth = require('../middleware/auth');

// Obtener todas las visitas
router.get('/', auth, async (req, res) => {
  try {
    const visits = await Visit.find()
      .populate('userId')
      .populate('siteId');
    res.json(visits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Registrar una visita
router.post('/', auth, async (req, res) => {
  const visit = new Visit({
    userId: req.user.userId,
    siteId: req.body.siteId,
    visitDate: new Date()
  });

  try {
    const newVisit = await visit.save();
    res.status(201).json(newVisit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;