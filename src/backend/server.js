const express = require('express');
const usersRoutes = require('./routes/users');

const app = express();

app.use(express.json());

app.use('/api/users', usersRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
