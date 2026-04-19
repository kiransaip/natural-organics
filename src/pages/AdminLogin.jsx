import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Lock, User } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple hardcoded check for demo purposes
    if ((username === 'mr.8' && password === 'bXIuOCs3NDI4Nw==')) {
      const token = btoa("mr.8:bXIuOCs3NDI4Nw==");
      localStorage.setItem('freshveg_admin_auth', token);
      navigate('/admin');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-page bg-mesh">
      <motion.div 
        className="login-container glass"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-header">
          <div className="icon-wrapper">
            <Lock size={32} color="var(--primary)" />
          </div>
          <h2>Admin Access</h2>
          <p>Sign in to manage your products</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="error-msg">{error}</div>}
          
          <div className="input-group">
            <label>Username</label>
            <div className="input-wrapper">
              <User size={20} className="input-icon" />
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="username"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn">
            Login to Dashboard
          </button>
        </form>
      </motion.div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-md);
        }
        .login-container {
          width: 100%;
          max-width: 440px;
          padding: var(--space-xl);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
        }
        .login-header {
          text-align: center;
          margin-bottom: var(--space-xl);
        }
        .icon-wrapper {
          width: 64px;
          height: 64px;
          background: rgba(30, 58, 26, 0.1);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto var(--space-md);
        }
        .login-header h2 {
          font-size: 2rem;
          color: var(--primary-dark);
          margin-bottom: 0.5rem;
        }
        .login-header p {
          color: var(--text-muted);
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        .error-msg {
          padding: var(--space-sm);
          background: #fee2e2;
          color: #dc2626;
          border-radius: var(--radius-sm);
          text-align: center;
          font-size: 0.875rem;
          font-weight: 600;
        }
        .input-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--primary-dark);
          margin-bottom: 0.5rem;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
        }
        .input-wrapper input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid rgba(0,0,0,0.05);
          border-radius: var(--radius-md);
          font-family: inherit;
          font-size: 1rem;
          transition: var(--transition-normal);
          background: white;
        }
        .input-wrapper input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(30, 58, 26, 0.1);
        }
        .login-btn {
          margin-top: var(--space-xs);
          padding: 1rem;
          background: var(--primary);
          color: white;
          font-weight: 800;
          font-size: 1rem;
          border-radius: var(--radius-md);
          width: 100%;
          transition: var(--transition-normal);
        }
        .login-btn:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
