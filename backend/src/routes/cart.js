const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cartController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, getCart);
router.post('/', requireAuth, addToCart);
router.put('/:id', requireAuth, updateCartItem);
router.delete('/:id', requireAuth, removeCartItem);
router.delete('/', requireAuth, clearCart);

module.exports = router;
