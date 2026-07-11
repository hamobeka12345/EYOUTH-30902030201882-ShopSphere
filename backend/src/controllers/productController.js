const prisma = require('../utils/prismaClient');

exports.getProducts = async (req, res) => {
  const { search, category, sort, page = 1, limit = 12 } = req.query;
  const filters = [];

  if (search) {
    filters.push({
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    });
  }

  if (category) {
    filters.push({ category: { name: category } });
  }

  const orderBy = [];
  if (sort === 'priceAsc') orderBy.push({ price: 'asc' });
  else if (sort === 'priceDesc') orderBy.push({ price: 'desc' });
  else orderBy.push({ createdAt: 'desc' });

  const pageNumber = Number(page);
  const pageSize = Number(limit);
  const where = filters.length ? { AND: filters } : {};

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      include: { category: true }
    })
  ]);

  res.json({ items: products, total, page: pageNumber, limit: pageSize });
};

exports.getProductById = async (req, res) => {
  const id = Number(req.params.id);
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  });
  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }
  res.json({ product });
};

exports.createProduct = async (req, res) => {
  const { name, description, price, categoryId, image } = req.body;
  const product = await prisma.product.create({
    data: { name, description, price: Number(price), image, categoryId: categoryId ? Number(categoryId) : undefined }
  });
  res.status(201).json({ product });
};

exports.updateProduct = async (req, res) => {
  const id = Number(req.params.id);
  const { name, description, price, categoryId, image } = req.body;
  const product = await prisma.product.update({
    where: { id },
    data: { name, description, price: Number(price), image, categoryId: categoryId ? Number(categoryId) : undefined }
  });
  res.json({ product });
};

exports.deleteProduct = async (req, res) => {
  const id = Number(req.params.id);
  await prisma.product.delete({ where: { id } });
  res.status(204).end();
};
