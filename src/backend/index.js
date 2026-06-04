const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(cors());
app.use(express.json());

const usuariosRoutes = require('./routes/users');
const turnosRoutes   = require('./routes/appointments');

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/turnos',   turnosRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor MediTurno funcionando correctamente' });
});

const PORT = 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor MediTurno corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
