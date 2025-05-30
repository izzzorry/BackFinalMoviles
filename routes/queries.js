const express = require('express');
const router = express.Router();
const FamousPerson = require('../models/FamousPerson');
const Visit = require('../models/Visit');
const mongoose = require('mongoose');

// Consulta 1: Personas famosas por categoría y ciudad
router.get('/famous-by-category', async (req, res) => {
  try {
    const famous = await FamousPerson.aggregate([
      {
        $lookup: {
          from: 'cities',
          localField: 'cityId',
          foreignField: '_id',
          as: 'city'
        }
      },
      { $unwind: '$city' },
      {
        $project: {
          name: 1,
          category: 1,
          cityName: '$city.name'
        }
      }
    ]);
    res.json(famous);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Consulta 2: Top 10 sitios más visitados por país
router.get('/top-sites/:countryId', async (req, res) => {
  try {
    const sites = await Visit.aggregate([
      {
        $lookup: {
          from: 'sites',
          localField: 'siteId',
          foreignField: '_id',
          as: 'site'
        }
      },
      { $unwind: '$site' },
      {
        $lookup: {
          from: 'cities',
          localField: 'site.cityId',
          foreignField: '_id',
          as: 'city'
        }
      },
      { $unwind: '$city' },
      { $match: { 'city.countryId': mongoose.Types.ObjectId(req.params.countryId) } },
      {
        $group: {
          _id: '$site._id',
          name: { $first: '$site.name' },
          visitCount: { $sum: 1 }
        }
      },
      { $sort: { visitCount: -1 } },
      { $limit: 10 }
    ]);
    res.json(sites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Consulta 3: Platos más caros por país
router.get('/expensive-dishes/:countryId', async (req, res) => {
  try {
    const dishes = await Dish.aggregate([
      {
        $lookup: {
          from: 'sites',
          localField: 'siteId',
          foreignField: '_id',
          as: 'site'
        }
      },
      { $unwind: '$site' },
      {
        $lookup: {
          from: 'cities',
          localField: 'site.cityId',
          foreignField: '_id',
          as: 'city'
        }
      },
      { $unwind: '$city' },
      { $match: { 'city.countryId': mongoose.Types.ObjectId(req.params.countryId) } },
      { $sort: { price: -1 } },
      { $limit: 5 }
    ]);
    res.json(dishes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Consulta 4: Usuarios con más tags
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
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          userName: '$user.name',
          tagCount: 1
        }
      }
    ]);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;