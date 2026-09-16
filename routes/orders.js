const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Create order
router.post('/', async (req, res) => {
  const order = new Order({
    userId: req.body.userId,
    products: req.body.products,
    totalPrice: req.body.totalPrice,
    address: req.body.address,
  });

  try {
    const newOrder = await order.save();
    res.status(201).json({
      message: 'Order placed successfully',
      orderId: newOrder._id,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all orders for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
