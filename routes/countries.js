const express = require('express');
const router = express.Router();
const Country = require('../models/Country');
const auth = require('../middleware/auth');

// Obtener todos los países
router.get('/', async (req, res) => {
  try {
    const countries = await Country.find();
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un país (solo admin)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'No autorizado' });

  const country = new Country({
    name: req.body.name,
    code: req.body.code
  });

  try {
    const newCountry = await country.save();
    res.status(201).json(newCountry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;