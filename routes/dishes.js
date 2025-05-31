const express = require('express');
const router = express.Router();
const Plato = require('../models/Platos'); // Cambiado de 'Dish' a 'Plato'
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const Ciudad = require('../models/Ciudad');

// Obtener todos los platos
router.get('/', async (req, res) => {
  try {
    const platos = await Plato.find().populate('ciudad_id', 'nombre');
    res.json(platos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener platos por ciudad
router.get('/dishes-by-city/:cityId', async (req, res) => {
  try {
    const cityId = req.params.cityId;
    const platos = await Plato.find({ ciudad_id: cityId }).populate('ciudad_id', 'nombre');
    res.json(platos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener platos por país
router.get('/por-pais/:paisId', async (req, res) => {
  try {
    const paisId = new mongoose.Types.ObjectId(req.params.paisId.trim());

    const ciudades = await Ciudad.find({ pais_id: paisId }).select('_id');
    const ciudadIds = ciudades.map(c => c._id);

    const platos = await Plato.find({ ciudad_id: { $in: ciudadIds } })
      .populate('ciudad_id', 'nombre');

    res.json(platos);
  } catch (err) {
    console.error('Error en /dishes/por-pais:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Crear un nuevo plato (solo admin)
router.post('/', auth, async (req, res) => {
  if (req.user.perfil !== 'Admin') return res.status(403).json({ message: 'No autorizado' });

  const dish = new Plato({
    nombre: req.body.nombre,
    ciudad_id: req.body.ciudad_id,
    imageUrl: req.body.imageUrl
  });

  try {
    const newDish = await dish.save();
    res.status(201).json(newDish);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
