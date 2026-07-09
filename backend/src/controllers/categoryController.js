const prisma = require('../prisma');

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { products: true },
      orderBy: { name: 'asc' },
    });
    return res.json({ categories });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to load categories' });
  }
};

const getCategory = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.json({ category });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to load category' });
  }
};

const createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  try {
    const category = await prisma.category.create({ data: { name } });
    return res.status(201).json({ category });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create category' });
  }
};

const updateCategory = async (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });
    return res.json({ category });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update category' });
  }
};

const deleteCategory = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.category.delete({ where: { id } });
    return res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete category' });
  }
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
