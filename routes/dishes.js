const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');
const Site = require('../models/Site');
const auth = require('../middleware/auth');

// Obtener todos los platos
router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find().populate('siteId');
    res.json(dishes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un plato (solo admin)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'No autorizado' });

  const dish = new Dish({
    name: req.body.name,
    siteId: req.body.siteId,
    price: req.body.price,
    description: req.body.description
  });

  try {
    const newDish = await dish.save();
    res.status(201).json(newDish);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;