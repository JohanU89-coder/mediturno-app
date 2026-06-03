const express = require('express');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const router  = express.Router();

const SECRET = 'mediturno_secret_2026';
let usuarios = [];

// POST /api/usuarios/registro
router.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios: nombre, email, password' });
  }
  const existe = usuarios.find(u => u.email === email);
  if (existe) { return res.status(400).json({ mensaje: 'El email ya está registrado' }); }
  const passwordHash = await bcrypt.hash(password, 10);
  const nuevoUsuario = { id: usuarios.length + 1, nombre, email, password: passwordHash };
  usuarios.push(nuevoUsuario);
  res.status(201).json({ mensaje: 'Usuario registrado correctamente', usuario: { id: nuevoUsuario.id, nombre, email } });
});



module.exports = router;
