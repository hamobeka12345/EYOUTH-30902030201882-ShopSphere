jest.mock('@prisma/client', () => {
  const prisma = {
    user: { findUnique: jest.fn(), create: jest.fn() },
    product: { findMany: jest.fn(), count: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
    category: { findMany: jest.fn(), create: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
    cartItem: { findMany: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn(), deleteMany: jest.fn() },
  };
  return { PrismaClient: jest.fn(() => prisma), prisma };
});

const { prisma: mockPrisma } = require('@prisma/client');
const controller = require('../../src/controllers/cartController');

function mockRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

afterEach(() => jest.restoreAllMocks());
beforeEach(() => jest.clearAllMocks());

const cartItems = [
  { id: 1, quantity: 2, product: { id: 10, price: 5, name: 'A', category: { name: 'Books' } } },
];

describe('cartController.getCart', () => {
  it('computes the total from item quantities and prices', async () => {
    mockPrisma.cartItem.findMany.mockResolvedValue(cartItems);
    const res = mockRes();
    await controller.getCart({ user: { id: 1 } }, res);
    expect(mockPrisma.cartItem.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 1 }, include: { product: { include: { category: true } } } })
    );
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ total: 10, count: 2 }));
  });
});

describe('cartController.addToCart', () => {
  it('returns 400 when productId is missing or invalid', async () => {
    const res = mockRes();
    await controller.addToCart({ user: { id: 1 }, body: { quantity: 1 } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 404 when the product does not exist', async () => {
    mockPrisma.product.findUnique.mockResolvedValue(null);
    const res = mockRes();
    await controller.addToCart({ user: { id: 1 }, body: { productId: 999 } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('creates a cart item and returns 201 on success', async () => {
    mockPrisma.product.findUnique.mockResolvedValue({ id: 10, price: 5 });
    mockPrisma.cartItem.findFirst.mockResolvedValue(null);
    mockPrisma.cartItem.create.mockResolvedValue({ id: 1, quantity: 1 });
    mockPrisma.cartItem.findMany.mockResolvedValue(cartItems);
    const res = mockRes();
    await controller.addToCart({ user: { id: 1 }, body: { productId: 10, quantity: 2 } }, res);
    expect(mockPrisma.cartItem.create).toHaveBeenCalledWith({
      data: { userId: 1, productId: 10, quantity: 2 },
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe('cartController.updateCartItem', () => {
  it('returns 400 for a non-integer id', async () => {
    const res = mockRes();
    await controller.updateCartItem({ params: { id: 'x' }, body: { quantity: 3 }, user: { id: 1 } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when quantity is not a positive integer', async () => {
    const res = mockRes();
    await controller.updateCartItem({ params: { id: '1' }, body: { quantity: 0 }, user: { id: 1 } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
