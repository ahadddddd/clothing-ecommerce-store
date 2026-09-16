const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  totalPrice: Number,
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'paid', 'shipped', 'delivered'],
  },
  paymentId: String,
  address: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
