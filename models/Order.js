const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  products: [
    {
      _id: String,
      name: String,
      price: Number,
      image: String,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'processing', 'shipped', 'delivered'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
