const express = require('express');
const router = express.Router();

// Base de datos en memoria temporal
let turnos = [
    { id: 1, paciente: "Juan Perez", fecha: "2026-04-30", hora: "10:00", estado: "confirmado" }
];

// Endpoint 1: GET /api/turnos 
router.get('/', (req, res) => {
    res.status(200).json({
        mensaje: "Lista de turnos recuperada con éxito",
        turnos: turnos
    });
});



module.exports = router;