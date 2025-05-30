const express = require('express');
const router = express.Router();
const City = require('../models/City');
const Country = require('../models/Country');
const auth = require('../middleware/auth');

// Obtener todas las ciudades
router.get('/', async (req, res) => {
  try {
    const cities = await City.find().populate('countryId');
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear una ciudad (solo admin)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'No autorizado' });

  const city = new City({
    name: req.body.name,
    countryId: req.body.countryId,
    population: req.body.population
  });

  try {
    const newCity = await city.save();
    res.status(201).json(newCity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;