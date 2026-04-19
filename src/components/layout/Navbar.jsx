import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Menu, X, Leaf, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/#products' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled glass' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="logo-group">
          <div className="logo-icon">
            <img src="/logo.png" alt="Natural Organics Logo" className="nav-logo-img" />
          </div>
          <span className="logo-text">Natural<span className="text-secondary">Organics</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="desktop-menu">
          {navLinks.map(link => (
            <a key={link.name} href={link.path} className="nav-link">
              {link.name}
            </a>
          ))}
        </div>

        <div className="auth-group">
          <button className="cart-nav-btn" onClick={() => setIsCartOpen(true)} title="View Cart">
            <ShoppingCart size={20} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
          <button className="mobile-menu-btn hide-desktop" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu glass">
          {navLinks.map(link => (
            <a 
              key={link.name} 
              href={link.path} 
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          transition: var(--transition-normal);
          padding: var(--space-md) 0;
        }
        .navbar.scrolled {
          padding: var(--space-sm) 0;
          box-shadow: var(--shadow-sm);
        }
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo-group {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }
        .logo-icon {
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          display: flex;
        }
        .bg-primary { background-color: var(--primary); }
        .logo-text {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary);
        }
        .text-secondary { color: var(--secondary); }
        .desktop-menu {
          display: none;
          gap: var(--space-lg);
        }
        @media (min-width: 768px) {
          .desktop-menu { display: flex; }
          .hide-desktop { display: none; }
        }
        .nav-link {
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          font-size: 0.875rem;
          letter-spacing: 0.05em;
          transition: var(--transition-normal);
        }
        .nav-link:hover { color: var(--primary); }
        .auth-group { display: flex; align-items: center; gap: var(--space-sm); }
        .admin-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--primary);
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          transition: var(--transition-normal);
        }
        .admin-link:hover { background-color: rgba(30, 58, 26, 0.05); }
        .cart-nav-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px; height: 40px;
          border-radius: 50%;
          color: var(--primary);
          transition: 0.2s;
        }
        .cart-nav-btn:hover { background: rgba(30,58,26,0.08); }
        .cart-badge {
          position: absolute;
          top: -2px; right: -2px;
          background: var(--secondary);
          color: white;
          font-size: 0.65rem;
          font-weight: 800;
          width: 18px; height: 18px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .nav-logo-img {
          width: 56px; height: 56px; object-fit: contain; border-radius: 4px;
        }
        @media (max-width: 640px) {
          .logo-text { font-size: 1.15rem; }
          .nav-logo-img { width: 36px; height: 36px; }
          .logo-group { gap: 0.25rem; }
          .auth-group { gap: 0; }
          .hide-mobile { display: none; }
        }
        @media (max-width: 767px) { .hide-mobile { display: none; } }
        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          padding: var(--space-md);
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }
        .mobile-nav-link {
          padding: var(--space-sm);
          font-weight: 700;
          color: var(--primary);
          border-radius: var(--radius-sm);
        }
        .mobile-nav-link:hover { background-color: rgba(30, 58, 26, 0.05); }
      `}</style>
    </nav>
  );
};

export default Navbar;
