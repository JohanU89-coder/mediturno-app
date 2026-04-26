const express = require('express');
const usersRoutes = require('./routes/users');
const appointmentsRoutes = require('./routes/appointments');

const app = express();

app.use(express.json());

app.use('/api/users', usersRoutes);
app.use('/api/turnos', appointmentsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
