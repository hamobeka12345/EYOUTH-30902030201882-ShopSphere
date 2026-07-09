const prisma = require('../prisma');

const getProducts = async (req, res) => {
  const { page = 1, limit = 12, search = '', category } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filters = {
    where: {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        category ? { category: { name: category } } : {},
      ],
    },
    include: { category: true },
    skip,
    take: Number(limit),
    orderBy: { createdAt: 'desc' },
  };

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany(filters),
      prisma.product.count({ where: filters.where }),
    ]);
    return res.json({ products, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to load products' });
  }
};

const getProduct = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json({ product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to load product' });
  }
};

const createProduct = async (req, res) => {
  const { name, description, price, categoryId, image } = req.body;

  if (!name || price == null) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        image,
        category: categoryId ? { connect: { id: Number(categoryId) } } : undefined,
      },
      include: { category: true },
    });
    return res.status(201).json({ product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create product' });
  }
};

const updateProduct = async (req, res) => {
  const id = Number(req.params.id);
  const { name, description, price, categoryId, image } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: price != null ? Number(price) : undefined,
        image,
        category: categoryId ? { connect: { id: Number(categoryId) } } : undefined,
      },
      include: { category: true },
    });
    return res.json({ product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update product' });
  }
};

const deleteProduct = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.product.delete({ where: { id } });
    return res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete product' });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
