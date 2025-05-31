const express = require('express');
const router = express.Router();
const MenuSitio = require('../models/Menu_sitio');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Obtener todos los menús de sitios
router.get('/', async (req, res) => {
  try {
    const menus = await MenuSitio.find()
      .populate('sitio_id', 'nombre tipo')
      .populate('plato_id', 'nombre categoria');
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un menú para un sitio (solo admin)
router.post('/', auth, async (req, res) => {
  if (req.user.perfil !== 'Admin') {
    return res.status(403).json({ message: 'No autorizado' });
  }

  const menu = new MenuSitio({
    sitio_id: req.body.sitio_id,
    plato_id: req.body.plato_id,
    valor_plato: req.body.valor_plato
  });

  try {
    const newMenu = await menu.save();
    res.status(201).json(newMenu);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener menú por ID de plato
router.get('/por-plato/:plato_id', async (req, res) => {
  try {
    const menus = await MenuSitio.find({ plato_id: req.params.plato_id })
      .populate('sitio_id', 'nombre tipo')
      .populate('plato_id', 'nombre categoria');
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener menú por ID de sitio
router.get('/por-sitio/:sitio_id', async (req, res) => {
  try {
    const menus = await MenuSitio.find({ sitio_id: req.params.sitio_id })
      .populate('sitio_id', 'nombre tipo')
      .populate('plato_id', 'nombre categoria');
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
