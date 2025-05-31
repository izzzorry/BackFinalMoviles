// routes/tags.js
const express = require('express');
const router = express.Router();
const Tag = require('../models/Tags');
const Site = require('../models/Sitios');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configuración de multer para guardar archivos en /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // Nombre único: timestamp + nombre original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });

// Obtener todos los tags (igual que antes)
router.get('/', auth, async (req, res) => {
  try {
    const tags = await Tag.find()
      .populate('userId', 'nombre email perfil')
      .populate('famousPersonId', 'nombre categoria')
      .populate('siteId', 'nombre geoposicion');
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Registrar un tag CON FOTO
// Usamos upload.single('photo') para procesar el campo "photo" del formulario
router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    const { famousPersonId, siteId } = req.body;
    if (!famousPersonId || !siteId) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    // Obtener geoposición desde el site
    const site = await Site.findById(siteId);
    if (!site) return res.status(404).json({ message: 'Sitio no encontrado' });

    // Construir la URL o ruta de la imagen subida
    let photoUrl = '';
    if (req.file) {
      // Ejemplo: "/uploads/photo-123456789.jpg"
      photoUrl = `/uploads/${req.file.filename}`;
    }

    const tag = new Tag({
      userId: req.user.userId,
      famousPersonId,
      siteId,
      tagDate: new Date(),
      geoposicion: {
        latitude: site.geoposicion.latitude,
        longitude: site.geoposicion.longitude
      },
      photoUrl  // guardamos la ruta en la DB
    });

    const newTag = await tag.save();
    res.status(201).json(newTag);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

