
const API = 'http://localhost:5000/api';

function getToken() { return localStorage.getItem('token'); }

window.addEventListener('load', () => {
  if (!getToken()) { alert('Debes iniciar sesión primero.'); window.location.href = 'login.html'; return; }
  cargarCitas();
});

document.getElementById('btn-recargar').addEventListener('click', cargarCitas);
document.getElementById('btn-cerrar-sesion').addEventListener('click', () => {
  localStorage.removeItem('token'); window.location.href = 'login.html';
});

document.getElementById('form-cita').addEventListener('submit', async (e) => {
  e.preventDefault();
  const medico = document.getElementById('medico').value;
  const fecha  = document.getElementById('fecha').value;
  const hora   = document.getElementById('hora').value;
  const msg    = document.getElementById('msg-cita');
  try {
    const res = await fetch(`${API}/turnos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify({ medico, fecha, hora })
    });
    const data = await res.json();
    if (res.ok) { msg.style.color = 'green'; msg.textContent = '✅ Cita reservada correctamente'; cargarCitas(); }
    else { msg.style.color = 'red'; msg.textContent = '❌ ' + (data.mensaje || 'Error al reservar'); }
  } catch { msg.style.color = 'red'; msg.textContent = '❌ No se pudo conectar con el servidor'; }
  setTimeout(() => { msg.textContent = ''; }, 4000);
});

async function cargarCitas() {
  const contenedor = document.getElementById('lista-citas');
  contenedor.innerHTML = '<p>Cargando...</p>';
  try {
    const res = await fetch(`${API}/turnos`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
    const data = await res.json();
    if (res.ok && data.length > 0) {
      contenedor.innerHTML = '';
      data.forEach(cita => {
        const card = document.createElement('div');
        card.className = 'cita-card';
        card.innerHTML = `<h3>👨‍⚕️ ${cita.medico}</h3><p>📅 ${cita.fecha}</p><p>🕐 ${cita.hora}</p>
          <button onclick="cancelarCita(${cita.id})" class="btn-cancelar">Cancelar cita</button>`;
        contenedor.appendChild(card);
      });
    } else { contenedor.innerHTML = '<p>No tienes citas agendadas.</p>'; }
  } catch { contenedor.innerHTML = '<p style="color:red">Error al cargar citas.</p>'; }
}

async function cancelarCita(id) {
  if (!confirm('¿Seguro que quieres cancelar esta cita?')) return;
  try {
    const res = await fetch(`${API}/turnos/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${getToken()}` } });
    if (res.ok) { alert('Cita cancelada correctamente.'); cargarCitas(); }
    else { alert('Error al cancelar la cita.'); }
  } catch { alert('No se pudo conectar con el servidor.'); }
}

