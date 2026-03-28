const express = require('express');
const cors = require('cors');
require('./config/env');

const authRoutes = require('./routes/auth.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);

// Ruta de salud para verificar que el servidor corre
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando' });
});

// Middleware de errores — siempre al final
app.use(errorMiddleware);

const { port } = require('./config/env');
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

module.exports = app;
