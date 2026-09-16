import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
    calculateTotal(savedCart);
  };

  const calculateTotal = (cartItems) => {
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
    const shipping = 10;
    const tax = subtotal * 0.1;
    setTotal(subtotal + shipping + tax);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.address || !formData.cardNumber) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      const userId = localStorage.getItem('userId') || 'guest';

      const orderData = {
        userId,
        products: cart,
        totalPrice: total,
        address: formData.address,
        paymentId: formData.cardNumber.slice(-4), // Mock payment ID
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        localStorage.removeItem('cart');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError(data.message || 'Payment failed');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container">
        <header className="header">
          <h1>✅ Order Successful</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/cart">Cart</a>
            <a href="/login">Login</a>
          </nav>
        </header>

        <div className="success-message">
          <h2>Thank you for your order!</h2>
          <p>Your order has been placed successfully.</p>
          <p>You will be redirected to home in a moment...</p>
        </div>

        <style jsx>{`
          .success-message {
            text-align: center;
            padding: 60px 20px;
            background: white;
            border-radius: 8px;
            margin-top: 30px;
          }

          .success-message h2 {
            color: #27ae60;
            margin-bottom: 15px;
          }

          .success-message p {
            font-size: 16px;
            color: #666;
            margin-bottom: 10px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>💳 Checkout</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/cart">Cart</a>
          <a href="/login">Login</a>
        </nav>
      </header>

      <div className="checkout-content">
        <div className="checkout-form">
          <h2>Shipping & Payment Information</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="section">
              <h3>Shipping Details</h3>

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Delivery Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="123 Main St, City, State 12345"
                  rows="3"
                />
              </div>
            </div>

            <div className="section">
              <h3>Payment Information</h3>

              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  required
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                    placeholder="MM/YY"
                    maxLength="5"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    required
                    placeholder="123"
                    maxLength="3"
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="place-order-btn">
              {loading ? 'Processing Payment...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>

          <div className="summary-items">
            {cart.map((item, index) => (
              <div key={index} className="summary-item">
                <span>{item.name}</span>
                <span>${item.price}</span>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${cart.reduce((acc, item) => acc + (item.price || 0), 0).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>$10.00</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>${(cart.reduce((acc, item) => acc + (item.price || 0), 0) * 0.1).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Arial', sans-serif;
          background-color: #f5f5f5;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .header {
          background-color: #333;
          color: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header h1 {
          font-size: 28px;
        }

        nav a {
          color: white;
          margin: 0 15px;
          text-decoration: none;
          font-weight: bold;
        }

        nav a:hover {
          text-decoration: underline;
        }

        .checkout-content {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 20px;
        }

        .checkout-form {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .checkout-form h2 {
          margin-bottom: 30px;
          font-size: 22px;
          color: #333;
        }

        .error-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
          border: 1px solid #f5c6cb;
        }

        .section {
          margin-bottom: 30px;
        }

        .section h3 {
          margin-bottom: 15px;
          font-size: 18px;
          color: #333;
          border-bottom: 2px solid #e74c3c;
          padding-bottom: 10px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
          color: #333;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          font-family: Arial, sans-serif;
          transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #e74c3c;
          box-shadow: 0 0 5px rgba(231, 76, 60, 0.3);
        }

        .place-order-btn {
          width: 100%;
          padding: 15px;
          background-color: #27ae60;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s;
          margin-top: 20px;
        }

        .place-order-btn:hover:not(:disabled) {
          background-color: #229954;
        }

        .place-order-btn:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }

        .order-summary {
          background: white;
          padding: 20px;
          border-radius: 8px;
          height: fit-content;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 20px;
        }

        .order-summary h2 {
          margin-bottom: 20px;
          font-size: 18px;
          color: #333;
        }

        .summary-items {
          max-height: 300px;
          overflow-y: auto;
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
          padding-bottom: 15px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .summary-totals {
          border-top: 1px solid #eee;
          padding-top: 15px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
          color: #666;
        }

        .summary-row.total {
          font-size: 18px;
          font-weight: bold;
          color: #e74c3c;
          border-top: 2px solid #eee;
          padding-top: 10px;
          margin-top: 10px;
        }

        @media (max-width: 768px) {
          .checkout-content {
            grid-template-columns: 1fr;
          }

          .order-summary {
            position: static;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .header {
            flex-direction: column;
            gap: 15px;
          }

          nav {
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
          }

          nav a {
            margin: 0 5px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
