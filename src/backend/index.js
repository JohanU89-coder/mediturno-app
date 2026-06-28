const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const usuariosRoutes = require('./routes/users');
const turnosRoutes = require('./routes/appointments');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'MediTurno',
    message: 'Servidor MediTurno funcionando correctamente'
  });
});

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/turnos', turnosRoutes);

const publicDir = path.join(__dirname, 'public');
const localFrontendDir = path.join(__dirname, '..', 'frontend');
const frontendDir = fs.existsSync(path.join(publicDir, 'index.html')) ? publicDir : localFrontendDir;

app.use(express.static(frontendDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor MediTurno corriendo en el puerto ${PORT}`);
  });
}

module.exports = app;
