jest.mock('bcryptjs', () => ({
  hash: jest.fn(() => Promise.resolve('hashed')),
  compare: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('@prisma/client', () => {
  const prisma = {
    user: { findUnique: jest.fn(), create: jest.fn() },
    product: { findMany: jest.fn(), count: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
    category: { findMany: jest.fn(), create: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
    cartItem: { findMany: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn(), deleteMany: jest.fn() },
  };
  return { PrismaClient: jest.fn(() => prisma), prisma };
});

const bcrypt = require('bcryptjs');
const { prisma: mockPrisma } = require('@prisma/client');
const { register, login, getProfile } = require('../../src/controllers/authController');

function mockRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

beforeEach(() => {
  jest.clearAllMocks();
  bcrypt.compare.mockResolvedValue(true);
});

describe('authController.register', () => {
  it('returns 400 when required fields are missing', async () => {
    const res = mockRes();
    await register({ body: { email: 'a@b.com' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 409 when the email is already registered', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 1, email: 'a@b.com' });
    const res = mockRes();
    await register({ body: { name: 'A', email: 'a@b.com', password: 'pw' } }, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('hashes the password and returns a JWT on success', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({ id: 1, name: 'A', email: 'a@b.com', role: 'customer' });
    const res = mockRes();
    await register({ body: { name: 'A', email: 'a@b.com', password: 'pw' } }, res);
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: { name: 'A', email: 'a@b.com', password: expect.any(String) },
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: expect.any(String), user: expect.any(Object) })
    );
  });
});

describe('authController.login', () => {
  it('returns 400 when credentials are missing', async () => {
    const res = mockRes();
    await login({ body: { email: 'a@b.com' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 401 for an unknown user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    const res = mockRes();
    await login({ body: { email: 'a@b.com', password: 'pw' } }, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 401 for a wrong password', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 1, password: 'hashed' });
    bcrypt.compare.mockResolvedValue(false);
    const res = mockRes();
    await login({ body: { email: 'a@b.com', password: 'pw' } }, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns a token for valid credentials', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 1, name: 'A', email: 'a@b.com', role: 'customer', password: 'hashed' });
    const res = mockRes();
    await login({ body: { email: 'a@b.com', password: 'pw' } }, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: expect.any(String), user: expect.any(Object) }));
  });
});

describe('authController.getProfile', () => {
  it('returns the authenticated user profile', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 1, name: 'A', email: 'a@b.com', role: 'customer', createdAt: new Date() });
    const res = mockRes();
    await getProfile({ user: { id: 1 } }, res);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, select: expect.any(Object) });
    expect(res.json).toHaveBeenCalledWith({ user: expect.objectContaining({ email: 'a@b.com' }) });
  });
});
