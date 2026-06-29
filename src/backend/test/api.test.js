const request = require('supertest');
const app = require('../server');

describe('Health check API', () => {
  test('should return health status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Server is running');
  });
});

describe('User Authentication API', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
    name: 'Test User'
  };

  test('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send(testUser);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Usuario registrado exitosamente');
    expect(res.body.user).toHaveProperty('email', testUser.email);
    expect(res.body.user).toHaveProperty('name', testUser.name);
  });

  test('should fail to register if email is already taken', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send(testUser);
    
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('error', 'El email ya está registrado');
  });

  test('should login successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Login exitoso');
    expect(res.body.user).toHaveProperty('email', testUser.email);
  });

  test('should fail to login with incorrect credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error', 'Credenciales inválidas');
  });
});
