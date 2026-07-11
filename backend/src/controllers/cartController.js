const prisma = require('../utils/prismaClient');

async function getCartItems(userId) {
  return prisma.cartItem.findMany({
    where: { userId },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: 'desc' }
  });
}

exports.getCart = async (req, res) => {
  const items = await getCartItems(req.user.id);
  const total = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
  res.json({ items, total, count: items.reduce((sum, item) => sum + item.quantity, 0) });
};

exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const pid = Number(productId);
  const qty = Math.max(1, Number(quantity) || 1);

  if (!Number.isInteger(pid)) {
    return res.status(400).json({ message: 'Valid productId is required.' });
  }

  const product = await prisma.product.findUnique({ where: { id: pid } });
  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  const existing = await prisma.cartItem.findFirst({ where: { userId: req.user.id, productId: pid } });
  let item;
  if (existing) {
    item = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + qty }
    });
  } else {
    item = await prisma.cartItem.create({
      data: { userId: req.user.id, productId: pid, quantity: qty }
    });
  }
  const items = await getCartItems(req.user.id);
  res.status(201).json({ item, items });
};

exports.updateCartItem = async (req, res) => {
  const id = Number(req.params.id);
  const { quantity } = req.body;
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Invalid cart item id.' });
  }
  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1) {
    return res.status(400).json({ message: 'Quantity must be a positive integer.' });
  }
  try {
    await prisma.cartItem.update({ where: { id }, data: { quantity: qty } });
    const items = await getCartItems(req.user.id);
    res.json({ items });
  } catch (error) {
    res.status(404).json({ message: 'Cart item not found.' });
  }
};

exports.removeCartItem = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Invalid cart item id.' });
  }
  try {
    await prisma.cartItem.delete({ where: { id } });
    const items = await getCartItems(req.user.id);
    res.json({ items });
  } catch (error) {
    res.status(404).json({ message: 'Cart item not found.' });
  }
};

exports.clearCart = async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
  res.json({ items: [], total: 0, count: 0 });
};
