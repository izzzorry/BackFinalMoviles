const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Necesario para manejar rutas de archivos

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1) Exponer la carpeta "uploads" como estática
//    De este modo, cualquier URL que comience con "/uploads"
//    servirá el archivo correspondiente desde la carpeta /uploads.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2) Rutas de tu API (asegúrate de que la ruta de tags use multer segun vimos antes)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/countries', require('./routes/countries'));
app.use('/api/cities', require('./routes/cities'));
app.use('/api/famousPeople', require('./routes/famousPeople'));
app.use('/api/sites', require('./routes/sites'));
app.use('/api/dishes', require('./routes/dishes'));
app.use('/api/visits', require('./routes/visits'));
app.use('/api/tags', require('./routes/tags'));                 // aquí procesa tags con multer
app.use('/api/menu_sitios', require('./routes/menu_sitios'));
app.use('/api/queries', require('./routes/queries'));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
