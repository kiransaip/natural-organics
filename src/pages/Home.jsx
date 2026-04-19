import React, { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Leaf, ShieldCheck, Truck, MapPin, Phone, Store } from 'lucide-react';
import FloatingElements from '../components/ui/FloatingElements';
import ProductCard from '../components/product/ProductCard';
import { supabase } from '../lib/supabase';

const DEFAULT_SEED = [
  { id: '1', name: 'Organic Tomatoes', price: 60, unit: '1kg', category: 'Vegetables', rating: 4.8, reviews: 120, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800' },
  { id: '2', name: 'Fresh Spinach', price: 40, unit: '1 bunch', category: 'Leafy Greens', rating: 4.9, reviews: 85, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=800' },
  { id: '3', name: 'Natural Honey', price: 250, unit: '500g', category: 'Natural', rating: 5.0, reviews: 200, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800' }
];

const readLS = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [heroImages, setHeroImages] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const loadData = useCallback(async () => {
    const { data: prods } = await supabase.from('products').select('*');
    if (prods && prods.length > 0) {
      setProducts(prods);
      const cats = Array.from(new Set(prods.map(p => p.category)));
      setCategories(['All', ...cats]);
    } else {
      setProducts(DEFAULT_SEED);
      const cats = Array.from(new Set(DEFAULT_SEED.map(p => p.category)));
      setCategories(['All', ...cats]);
    }

    const { data: heroData } = await supabase.from('hero_images').select('*');
    if (heroData && heroData.length > 0) {
      setHeroImages(heroData.map(h => h.url));
    } else {
      setHeroImages(['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=1200']);
    }

    const { data: vendorsData } = await supabase.from('vendors').select('*');
    if (vendorsData && vendorsData.length > 0) {
      setVendors(vendorsData);
    } else {
      setVendors([]);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Re-load whenever the window regains focus (user returns from admin tab)
    window.addEventListener('focus', loadData);
    return () => window.removeEventListener('focus', loadData);
  }, [loadData]);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex(prev => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const features = [
    { icon: <Leaf />, title: '100% Organic', desc: 'No pesticides or harmful chemicals used in our farms.' },
    { icon: <ShieldCheck />, title: 'Direct from Farm', desc: 'Freshly harvested daily and delivered straight to you.' },
    { icon: <Truck />, title: 'Fast Delivery', desc: 'Quick delivery ensuring maximum freshness upon arrival.' }
  ];

  const animateUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  // Build category list: All + saved admin categories + categories from products
  const productCategories = [...new Set(products.map(p => p.category))];
  const allCategories = ['All', ...new Set([...categories, ...productCategories])];
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="page bg-mesh">
      
      {/* Hero Section */}
      <section className="hero">
        <FloatingElements />
        <div className="container hero-container relative">
          <motion.div 
            className="hero-content"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0, x: -50 },
              show: { opacity: 1, x: 0, transition: { duration: 1, staggerChildren: 0.2 } }
            }}
          >
            <motion.div variants={animateUp} className="badge glass">
              <span className="dot"></span>
              Freshly Harvested Today
            </motion.div>
            
            <motion.h1 variants={animateUp} className="hero-title">
              Pure Nature, <br />
              <span className="text-gradient">Direct to You.</span>
            </motion.h1>
            
            <motion.p variants={animateUp} className="hero-desc">
              Experience the pinnacle of freshness with our farm-direct vegetables and natural products. Crafted by nature, delivered with care.
            </motion.p>
            
            <motion.div variants={animateUp} className="hero-actions">
              <a href="#products" className="btn-primary">
                Shop Collection <ArrowRight size={20} />
              </a>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            className="hero-image-wrapper"
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}
          >
            <div className="image-glow"></div>
            <AnimatePresence mode="popLayout">
              {heroImages.length > 0 && (
                <motion.img 
                  key={currentHeroIndex}
                  src={heroImages[currentHeroIndex]}
                  alt="Farm fresh vegetables" 
                  className="hero-image"
                  initial={{ opacity: 0, x: 50, scale: 1.05 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </AnimatePresence>
            {/* Fallback space filler since images are now absolute */}
            <div style={{ paddingBottom: '75%', visibility: 'hidden' }}></div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features bg-card pattern-bg">
        <div className="container">
          <motion.div 
            className="features-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {features.map((feature, idx) => (
              <motion.div key={idx} variants={animateUp} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="products section-padding natural-bg">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={animateUp}
          >
            <span className="subtitle">Premium Collection</span>
            <h2>Fresh From <span className="text-gradient">Nature's Heart</span></h2>
            <p>Curated selection of the season's finest harvest.</p>
          </motion.div>

          {/* Category Filter Pills */}
          <div className="category-filter">
            {allCategories.map(cat => (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div 
            key={selectedCategory}
            className="products-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { staggerChildren: 0.08, duration: 0.3 } }}
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <p className="no-products">{selectedCategory !== 'All' ? `No products in "${selectedCategory}" category.` : 'No products found. Please add products from Admin Dashboard.'}</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Vendors Section */}
      {vendors.length > 0 && (
        <section id="vendors" className="vendors-section section-padding">
          <div className="container">
            <motion.div
              className="section-header"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={animateUp}
            >
              <span className="subtitle">Our Farm Partners</span>
              <h2>Meet Our <span className="text-gradient">Vendors</span></h2>
              <p>Fresh produce sourced directly from trusted local farms and vendors.</p>
            </motion.div>
            <motion.div
              className="vendors-grid"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.12 } } }}
            >
              {vendors.map((vendor, idx) => (
                <motion.div
                  key={vendor.id}
                  className="vendor-card"
                  variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: idx * 0.1 } } }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                >
                  {vendor.image ? (
                    <img src={vendor.image} alt={vendor.name} className="vendor-img" />
                  ) : (
                    <div className="vendor-img-placeholder"><Store size={40} /></div>
                  )}
                  <div className="vendor-info">
                    <h3>{vendor.name}</h3>
                    {vendor.specialty && <span className="vendor-specialty">{vendor.specialty}</span>}
                    {vendor.location && (
                      <p className="vendor-location"><MapPin size={14} />{vendor.location}</p>
                    )}
                    {vendor.phone && (
                      <p className="vendor-phone"><Phone size={14} />{vendor.phone}</p>
                    )}
                    {vendor.description && <p className="vendor-desc">{vendor.description}</p>}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
      <style>{`
        .page {
          overflow-x: hidden;
          background-color: #fcfdfc;
        }
        .bg-mesh {
          background-image: 
            radial-gradient(at 40% 20%, hsla(118,100%,74%,0.1) 0px, transparent 50%),
            radial-gradient(at 80% 0%, hsla(89,100%,56%,0.05) 0px, transparent 50%),
            radial-gradient(at 0% 50%, hsla(44,100%,72%,0.1) 0px, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232a5a22' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          padding-top: var(--space-xl);
          padding-bottom: var(--space-lg);
        }
        .hero-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-xl);
          align-items: center;
          z-index: 10;
        }
        @media (min-width: 1024px) {
          .hero-container {
            grid-template-columns: 1.15fr 1fr;
            padding-top: var(--space-lg);
          }
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--primary);
          margin-bottom: var(--space-lg);
        }
        .dot {
          width: 8px;
          height: 8px;
          background-color: var(--secondary);
          border-radius: 50%;
        }
        .hero-title {
          font-size: 2.5rem;
          font-weight: 900;
          line-height: 1.1;
          color: var(--primary-dark);
          margin-bottom: var(--space-md);
        }
        @media (min-width: 640px) {
          .hero-title { font-size: 3.5rem; }
        }
        @media (min-width: 768px) {
          .hero-title { font-size: 4.5rem; }
        }
        @media (min-width: 1024px) {
          .hero-title { font-size: 5.5rem; }
        }
        .hero-desc {
          font-size: 1.1rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: var(--space-xl);
          max-width: 500px;
        }
        @media (min-width: 640px) {
          .hero-desc { font-size: 1.25rem; }
        }
        .hero-image-wrapper {
          position: relative;
        }
        .image-glow {
          position: absolute;
          inset: -20px;
          background: var(--gradient-primary);
          filter: blur(40px);
          opacity: 0.2;
          border-radius: var(--radius-lg);
          z-index: -1;
        }
        .hero-image {
          width: 100%;
          border-radius: var(--radius-lg);
          border: 4px solid white;
          box-shadow: var(--shadow-lg);
          transform: rotate(2deg);
        }
        
        .features {
          padding: var(--space-xl) 0;
          background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(240, 244, 240, 0.5) 100%);
          border-top: 1px solid rgba(0,0,0,0.03);
          border-bottom: 1px solid rgba(0,0,0,0.03);
          position: relative;
        }
        .features::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e3a1a' fill-opacity='0.02'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          z-index: -1;
        }
        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-xl);
        }
        @media (min-width: 768px) {
          .features-grid { grid-template-columns: repeat(3, 1fr); gap: var(--space-lg); }
        }
        .feature-card {
          text-align: center;
        }
        .feature-icon {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-md);
          background: rgba(30, 58, 26, 0.05);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto var(--space-md);
        }
        .feature-icon svg { width: 32px; height: 32px; }
        .feature-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary-dark);
          margin-bottom: var(--space-xs);
        }
        .feature-desc {
          color: var(--text-muted);
          line-height: 1.5;
        }

        .natural-bg {
          background-color: #ffffff;
          position: relative;
        }
        .natural-bg::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 150px;
          background: linear-gradient(to bottom, rgba(240, 244, 240, 0.5) 0%, rgba(255,255,255,0) 100%);
          z-index: 0;
          pointer-events: none;
        }
        
        .section-padding { padding: var(--space-xxl) 0; position: relative; z-index: 1;}
        .section-header {
          text-align: center;
          margin-bottom: var(--space-xl);
          max-width: 600px;
          margin-inline: auto;
        }
        .subtitle {
          display: block;
          color: var(--secondary);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.875rem;
          margin-bottom: var(--space-sm);
        }
        .section-header h2 {
          font-size: 3rem;
          font-weight: 900;
          color: var(--primary-dark);
          margin-bottom: var(--space-sm);
        }
        .section-header p {
          font-size: 1.125rem;
          color: var(--text-muted);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--space-lg);
        }
        .category-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: var(--space-xl);
        }
        .category-pill {
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.875rem;
          border: 2px solid rgba(30,58,26,0.15);
          color: var(--text-muted);
          transition: all 0.2s;
          cursor: pointer;
          background: white;
        }
        .category-pill:hover { border-color: var(--primary); color: var(--primary); }
        .category-pill.active {
          background: var(--gradient-primary);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(30,58,26,0.25);
        }
        .no-products {
          grid-column: 1 / -1;
          text-align: center;
          padding: var(--space-xl);
          background: rgba(0,0,0,0.02);
          border-radius: var(--radius-lg);
          font-weight: 600;
          color: var(--text-muted);
        }
        /* Vendors Section */
        .vendors-section { background: #f7faf7; }
        .vendors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: var(--space-lg);
        }
        .vendor-card {
          background: white;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: var(--shadow-sm);
        }
        .vendor-img {
          width: 100%; height: 180px;
          object-fit: cover;
        }
        .vendor-img-placeholder {
          width: 100%; height: 140px;
          background: rgba(30,58,26,0.06);
          display: flex; align-items: center; justify-content: center;
          color: var(--primary);
        }
        .vendor-info { padding: var(--space-md); }
        .vendor-info h3 { font-size: 1.15rem; font-weight: 800; color: var(--primary-dark); margin-bottom: 0.35rem; }
        .vendor-specialty {
          display: inline-block;
          background: rgba(30,58,26,0.08);
          color: var(--primary);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          margin-bottom: 0.5rem;
        }
        .vendor-location, .vendor-phone {
          display: flex; align-items: center; gap: 0.35rem;
          font-size: 0.82rem; color: var(--text-muted);
          margin-top: 0.3rem;
        }
        .vendor-desc {
          font-size: 0.82rem; color: var(--text-muted);
          margin-top: 0.5rem; line-height: 1.5;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Home;
