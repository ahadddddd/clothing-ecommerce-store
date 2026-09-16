import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
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
    const sum = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
    setTotal(sum);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item, index) => index !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
    setTotal(0);
  };

  const checkout = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }
    router.push('/checkout');
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🛒 Shopping Cart</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/cart">Cart</a>
          <a href="/login">Login</a>
        </nav>
      </header>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <a href="/" className="btn">Continue Shopping</a>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p className="price">${item.price}</p>
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>$10.00</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>${(total * 0.1).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${(total + 10 + total * 0.1).toFixed(2)}</span>
            </div>

            <button className="checkout-btn" onClick={checkout}>
              Proceed to Checkout
            </button>
            <button className="clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Arial', sans-serif;
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

        .empty-cart {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 8px;
        }

        .empty-cart p {
          font-size: 18px;
          margin-bottom: 20px;
          color: #666;
        }

        .btn {
          display: inline-block;
          padding: 12px 30px;
          background-color: #e74c3c;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          transition: background-color 0.3s;
        }

        .btn:hover {
          background-color: #c0392b;
        }

        .cart-content {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 20px;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .cart-item {
          background: white;
          padding: 20px;
          border-radius: 8px;
          display: flex;
          gap: 20px;
          align-items: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .cart-item img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 4px;
          background: #ddd;
        }

        .item-details {
          flex: 1;
        }

        .item-details h3 {
          font-size: 18px;
          margin-bottom: 5px;
        }

        .item-details p {
          color: #666;
          font-size: 14px;
          margin-bottom: 5px;
        }

        .item-details .price {
          font-size: 18px;
          font-weight: bold;
          color: #e74c3c;
        }

        .remove-btn {
          padding: 8px 15px;
          background-color: #e74c3c;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s;
        }

        .remove-btn:hover {
          background-color: #c0392b;
        }

        .cart-summary {
          background: white;
          padding: 20px;
          border-radius: 8px;
          height: fit-content;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 20px;
        }

        .cart-summary h2 {
          margin-bottom: 20px;
          font-size: 20px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
          font-size: 14px;
        }

        .summary-row.total {
          font-size: 18px;
          font-weight: bold;
          border-bottom: none;
          padding-top: 15px;
          color: #e74c3c;
        }

        .checkout-btn {
          width: 100%;
          padding: 12px;
          margin-top: 20px;
          background-color: #27ae60;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }

        .checkout-btn:hover {
          background-color: #229954;
        }

        .clear-btn {
          width: 100%;
          padding: 10px;
          margin-top: 10px;
          background-color: #95a5a6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s;
        }

        .clear-btn:hover {
          background-color: #7f8c8d;
        }

        @media (max-width: 768px) {
          .cart-content {
            grid-template-columns: 1fr;
          }

          .cart-summary {
            position: static;
          }
        }
      `}</style>
    </div>
  );
}
