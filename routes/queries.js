// routes/queries.js

const express       = require('express');
const router        = express.Router();
const FamousPerson  = require('../models/Famosos');    // Asegúrate de que el nombre del archivo coincida
const Visit         = require('../models/Visitas');    // modelo de visitas
const Dish          = require('../models/Platos');     // modelo de platos
const Tag           = require('../models/Tags');       // modelo de tags (etiquetas con fotos)
const mongoose      = require('mongoose');

// --------------------------------------------------
// 1) Consulta 1: Personas famosas por categoría y ciudad
router.get('/famous-by-category', async (req, res) => {
  try {
    const famous = await FamousPerson.aggregate([
      {
        $lookup: {
          from: 'ciudad',         // Asegúrate de que tu colección real se llame "ciudad"
          localField: 'ciudadNacimientoId',
          foreignField: '_id',
          as: 'city'
        }
      },
      { $unwind: '$city' },
      {
        $project: {
          nombre: 1,
          categoria: 1,
          cityName: '$city.nombre'
        }
      }
    ]);
    res.json(famous);
  } catch (err) {
    console.error('Error en /queries/famous-by-category:', err);
    res.status(500).json({ message: err.message });
  }
});

// --------------------------------------------------
// 2) Consulta 2: Top 10 sitios más visitados por país
router.get('/top-sites/:countryId', async (req, res) => {
  try {
    const sites = await Visit.aggregate([
      {
        $lookup: {
          from: 'sitio',           // nombre de colección “sitio” o “sitios”, según tu BD
          localField: 'sitioId',
          foreignField: '_id',
          as: 'site'
        }
      },
      { $unwind: '$site' },
      {
        $lookup: {
          from: 'ciudad',          // nombre de colección “ciudad” o “ciudades”
          localField: 'site.ciudadId',
          foreignField: '_id',
          as: 'city'
        }
      },
      { $unwind: '$city' },
      {
        $match: {
          'city.paisId': mongoose.Types.ObjectId(req.params.countryId)
        }
      },
      {
        $group: {
          _id: '$site._id',
          name: { $first: '$site.nombre' },
          visitCount: { $sum: 1 }
        }
      },
      { $sort: { visitCount: -1 } },
      { $limit: 10 }
    ]);
    res.json(sites);
  } catch (err) {
    console.error('Error en /queries/top-sites/:countryId:', err);
    res.status(500).json({ message: err.message });
  }
});

// --------------------------------------------------
// 3) Consulta 3: Platos más caros por país
router.get('/expensive-dishes/:countryId', async (req, res) => {
  try {
    const dishes = await Dish.aggregate([
      {
        $lookup: {
          from: 'sitio',           // asegúrate de usar el nombre correcto de tu colección de sitios
          localField: 'sitioId',
          foreignField: '_id',
          as: 'site'
        }
      },
      { $unwind: '$site' },
      {
        $lookup: {
          from: 'ciudad',
          localField: 'site.ciudadId',
          foreignField: '_id',
          as: 'city'
        }
      },
      { $unwind: '$city' },
      {
        $match: {
          'city.paisId': mongoose.Types.ObjectId(req.params.countryId)
        }
      },
      { $sort: { price: -1 } },
      { $limit: 5 }
    ]);
    res.json(dishes);
  } catch (err) {
    console.error('Error en /queries/expensive-dishes/:countryId:', err);
    res.status(500).json({ message: err.message });
  }
});

// --------------------------------------------------
// 4) Consulta 4: Usuarios con más tags
router.get('/top-users-with-tags', async (req, res) => {
  try {
    const users = await Tag.aggregate([
      {
        $group: {
          _id: '$userId',
          tagCount: { $sum: 1 }
        }
      },
      { $sort: { tagCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          // Si tu colección de usuarios se llama “usuarios”, pon exactamente ese nombre:
          from: 'usuarios',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          userName: '$user.nombre',
          tagCount: 1
        }
      }
    ]);
    res.json(users);
  } catch (err) {
    console.error('Error en /queries/top-users-with-tags:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
