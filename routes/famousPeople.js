const express = require('express');
const router = express.Router();
const FamousPerson = require('../models/FamousPerson');
const City = require('../models/City');
const auth = require('../middleware/auth');

// Obtener todas las personas famosas
router.get('/', async (req, res) => {
  try {
    const famousPeople = await FamousPerson.find().populate('cityId');
    res.json(famousPeople);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear una persona famosa (solo admin)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'No autorizado' });

  const famousPerson = new FamousPerson({
    name: req.body.name,
    cityId: req.body.cityId,
    category: req.body.category,
    description: req.body.description
  });

  try {
    const newFamousPerson = await famousPerson.save();
    res.status(201).json(newFamousPerson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;