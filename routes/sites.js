const express = require('express');
const router = express.Router();
const Site = require('../models/Sitios');
const auth = require('../middleware/auth');

// Obtener todos los sitios
router.get('/', async (req, res) => {
  try {
    const sites = await Site.find().populate('ciudadId', 'nombre');
    res.json(sites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un sitio (solo admin)
router.post('/', auth, async (req, res) => {
  if (req.user.perfil !== 'Admin') return res.status(403).json({ message: 'No autorizado' });

  const site = new Site({
    nombre: req.body.nombre,
    ciudadId: req.body.ciudadId,
    tipo: req.body.tipo,
    geoposicion: req.body.geoposicion,
    imageUrl: req.body.imageUrl
  });

  try {
    const newSite = await site.save();
    res.status(201).json(newSite);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
