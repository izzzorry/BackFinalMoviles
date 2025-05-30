const express = require('express');
const router = express.Router();
const MenuSitio = require('../models/Menu_sitio');
const auth = require('../middleware/auth');

// Obtener todos los menús de sitios
router.get('/', async (req, res) => {
  try {
    const menus = await MenuSitio.find()
      .populate('sitioId', 'nombre tipo')
      .populate('platoId', 'nombre categoria');
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un menú para un sitio (solo admin)
router.post('/', auth, async (req, res) => {
  if (req.user.perfil !== 'Admin') return res.status(403).json({ message: 'No autorizado' });

  const menu = new MenuSitio({
    sitioId: req.body.sitioId,
    platoId: req.body.platoId,
    valorPlato: req.body.valorPlato
  });

  try {
    const newMenu = await menu.save();
    res.status(201).json(newMenu);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
