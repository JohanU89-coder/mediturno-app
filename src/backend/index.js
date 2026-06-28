const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

const usuariosRoutes = require('./routes/users');
const turnosRoutes = require('./routes/appointments');

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/turnos', turnosRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'MediTurno',
    message: 'Servidor funcionando correctamente'
  });
});

const publicDir = path.join(__dirname, 'public');
const localFrontendDir = path.join(__dirname, '..', 'frontend');
const frontendDir = fs.existsSync(publicDir) ? publicDir : localFrontendDir;

app.use(express.static(frontendDir));

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor MediTurno corriendo en el puerto ${PORT}`);
  });
}

module.exports = app;
