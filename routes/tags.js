const express = require('express');
const router = express.Router();
const Tag = require('../models/Tags');
const Site = require('../models/Sitios');
const auth = require('../middleware/auth');

// Obtener todos los tags
router.get('/', auth, async (req, res) => {
  try {
    const tags = await Tag.find()
      .populate('userId', 'nombre email perfil')
      .populate('famousPersonId', 'nombre categoria')
      .populate('siteId', 'nombre geoposicion')
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Registrar un tag
router.post('/', auth, async (req, res) => {
  try {
    const { famousPersonId, siteId } = req.body;
    if (!famousPersonId || !siteId) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    // Obtener geoposicion desde el site
    const site = await Site.findById(siteId);
    if (!site) return res.status(404).json({ message: 'Sitio no encontrado' });

    const tag = new Tag({
      userId: req.user.userId,
      famousPersonId,
      siteId,
      tagDate: new Date(),
      geoposicion: {
        latitude: site.geoposicion.latitude,
        longitude: site.geoposicion.longitude
      }
    });

    const newTag = await tag.save();
    res.status(201).json(newTag);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
