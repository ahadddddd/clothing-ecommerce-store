import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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
      const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user info to localStorage
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userRole', data.role || 'user');
        alert(data.message || 'Success!');
        router.push('/');
      } else {
        setError(data.message || 'An error occurred');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🔐 Account</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/cart">Cart</a>
          <a href="/login">Login</a>
        </nav>
      </header>

      <div className="auth-container">
        <div className="auth-form">
          <h2>{isLogin ? 'Login' : 'Register'}</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="John Doe"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          <p className="toggle-auth">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="toggle-btn"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
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

        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
        }

        .auth-form {
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        .auth-form h2 {
          margin-bottom: 30px;
          text-align: center;
          font-size: 24px;
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

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
          color: #333;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          transition: border-color 0.3s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #e74c3c;
          box-shadow: 0 0 5px rgba(231, 76, 60, 0.3);
        }

        .submit-btn {
          width: 100%;
          padding: 12px;
          background-color: #e74c3c;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .submit-btn:hover:not(:disabled) {
          background-color: #c0392b;
        }

        .submit-btn:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }

        .toggle-auth {
          text-align: center;
          margin-top: 20px;
          color: #666;
        }

        .toggle-btn {
          background: none;
          border: none;
          color: #e74c3c;
          cursor: pointer;
          font-weight: bold;
          text-decoration: underline;
          padding: 0;
          font-size: 16px;
        }

        .toggle-btn:hover {
          color: #c0392b;
        }

        @media (max-width: 768px) {
          .auth-form {
            padding: 30px 20px;
          }

          .header {
            flex-direction: column;
            gap: 15px;
          }

          nav {
            display: flex;
            gap: 10px;
            justify-content: center;
          }

          nav a {
            margin: 0 10px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
