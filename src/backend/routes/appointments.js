const express = require('express');
const jwt     = require('jsonwebtoken');
const router  = express.Router();

const SECRET = 'mediturno_secret_2026';
let turnos = [];

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) { return res.status(401).json({ mensaje: 'Token requerido' }); }
  try { const decoded = jwt.verify(token, SECRET); req.usuario = decoded; next(); }
  catch { return res.status(401).json({ mensaje: 'Token inválido o expirado' }); }
}

// GET /api/turnos
router.get('/', verificarToken, (req, res) => {
  const misTurnos = turnos.filter(t => t.usuarioId === req.usuario.id);
  res.json(misTurnos);
});

// POST /api/turnos
router.post('/', verificarToken, (req, res) => {
  const { medico, fecha, hora } = req.body;
  if (!medico || !fecha || !hora) { return res.status(400).json({ mensaje: 'Campos obligatorios: medico, fecha, hora' }); }
  const nuevaCita = { id: turnos.length + 1, usuarioId: req.usuario.id, medico, fecha, hora };
  turnos.push(nuevaCita);
  res.status(201).json({ mensaje: 'Cita reservada', cita: nuevaCita });
});

// DELETE /api/turnos/:id
router.delete('/:id', verificarToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = turnos.findIndex(t => t.id === id && t.usuarioId === req.usuario.id);
  if (index === -1) { return res.status(404).json({ mensaje: 'Cita no encontrada' }); }
  turnos.splice(index, 1);
  res.json({ mensaje: 'Cita cancelada correctamente' });
});

module.exports = router;
