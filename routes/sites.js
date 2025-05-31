const express = require('express');
const router = express.Router();
const Site = require('../models/Sitios');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const Ciudad = require('../models/Ciudad');


// Obtener todos los sitios
router.get('/', async (req, res) => {
  try {
    const sites = await Site.find().populate('ciudad_id', 'nombre');
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
  ciudad_id: req.body.ciudad_id,  // ✅ nombre alineado con tu base de datos
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

// Obtener sitios por país
router.get('/por-pais/:paisId', async (req, res) => {
  try {
    const paisId = new mongoose.Types.ObjectId(req.params.paisId.trim());

    // Obtener las ciudades del país
    const ciudades = await Ciudad.find({ pais_id: paisId }).select('_id');
    const ciudadIds = ciudades.map(c => c._id);

    // Buscar sitios en esas ciudades
    const sitios = await Site.find({ ciudad_id: { $in: ciudadIds } })
      .populate('ciudad_id', 'nombre');

    res.json(sitios);
  } catch (err) {
    console.error('Error en /sites/por-pais:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
