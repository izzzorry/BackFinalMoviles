const express = require('express');
const router = express.Router();
const Dish = require('../models/Platos');
const auth = require('../middleware/auth');

// Obtener todos los platos
router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find().populate('ciudadId', 'nombre');
    res.json(dishes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un plato (solo admin)
router.post('/', auth, async (req, res) => {
  if (req.user.perfil !== 'Admin') return res.status(403).json({ message: 'No autorizado' });

  const dish = new Dish({
    nombre: req.body.nombre,
    ciudadId: req.body.ciudadId,
    imageUrl: req.body.imageUrl
  });

  try {
    const newDish = await dish.save();
    res.status(201).json(newDish);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener platos por ciudad
router.get('/dishes-by-city/:cityId', async (req, res) => {
  try {
    const cityId = req.params.cityId;

    const dishes = await Dish.find({ ciudadId: cityId }).populate('ciudadId', 'nombre');
    res.json(dishes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
