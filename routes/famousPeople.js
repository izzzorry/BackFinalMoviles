const express = require('express');
const router = express.Router();
const FamousPerson = require('../models/Famosos');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const Ciudad = require('../models/Ciudad');

// Obtener todas las personas famosas
router.get('/', async (req, res) => {
  try {
    const famousPeople = await FamousPerson.find()
      .populate('ciudadNacimientoId', 'nombre'); // Solo el nombre de la ciudad
    res.json(famousPeople);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear una persona famosa (solo admin)
router.post('/', auth, async (req, res) => {
  if (req.user.perfil !== 'Admin') return res.status(403).json({ message: 'No autorizado' });

  const famousPerson = new FamousPerson({
    nombre: req.body.nombre,
    ciudadNacimientoId: req.body.ciudadNacimientoId,
    categoria: req.body.categoria,
    imageUrl: req.body.imageUrl
  });

  try {
    const newFamousPerson = await famousPerson.save();
    res.status(201).json(newFamousPerson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.get('/por-pais/:paisId', async (req, res) => {
  try {
    const paisId = new mongoose.Types.ObjectId(req.params.paisId.trim());

    // 1. Obtener ciudades del país
    const ciudades = await Ciudad.find({ pais_id: paisId }).select('_id');
    const ciudadIds = ciudades.map(c => c._id);

    // 2. Buscar famosos con ciudad_nacimiento_id en esas ciudades
    const famosos = await FamousPerson.find({ ciudad_nacimiento_id: { $in: ciudadIds } })
      .populate('ciudad_nacimiento_id', 'nombre');

    res.json(famosos);
  } catch (err) {
    console.error('Error en /famousPeople/por-pais:', err.message);
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
