import React, { useState, useEffect } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    // Store in localStorage or send to cart context
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="container">
      <header className="header">
        <h1>👕 Clothing Store</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/cart">Cart</a>
          <a href="/login">Login</a>
        </nav>
      </header>

      <main className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="price">${product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </main>

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

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .product-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .product-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          background: #ddd;
        }

        .product-card h3 {
          padding: 15px 15px 5px;
          font-size: 18px;
        }

        .product-card p {
          padding: 0 15px;
          color: #666;
          font-size: 14px;
        }

        .price {
          font-size: 20px !important;
          font-weight: bold;
          color: #e74c3c !important;
          padding-top: 10px !important;
        }

        button {
          width: 90%;
          margin: 15px 5%;
          padding: 10px;
          background-color: #e74c3c;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s;
        }

        button:hover {
          background-color: #c0392b;
        }

        .loading {
          text-align: center;
          font-size: 18px;
          padding: 40px;
        }
      `}</style>
    </div>
  );
}
