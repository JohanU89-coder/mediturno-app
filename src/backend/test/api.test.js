process.env.JWT_SECRET = 'secreto-exclusivo-para-pruebas';

const request = require('supertest');
const app = require('../index');

function crearEmailUnico() {
  return `paciente-${Date.now()}-${Math.random().toString(16).slice(2)}@test.com`;
}

async function registrarUsuario(datos = {}) {
  const usuario = {
    nombre: 'Paciente Test',
    email: crearEmailUnico(),
    password: 'pass123',
    ...datos
  };

  const response = await request(app)
    .post('/api/usuarios/registro')
    .send(usuario);

  return { usuario, response };
}

async function registrarYAutenticar() {
  const { usuario } = await registrarUsuario();

  const login = await request(app)
    .post('/api/usuarios/login')
    .send({
      email: usuario.email,
      password: usuario.password
    });

  return {
    usuario,
    token: login.body.token
  };
}

describe('Health check', () => {
  test('responde estado operativo', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      app: 'MediTurno',
      message: 'Servidor MediTurno funcionando correctamente'
    });
  });

  test('sirve el frontend desde la raiz', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
    expect(response.text).toContain('<');
    expect(response.body).toEqual({});
  });
});

describe('API de usuarios', () => {
  test('registra un usuario con datos validos', async () => {
    const { usuario, response } = await registrarUsuario();

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      mensaje: 'Usuario registrado correctamente',
      usuario: {
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
    expect(response.body.usuario).toHaveProperty('id');
    expect(response.body.usuario).not.toHaveProperty('password');
  });

  test('rechaza registro con campos faltantes', async () => {
    const response = await request(app)
      .post('/api/usuarios/registro')
      .send({
        email: crearEmailUnico(),
        password: 'pass123'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('mensaje', 'Todos los campos son obligatorios: nombre, email, password');
  });

  test('rechaza registro con cuerpo vacio', async () => {
    const response = await request(app)
      .post('/api/usuarios/registro')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('mensaje', 'Todos los campos son obligatorios: nombre, email, password');
  });

  test('inicia sesion con credenciales validas', async () => {
    const { usuario } = await registrarUsuario();

    const response = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: usuario.email,
        password: usuario.password
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      mensaje: 'Login exitoso',
      usuario: {
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
    expect(response.body).toHaveProperty('token');
    expect(response.body.usuario).toHaveProperty('id');
    expect(response.body.usuario).not.toHaveProperty('password');
  });

  test('rechaza credenciales incorrectas', async () => {
    const { usuario } = await registrarUsuario();

    const response = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: usuario.email,
        password: 'password-incorrecto'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('mensaje', 'Credenciales incorrectas');
  });

  test('no devuelve contrasena en respuestas de registro ni login', async () => {
    const { usuario, response: registro } = await registrarUsuario();

    const login = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: usuario.email,
        password: usuario.password
      });

    expect(registro.body.usuario).not.toHaveProperty('password');
    expect(login.body.usuario).not.toHaveProperty('password');
  });
});

describe('API de turnos', () => {
  test('rechaza consulta sin token', async () => {
    const response = await request(app).get('/api/turnos');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('mensaje', 'Token requerido');
  });

  test('rechaza consulta con token invalido', async () => {
    const response = await request(app)
      .get('/api/turnos')
      .set('Authorization', 'Bearer token_invalido_123');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('mensaje', 'Token invalido o expirado');
  });

  test('crea un turno con token valido', async () => {
    const { token } = await registrarYAutenticar();

    const response = await request(app)
      .post('/api/turnos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        medico: 'Dr. Garcia',
        fecha: '2026-07-01',
        hora: '09:00'
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      mensaje: 'Cita reservada',
      cita: {
        medico: 'Dr. Garcia',
        fecha: '2026-07-01',
        hora: '09:00'
      }
    });
    expect(response.body.cita).toHaveProperty('id');
    expect(response.body.cita).toHaveProperty('usuarioId');
  });

  test('consulta turnos del usuario autenticado', async () => {
    const { token } = await registrarYAutenticar();

    const turno = await request(app)
      .post('/api/turnos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        medico: 'Dra. Campos',
        fecha: '2026-08-10',
        hora: '11:30'
      });

    const response = await request(app)
      .get('/api/turnos')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: turno.body.cita.id,
        medico: 'Dra. Campos',
        fecha: '2026-08-10',
        hora: '11:30'
      })
    ]));
  });

  test('cancela un turno existente', async () => {
    const { token } = await registrarYAutenticar();

    const turno = await request(app)
      .post('/api/turnos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        medico: 'Dr. Perez',
        fecha: '2026-09-05',
        hora: '15:00'
      });

    const response = await request(app)
      .delete(`/api/turnos/${turno.body.cita.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('mensaje', 'Cita cancelada correctamente');
  });

  test('responde correctamente al cancelar un turno inexistente', async () => {
    const { token } = await registrarYAutenticar();

    const response = await request(app)
      .delete('/api/turnos/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('mensaje', 'Cita no encontrada');
  });

  test('valida campos obligatorios al crear un turno', async () => {
    const { token } = await registrarYAutenticar();

    const response = await request(app)
      .post('/api/turnos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        medico: 'Dr. Garcia',
        fecha: '2026-07-01'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('mensaje', 'Campos obligatorios: medico, fecha, hora');
  });
});
