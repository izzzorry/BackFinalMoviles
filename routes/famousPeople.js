const express = require('express');
const router = express.Router();
const FamousPerson = require('../models/Famosos');
const auth = require('../middleware/auth');

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

module.exports = router;
