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

// Endpoint 2: POST /api/turnos
router.post('/', (req, res) => {
    const { paciente, fecha, hora } = req.body;
    
    const nuevoTurno = {
        id: turnos.length > 0 ? turnos[turnos.length - 1].id + 1 : 1,
        paciente,
        fecha,
        hora,
        estado: "pendiente"
    };

    turnos.push(nuevoTurno);
    res.status(201).json({
        mensaje: "Turno reservado con éxito",
        turno: nuevoTurno
    });
});

// Endpoint 3: DELETE /api/turnos/:id 
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const turnoIndex = turnos.findIndex(t => t.id === id);

    if (turnoIndex !== -1) {
        turnos.splice(turnoIndex, 1);
        res.status(200).json({ mensaje: `Turno con ID ${id} cancelado correctamente` });
    } else {
        res.status(404).json({ mensaje: "Turno no encontrado" });
    }
});

module.exports = router;