const prisma = require('../prisma');

const getCart = async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });
    return res.json({ cartItems });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to load cart items' });
  }
};

const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  try {
    const existing = await prisma.cartItem.findFirst({
      where: { userId: req.user.id, productId: Number(productId) },
    });

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + Number(quantity) },
        include: { product: true },
      });
      return res.json({ cartItem: updated });
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        user: { connect: { id: req.user.id } },
        product: { connect: { id: Number(productId) } },
        quantity: Number(quantity),
      },
      include: { product: true },
    });
    return res.status(201).json({ cartItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to add item to cart' });
  }
};

const updateCartItem = async (req, res) => {
  const id = Number(req.params.id);
  const { quantity } = req.body;
  if (quantity == null) {
    return res.status(400).json({ message: 'Quantity is required' });
  }

  try {
    const cartItem = await prisma.cartItem.updateMany({
      where: { id, userId: req.user.id },
      data: { quantity: Number(quantity) },
    });
    if (cartItem.count === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    const updated = await prisma.cartItem.findUnique({
      where: { id },
      include: { product: true },
    });
    return res.json({ cartItem: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update cart item' });
  }
};

const removeCartItem = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.cartItem.deleteMany({ where: { id, userId: req.user.id } });
    return res.json({ message: 'Cart item removed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to remove cart item' });
  }
};

const clearCart = async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
    return res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to clear cart' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
