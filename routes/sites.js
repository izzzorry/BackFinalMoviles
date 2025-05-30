const express = require('express');
const router = express.Router();
const Site = require('../models/Site');
const City = require('../models/City');
const auth = require('../middleware/auth');

// Obtener todos los sitios
router.get('/', async (req, res) => {
  try {
    const sites = await Site.find().populate('cityId');
    res.json(sites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un sitio (solo admin)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'No autorizado' });

  const site = new Site({
    name: req.body.name,
    cityId: req.body.cityId,
    type: req.body.type,
    description: req.body.description
  });

  try {
    const newSite = await site.save();
    res.status(201).json(newSite);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;