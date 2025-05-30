const express = require('express');
const router = express.Router();
const Visit = require('../models/Visitas');
const auth = require('../middleware/auth');

// Obtener todas las visitas
router.get('/', auth, async (req, res) => {
  try {
    const visits = await Visit.find()
      .populate('usuarioId')
      .populate('sitioId');
    res.json(visits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Registrar una visita
router.post('/', auth, async (req, res) => {
  try {
    if (!req.body.sitioId) {
      return res.status(400).json({ message: 'Falta sitioId' });
    }

    const visit = new Visit({
      usuarioId: req.user.userId,
      sitioId: req.body.sitioId,
      visitaDate: new Date()
    });

    const newVisit = await visit.save();
    res.status(201).json(newVisit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
