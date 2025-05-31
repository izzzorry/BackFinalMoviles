const express = require('express');
const router = express.Router();
const City = require('../models/Ciudad');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Obtener todas las ciudades
router.get('/', async (req, res) => {
  try {
    const cities = await City.find().populate('pais_id', 'nombre codigo');
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener ciudades por ID de país
router.get('/por-pais/:paisId', async (req, res) => {
  try {
    const paisObjectId = new mongoose.Types.ObjectId(req.params.paisId.trim()); // 🔑 Usa trim()
    const cities = await City.find({ pais_id: paisObjectId }).populate('pais_id', 'nombre codigo');
    res.json(cities);
  } catch (err) {
    console.error('Error en /por-pais:', err.message); // 🧪 Imprime el error exacto
    res.status(500).json({ message: err.message });
  }
});

// Crear una ciudad (solo admin)
router.post('/', auth, async (req, res) => {
  if (req.user.perfil !== 'Admin') return res.status(403).json({ message: 'No autorizado' });

  const city = new City({
    nombre: req.body.nombre,
    pais_id: req.body.pais_id,
    imageUrl: req.body.imageUrl
  });

  try {
    const newCity = await city.save();
    res.status(201).json(newCity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  if (req.user.perfil !== 'Admin') return res.status(403).json({ message: 'No autorizado' });

  try {
    const updatedCity = await City.findByIdAndUpdate(
      req.params.id,
      {
        nombre: req.body.nombre,
        imageUrl: req.body.imageUrl
      },
      { new: true }
    );
    res.json(updatedCity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete('/:id', auth, async (req, res) => {
  if (req.user.perfil !== 'Admin') return res.status(403).json({ message: 'No autorizado' });

  try {
    await City.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ciudad eliminada correctamente' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = router;