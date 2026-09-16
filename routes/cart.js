const express = require('express');
const router = express.Router();

// In-memory cart storage (in production, use database/session)
let cart = [];

// Get cart
router.get('/', (req, res) => {
  res.json(cart);
});

// Add to cart
router.post('/add', (req, res) => {
  const { productId, name, price, quantity, image } = req.body;
  
  const existingItem = cart.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, name, price, quantity, image });
  }
  
  res.json({ message: 'Item added to cart', cart });
});

// Remove from cart
router.post('/remove', (req, res) => {
  cart = cart.filter(item => item.productId !== req.body.productId);
  res.json({ message: 'Item removed from cart', cart });
});

// Clear cart
router.post('/clear', (req, res) => {
  cart = [];
  res.json({ message: 'Cart cleared' });
});

module.exports = router;
