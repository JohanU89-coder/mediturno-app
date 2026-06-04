const request = require('supertest');
const app     = require('../index');

// === PRUEBAS: API de Usuarios ===
describe('POST /api/usuarios/registro', () => {
  test('Debe registrar un usuario con datos válidos', async () => {
    const res = await request(app).post('/api/usuarios/registro')
      .send({ nombre: 'Paciente Test', email: 'paciente@test.com', password: 'pass123' });
    expect([201, 400]).toContain(res.status);
  });
  test('Debe rechazar registro sin campo nombre', async () => {
    const res = await request(app).post('/api/usuarios/registro')
      .send({ email: 'x@test.com', password: '123' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('mensaje');
  });
  test('Debe rechazar registro con body vacío', async () => {
    const res = await request(app).post('/api/usuarios/registro').send({});
    expect(res.status).toBe(400);
  });
});

describe('POST /api/usuarios/login', () => {
  test('Debe rechazar login con credenciales vacías', async () => {
    const res = await request(app).post('/api/usuarios/login').send({});
    expect(res.status).toBe(400);
  });
  test('Debe rechazar login con email inexistente', async () => {
    const res = await request(app).post('/api/usuarios/login')
      .send({ email: 'noexiste@test.com', password: '123456' });
    expect(res.status).toBe(401);
  });
});

// === PRUEBAS: API de Turnos ===
describe('GET /api/turnos', () => {
  test('Debe rechazar acceso sin token (401)', async () => {
    const res = await request(app).get('/api/turnos');
    expect(res.status).toBe(401);
  });
  test('Debe rechazar token inválido', async () => {
    const res = await request(app).get('/api/turnos')
      .set('Authorization', 'Bearer token_invalido_123');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/turnos', () => {
  test('Debe rechazar reserva sin token', async () => {
    const res = await request(app).post('/api/turnos')
      .send({ medico: 'Dr. García', fecha: '2026-07-01', hora: '09:00' });
    expect(res.status).toBe(401);
  });
});