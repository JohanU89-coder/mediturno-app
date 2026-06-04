const express = require('express');
const router = express.Router();

let users = [
  { id: 1, email: 'test@example.com', password: '12345', name: 'Usuario Test' }
];

router.post('/register', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, contraseña y nombre requeridos' });
  }

  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'El email ya está registrado' });
  }

  const newUser = {
    id: users.length + 1,
    email,
    password,
    name
  };

  users.push(newUser);

  res.status(201).json({
    message: 'Usuario registrado exitosamente',
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name
    }
  });
});


router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  res.json({
    message: 'Login exitoso',
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
});

module.exports = router;
