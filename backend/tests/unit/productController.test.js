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
const controller = require('../../src/controllers/productController');

function mockRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

afterEach(() => jest.restoreAllMocks());
beforeEach(() => jest.clearAllMocks());

describe('productController.getProducts', () => {
  it('builds filters, ordering and pagination and returns the shaped response', async () => {
    const items = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
    mockPrisma.product.count.mockResolvedValue(20);
    mockPrisma.product.findMany.mockResolvedValue(items);

    const res = mockRes();
    await controller.getProducts(
      { query: { search: 'head', category: 'Books', sort: 'priceAsc', page: '2', limit: '8' } },
      res
    );

    expect(mockPrisma.product.count).toHaveBeenCalledWith({ where: expect.any(Object) });
    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.any(Object),
        orderBy: [{ price: 'asc' }],
        skip: 8,
        take: 8,
        include: { category: true },
      })
    );
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ items, total: 20, page: 2, limit: 8, totalPages: 3 })
    );
  });

  it('defaults to page 1 and limit 12 when not provided', async () => {
    mockPrisma.product.count.mockResolvedValue(5);
    mockPrisma.product.findMany.mockResolvedValue([]);
    const res = mockRes();
    await controller.getProducts({ query: {} }, res);
    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 12, orderBy: [{ createdAt: 'desc' }] })
    );
  });
});

describe('productController.createProduct', () => {
  it('returns 400 when name or price is missing', async () => {
    const res = mockRes();
    await controller.createProduct({ body: { description: 'x' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('creates the product and returns 201', async () => {
    mockPrisma.product.create.mockResolvedValue({ id: 99, name: 'New' });
    const res = mockRes();
    await controller.createProduct({ body: { name: 'New', price: '19.99', categoryId: '2' } }, res);
    expect(mockPrisma.product.create).toHaveBeenCalledWith({
      data: { name: 'New', price: 19.99, categoryId: 2, image: null, description: undefined },
      include: { category: true },
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe('productController.getProductById', () => {
  it('returns 400 for a non-integer id', async () => {
    const res = mockRes();
    await controller.getProductById({ params: { id: 'abc' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 404 when the product is missing', async () => {
    mockPrisma.product.findUnique.mockResolvedValue(null);
    const res = mockRes();
    await controller.getProductById({ params: { id: '5' } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
