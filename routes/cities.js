const express = require('express');
const router = express.Router();
const City = require('../models/Ciudad');
const auth = require('../middleware/auth');

// Obtener todas las ciudades
router.get('/', async (req, res) => {
  try {
    const cities = await City.find().populate('paisId', 'nombre codigo');
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear una ciudad (solo admin)
router.post('/', auth, async (req, res) => {
  if (req.user.perfil !== 'Admin') return res.status(403).json({ message: 'No autorizado' });

  const city = new City({
    nombre: req.body.nombre,
    paisId: req.body.paisId,
    imageUrl: req.body.imageUrl
  });

  try {
    const newCity = await city.save();
    res.status(201).json(newCity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
