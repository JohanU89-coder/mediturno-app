const form = document.getElementById('appointmentForm');
const resultado = document.getElementById('resultado');

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const paciente = document.getElementById('paciente').value;
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;

  const turno = {
    paciente,
    fecha,
    hora
  };

  try {
    const response = await fetch('http://localhost:5000/api/turnos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(turno)
    });

    const data = await response.json();

    resultado.innerHTML = `
      <p><strong>Resultado:</strong> ${data.mensaje}</p>
      <p><strong>Paciente:</strong> ${data.turno.paciente}</p>
      <p><strong>Fecha:</strong> ${data.turno.fecha}</p>
      <p><strong>Hora:</strong> ${data.turno.hora}</p>
    `;
  } catch (error) {
    resultado.innerHTML = '<p>No se pudo registrar el turno. Verifica que el backend esté activo.</p>';
  }
});
