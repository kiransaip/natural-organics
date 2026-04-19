import React, { useRef } from 'react';
import { Leaf, Phone, Mail, MapPin, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const clickCount = useRef(0);

  const handleSecretClick = () => {
    clickCount.current += 1;
    if (clickCount.current >= 3) {
      window.location.href = '/login';
    }
    setTimeout(() => { clickCount.current = 0; }, 3000);
  };

  return (
    <footer className="footer bg-primary-dark">
      <div className="container footer-grid">
        <div className="brand-col">
          <div className="logo">
            <img src="/logo.png" alt="Natural Organics Logo" style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: '4px' }} />
            <span className="logo-text">Natural<span className="text-secondary">Organics</span></span>
          </div>
          <p className="desc">Providing 100% natural, farm-fresh vegetables straight to your doorstep.</p>
          <div className="social-links" style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
            <a href="https://www.instagram.com/natural__organics" target="_blank" rel="noopener noreferrer" title="Instagram" style={{ color: 'var(--secondary)', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', transition: '0.2s' }}><Instagram size={20} /></a>
            <a href="#" title="YouTube" style={{ color: 'var(--secondary)', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', transition: '0.2s' }}><Youtube size={20} /></a>
          </div>
        </div>
        
        <div className="links-col">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="#products">Products</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
            <li><a href="/return">Return Order</a></li>
          </ul>
        </div>
        
        <div className="contact-col">
          <h3>Contact Us</h3>
          <ul>
            <li><Phone size={18} /> <span>+91 8074745490</span></li>
            <li><Mail size={18} /> <span>mrk74287@gmail.com</span></li>
            <li><MapPin size={18} /> <span>Andhra Pradesh</span></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p onClick={handleSecretClick} style={{ cursor: 'text' }}>&copy; {new Date().getFullYear()} Natural Organics. All rights reserved.</p>
      </div>

      <style>{`
        .footer {
          color: white;
          padding-top: var(--space-xl);
        }
        .bg-primary-dark { background-color: var(--primary-dark); }
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
        }
        @media (min-width: 768px) {
          .footer-grid { grid-template-columns: 2fr 1fr 1fr; }
        }
        .logo {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          margin-bottom: var(--space-sm);
        }
        .logo-text { font-size: 2rem; font-weight: 800; }
        .text-secondary { color: var(--secondary); }
        .desc { color: rgba(255,255,255,0.7); line-height: 1.6; }
        .links-col h3, .contact-col h3 {
          font-size: 1.25rem;
          margin-bottom: var(--space-sm);
          font-weight: 700;
        }
        ul { list-style: none; padding: 0; }
        li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          color: rgba(255,255,255,0.8);
        }
        li a:hover { color: var(--secondary); }
        .footer-bottom {
          padding: var(--space-md) 0;
          text-align: center;
          border-top: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5);
          font-size: 0.875rem;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
