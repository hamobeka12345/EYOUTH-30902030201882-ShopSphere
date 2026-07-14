const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('../../src/index');

const prisma = new PrismaClient();
const unique = `it-${Date.now()}-${Math.floor(Math.random() * 1000)}@example.com`;

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { contains: 'it-' } } });
  await prisma.$disconnect();
});

describe('Auth API (integration)', () => {
  it('registers a new user and returns a token (201)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Tester', email: unique, password: 'Password123' });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(unique);
  });

  it('rejects duplicate registration (409)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Tester', email: unique, password: 'Password123' });
    expect(res.status).toBe(409);
  });

  it('logs the user in and returns a token (200)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: unique, password: 'Password123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('returns 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: unique, password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('protects the profile route without a token (401)', async () => {
    const res = await request(app).get('/api/auth/profile');
    expect(res.status).toBe(401);
  });

  it('returns the profile with a valid token (200)', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: unique, password: 'Password123' });
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${login.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(unique);
  });
});
