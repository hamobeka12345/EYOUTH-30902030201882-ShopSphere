const prisma = require('../utils/prismaClient');

exports.getCategories = async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } }
  });
  res.json({ items: categories });
};

exports.getCategoryById = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Invalid category id.' });
  }
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } }
  });
  if (!category) {
    return res.status(404).json({ message: 'Category not found.' });
  }
  res.json({ category });
};

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Category name is required.' });
  }
  try {
    const category = await prisma.category.create({ data: { name: name.trim() } });
    res.status(201).json({ category });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'A category with this name already exists.' });
    }
    throw error;
  }
};

exports.updateCategory = async (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Invalid category id.' });
  }
  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Category name is required.' });
  }
  try {
    const category = await prisma.category.update({ where: { id }, data: { name: name.trim() } });
    res.json({ category });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'A category with this name already exists.' });
    }
    res.status(404).json({ message: 'Category not found.' });
  }
};

exports.deleteCategory = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Invalid category id.' });
  }
  try {
    await prisma.category.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(409).json({ message: 'Cannot delete category that has products.' });
    }
    res.status(404).json({ message: 'Category not found.' });
  }
};
