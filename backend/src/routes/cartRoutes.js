const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, cartController.getCart);
router.post('/items', authenticate, cartController.addToCart);
router.put('/items/:id', authenticate, cartController.updateCartItem);
router.delete('/items/:id', authenticate, cartController.removeCartItem);
router.delete('/', authenticate, cartController.clearCart);

module.exports = router;
