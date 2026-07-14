const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('../../src/index');

const prisma = new PrismaClient();
const ADMIN = { email: 'admin@example.com', password: 'admin123' };

let adminToken;
let customerToken;
let createdId;

beforeAll(async () => {
  const admin = await request(app).post('/api/auth/login').send(ADMIN);
  adminToken = admin.body.token;

  const email = `cust-${Date.now()}@example.com`;
  await request(app)
    .post('/api/auth/register')
    .send({ name: 'Customer', email, password: 'Password123' });
  const cust = await request(app).post('/api/auth/login').send({ email, password: 'Password123' });
  customerToken = cust.body.token;
});

afterAll(async () => {
  if (createdId) await prisma.product.deleteMany({ where: { id: createdId } }).catch(() => {});
  await prisma.$disconnect();
});

describe('Products API (integration)', () => {
  it('lists products with total and pagination metadata', async () => {
    const res = await request(app).get('/api/products?limit=5&page=1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('totalPages');
    expect(res.body.limit).toBe(5);
  });

  it('returns a single product by id', async () => {
    const list = await request(app).get('/api/products?limit=1');
    const id = list.body.items[0].id;
    const res = await request(app).get(`/api/products/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.product.id).toBe(id);
  });

  it('returns 401 for product creation without a token', async () => {
    const res = await request(app).post('/api/products').send({ name: 'X', price: 1 });
    expect(res.status).toBe(401);
  });

  it('returns 403 when a non-admin customer tries to create a product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ name: 'X', price: 1 });
    expect(res.status).toBe(403);
  });

  it('allows an admin to create and returns 201', async () => {
    const category = await prisma.category.findFirst();
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('name', 'Integration Test Product')
      .field('price', '42.5')
      .field('categoryId', String(category.id));
    expect(res.status).toBe(201);
    expect(res.body.product.name).toBe('Integration Test Product');
    createdId = res.body.product.id;
  });

  it('deletes the created product (204)', async () => {
    const res = await request(app)
      .delete(`/api/products/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(204);
    createdId = null;
  });
});
