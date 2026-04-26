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


module.exports = router;
