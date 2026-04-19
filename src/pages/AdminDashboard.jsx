import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, LogOut, Package, Check, X } from 'lucide-react';
import ImageUploadArea from '../components/admin/ImageUploadArea';
import { supabase } from '../lib/supabase';

const generateId = () => Math.random().toString(36).substr(2, 9);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [vendors, setVendors] = useState([]);
  const [heroImages, setHeroImages] = useState([]);
  const [privacyContent, setPrivacyContent] = useState('Loading Privacy Policy...');
  const [termsContent, setTermsContent] = useState('Loading Terms and Conditions...');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [vendorForm, setVendorForm] = useState({ name: '', specialty: '', location: '', phone: '', description: '', image: '' });

  const [formData, setFormData] = useState({
    name: '', price: '', unit: '1kg', category: 'Vegetables', image: '', rating: 5.0, reviews: 0, description: '', reviewsList: []
  });

  useEffect(() => {
    const isAuth = localStorage.getItem('freshveg_admin_auth');
    const expectedToken = btoa("mr.8:bXIuOCs3NDI4Nw==");
    if (!isAuth || isAuth !== expectedToken) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: pD }, { data: cD }, { data: vD }, { data: hD }, { data: lD }] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('vendors').select('*'),
        supabase.from('hero_images').select('*'),
        supabase.from('legal_pages').select('*')
      ]);

      if (pD) setProducts(pD.map(p => ({ ...p, reviewsList: p.reviewsList || [] })));
      if (cD && cD.length > 0) setCategories(cD.map(c => c.name));
      if (vD) setVendors(vD);
      if (hD) setHeroImages(hD.map(h => h.url));
      
      if (lD) {
        const priv = lD.find(x => x.id === 'privacy');
        if (priv) setPrivacyContent(priv.content);
        const term = lD.find(x => x.id === 'terms');
        if (term) setTermsContent(term.content);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('freshveg_admin_auth');
    navigate('/');
  };

  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    const newCats = [...categories, trimmed];
    setCategories(newCats);
    await supabase.from('categories').insert({ id: generateId(), name: trimmed });
    setNewCategory('');
  };

  const handleRemoveCategory = async (cat) => {
    if (window.confirm(`Remove category "${cat}"? Products already using it will be unaffected.`)) {
      setCategories(categories.filter(c => c !== cat));
      await supabase.from('categories').delete().eq('name', cat);
    }
  };

  const savePrivacy = async () => {
    await supabase.from('legal_pages').upsert({ id: 'privacy', content: privacyContent });
    alert('Privacy Policy Saved Successfully to Cloud!');
  };

  const saveTerms = async () => {
    await supabase.from('legal_pages').upsert({ id: 'terms', content: termsContent });
    alert('Terms & Conditions Saved Successfully to Cloud!');
  };

  const saveHeroImages = async (newImgs) => {
    setHeroImages(newImgs);
    // Overwrite all hero images in supabase
    await supabase.from('hero_images').delete().neq('id', 'dummy'); 
    for (let img of newImgs) {
      await supabase.from('hero_images').insert({ id: generateId(), url: img });
    }
  };

  const openVendorModal = (vendor = null) => {
    if (vendor) {
      setEditingVendor(vendor);
      setVendorForm({ ...vendor });
    } else {
      setEditingVendor(null);
      setVendorForm({ name: '', specialty: '', location: '', phone: '', description: '', image: '' });
    }
    setIsVendorModalOpen(true);
  };

  const handleVendorSubmit = async (e) => {
    e.preventDefault();
    if (editingVendor) {
      const v = { ...vendorForm, id: editingVendor.id };
      setVendors(vendors.map(x => x.id === v.id ? v : x));
      await supabase.from('vendors').upsert(v);
    } else {
      const v = { ...vendorForm, id: generateId() };
      setVendors([...vendors, v]);
      await supabase.from('vendors').insert(v);
    }
    setIsVendorModalOpen(false);
    setEditingVendor(null);
  };

  const handleDeleteVendor = async (id) => {
    if (window.confirm('Delete this vendor?')) {
      setVendors(vendors.filter(v => v.id !== id));
      await supabase.from('vendors').delete().eq('id', id);
    }
  };

  const handleVendorChange = (e) => {
    const { name, value } = e.target;
    setVendorForm(p => ({ ...p, [name]: value }));
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ ...product });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', price: '', unit: '1kg', category: categories[0] || 'Vegetables', 
        image: '', rating: 5.0, reviews: 0, description: '', reviewsList: []
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setEditingProduct(null);
    }, 200); 
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
      await supabase.from('products').delete().eq('id', id);
    }
  };

  const toggleReviewVisibility = async (productId, reviewId) => {
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          reviewsList: p.reviewsList.map(r => r.id === reviewId ? { ...r, isHidden: !r.isHidden } : r)
        };
      }
      return p;
    });
    setProducts(updatedProducts);
    const prod = updatedProducts.find(x => x.id === productId);
    await supabase.from('products').upsert({ ...prod, reviewsList: prod.reviewsList });
  };

  const deleteReview = async (productId, reviewId) => {
    if (!window.confirm("Delete this review permanently?")) return;
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        return { ...p, reviewsList: p.reviewsList.filter(r => r.id !== reviewId) };
      }
      return p;
    });
    setProducts(updatedProducts);
    const prod = updatedProducts.find(x => x.id === productId);
    await supabase.from('products').upsert({ ...prod, reviewsList: prod.reviewsList });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) { alert("Please upload an image for the product"); return; }
    
    const updatedForm = { ...formData, price: Number(formData.price), rating: Number(formData.rating), reviews: Number(formData.reviews) };

    if (editingProduct) {
      const v = { ...updatedForm, id: editingProduct.id };
      setProducts(products.map(p => p.id === v.id ? v : p));
      await supabase.from('products').upsert(v);
    } else {
      const v = { ...updatedForm, id: generateId() };
      setProducts([...products, v]);
      await supabase.from('products').insert(v);
    }
    handleCloseModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (base64) => {
    setFormData(prev => ({ ...prev, image: base64 }));
  };

  return (
    <div className="admin-layout bg-mesh">
      {/* Sidebar/Header */}
      <header className="admin-header glass">
        <div className="container header-content">
          <div className="brand" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div className="logo-icon bg-primary" style={{ padding: '0.25rem', borderRadius: '4px', display: 'flex' }}>
              <Package size={20} color="white" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>Fresh<span style={{ color: 'var(--secondary)' }}>Veg</span></span>
            <span className="brand-divider hide-mobile" style={{ color: 'var(--text-muted)', margin: '0 8px' }}>|</span>
            <h1 className="hide-mobile">Admin Panel</h1>
          </div>
          <div className="actions">
            <Link to="/" className="view-site-link">View Site</Link>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={16} /> <span className="hide-mobile">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main container">
        <div className="page-head">
          <div>
            <h2>Inventory Management</h2>
            <p>Manage your products, prices, and images.</p>
          </div>
          <button onClick={() => openModal()} className="btn-primary add-btn">
            <Plus size={20} /> Add New Product
          </button>
        </div>

        {/* Product List */}
        <div className="inventory-grid">
          <AnimatePresence>
            {products.map(product => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="admin-product-card"
              >
                <div className="img-wrap">
                  <img src={product.image} alt={product.name} />
                  <span className="card-category">{product.category}</span>
                </div>
                <div className="card-info">
                  <h3 className="truncate">{product.name}</h3>
                  <div className="price-row">
                    <span className="price">₹{product.price}</span>
                    <span className="unit">/ {product.unit}</span>
                  </div>
                </div>
                <div className="card-actions">
                  <button onClick={() => openModal(product)} className="action-btn edit" title="Edit">
                    <Edit2 size={16} /> Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="action-btn delete" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {products.length === 0 && (
             <div className="empty-inventory">
               <Package size={48} className="text-muted mb-4 opacity-50" />
               <p>No products in inventory. Start by adding one!</p>
             </div>
          )}
        </div>
      </main>

      {/* Category Management Section */}
      <section className="cat-section container">
        <div className="cat-header">
          <div>
            <h2>Category Management</h2>
            <p>Add or remove product categories shown on the store.</p>
          </div>
        </div>
        <div className="cat-body">
          <div className="cat-add-row">
            <input
              type="text"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
              placeholder="New category name…"
              className="cat-input"
            />
            <button onClick={handleAddCategory} className="btn-primary cat-add-btn">
              <Plus size={18} /> Add Category
            </button>
          </div>
          <div className="cat-chips">
            {categories.map(cat => (
              <div key={cat} className="cat-chip">
                <span>{cat}</span>
                <button onClick={() => handleRemoveCategory(cat)} className="cat-remove-btn" title="Remove">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Carousel Management Section */}
      <section className="cat-section container">
        <div className="cat-header">
          <div>
            <h2>Hero Images</h2>
            <p>Manage the rotating carousel images on the home page.</p>
          </div>
          <label className="btn-primary cat-add-btn" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Plus size={18} /> Upload Image
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => {
                  saveHeroImages([...heroImages, reader.result]);
                };
                reader.readAsDataURL(file);
                e.target.value = '';
              }} 
            />
          </label>
        </div>
        <div className="vendors-admin-grid">
          {heroImages.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>No hero images. Default will be shown.</p>
          ) : heroImages.map((img, idx) => (
            <div key={img + idx} className="vendor-admin-card" style={{ position: 'relative' }}>
              <img src={img} alt={`Hero ${idx}`} className="vendor-admin-img" style={{ height: '140px', objectFit: 'cover', width: '100%', borderRadius: 'var(--radius-sm)' }} />
              <button 
                onClick={() => {
                  if (window.confirm('Remove this hero image?')) {
                    saveHeroImages(heroImages.filter((_, i) => i !== idx));
                  }
                }} 
                className="action-btn delete" 
                style={{ position: 'absolute', top: '10px', right: '10px', padding: '0.4rem', borderRadius: '50%', background: 'white' }}
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Legal Pages Management Section */}
      <section className="cat-section container">
        <div className="cat-header">
          <div>
            <h2>Legal Pages Content</h2>
            <p>Directly edit the text shown on your Privacy Policy and Terms & Conditions pages.</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-lg)', marginTop: 'var(--space-md)' }}>
          <div className="vendor-admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h3 style={{ color: 'var(--primary-dark)' }}>Privacy Policy</h3>
            <textarea 
              value={privacyContent}
              onChange={(e) => setPrivacyContent(e.target.value)}
              rows={10}
              style={{ padding: '0.75rem', width: '100%', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)', fontFamily: 'inherit', resize: 'vertical' }}
            />
            <button onClick={savePrivacy} className="btn-primary" style={{ padding: '0.75rem', marginTop: '0.5rem', justifyContent: 'center' }}>
              <Check size={16} style={{display:'inline', marginRight: '4px'}} /> Save Privacy Policy
            </button>
          </div>

          <div className="vendor-admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h3 style={{ color: 'var(--primary-dark)' }}>Terms & Conditions</h3>
            <textarea 
              value={termsContent}
              onChange={(e) => setTermsContent(e.target.value)}
              rows={10}
              style={{ padding: '0.75rem', width: '100%', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)', fontFamily: 'inherit', resize: 'vertical' }}
            />
            <button onClick={saveTerms} className="btn-primary" style={{ padding: '0.75rem', marginTop: '0.5rem', justifyContent: 'center' }}>
              <Check size={16} style={{display:'inline', marginRight: '4px'}} /> Save Terms & Conditions
            </button>
          </div>
        </div>
      </section>

      {/* Vendor Management Section */}
      <section className="cat-section container">
        <div className="cat-header">
          <div>
            <h2>Vendor Management</h2>
            <p>Add, edit, or remove farm partners and vendors shown on the store.</p>
          </div>
          <button onClick={() => openVendorModal()} className="btn-primary cat-add-btn">
            <Plus size={18} /> Add Vendor
          </button>
        </div>
        <div className="vendors-admin-grid">
          {vendors.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>No vendors yet. Add your first farm partner!</p>
          ) : vendors.map(vendor => (
            <div key={vendor.id} className="vendor-admin-card">
              {vendor.image && <img src={vendor.image} alt={vendor.name} className="vendor-admin-img" />}
              <div className="vendor-admin-info">
                <strong>{vendor.name}</strong>
                {vendor.specialty && <span className="cat-chip" style={{ display: 'inline-flex', marginTop: 4 }}>{vendor.specialty}</span>}
                {vendor.location && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>📍 {vendor.location}</p>}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button onClick={() => openVendorModal(vendor)} className="action-btn edit"><Edit2 size={15} /> Edit</button>
                <button onClick={() => handleDeleteVendor(vendor.id)} className="action-btn delete"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Review Management Section */}
      <section className="cat-section container">
        <div className="cat-header">
          <div>
            <h2>Review Management</h2>
            <p>Moderate user reviews. Hidden reviews won't show on the store.</p>
          </div>
        </div>
        <div className="reviews-admin-list">
          {products.every(p => !p.reviewsList?.length) ? (
            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>No user reviews yet.</p>
          ) : (
            <div className="reviews-table-wrap">
              <table className="reviews-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>User</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.flatMap(p => 
                    (p.reviewsList || []).map(r => (
                      <tr key={r.id}>
                        <td className="p-cell"><strong>{p.name}</strong></td>
                        <td>{r.user}</td>
                        <td style={{ color: '#d4a017', fontWeight: 700 }}>★ {r.rating}</td>
                        <td className="comment-cell">{r.comment}</td>
                        <td>
                          <span className={`status-badge ${r.isHidden ? 'hidden' : 'visible'}`}>
                            {r.isHidden ? 'Hidden' : 'Visible'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              onClick={() => toggleReviewVisibility(p.id, r.id)} 
                              className={`action-btn ${r.isHidden ? 'visible' : 'hide'}`}
                              title={r.isHidden ? "Show" : "Hide"}
                            >
                              {r.isHidden ? <Check size={14} /> : <X size={14} />} 
                              {r.isHidden ? "Show" : "Hide"}
                            </button>
                            <button 
                              onClick={() => deleteReview(p.id, r.id)} 
                              className="action-btn delete"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay">
            <motion.div 
              className="modal-content glass"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="modal-header">
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={handleCloseModal} className="close-btn"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-grid">
                  {/* Left Col - Image */}
                  <div className="form-group image-group">
                    <label>Product Image <span className="required">*</span></label>
                    <ImageUploadArea value={formData.image} onChange={handleImageChange} />
                  </div>
                  
                  {/* Right Col - Details */}
                  <div className="details-group">
                    <div className="form-group">
                      <label>Product Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Organic Tomatoes" />
                    </div>

                    <div className="form-group">
                      <label>Description (Benefits & Uses)</label>
                      <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        placeholder="e.g. Rich in Vitamin C, great for salads and sauces..."
                        rows="3"
                      />
                    </div>

                    <div className="row-2">
                      <div className="form-group">
                        <label>Price (₹)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" />
                      </div>
                      <div className="form-group">
                        <label>Unit <span style={{fontWeight:400, color:'var(--text-muted)', fontSize:'0.75rem'}}>(type freely or pick below)</span></label>
                        <input
                          type="text"
                          name="unit"
                          value={formData.unit}
                          onChange={handleChange}
                          placeholder="e.g. 1kg, 500g, 1 litre, 1 bunch"
                          required
                        />
                        <div className="unit-presets">
                          {['1kg','500g','250g','1 litre','500ml','1 bunch','1 piece','12 pcs'].map(u => (
                            <button key={u} type="button" className="unit-preset-btn" onClick={() => setFormData(p => ({...p, unit: u}))}>{u}</button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Category</label>
                      <select name="category" value={formData.category} onChange={handleChange}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="row-2 hidden-fields">
                      <div className="form-group">
                        <label>Rating (Default 5.0)</label>
                        <input type="number" name="rating" value={formData.rating} onChange={handleChange} step="0.1" min="1" max="5" />
                      </div>
                      <div className="form-group">
                        <label>Fake Reviews Count</label>
                        <input type="number" name="reviews" value={formData.reviews} onChange={handleChange} min="0" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={handleCloseModal} className="cancel-btn">Cancel</button>
                  <button type="submit" className="save-btn btn-primary">
                    <Check size={18} /> {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Vendor Modal */}
      <AnimatePresence>
        {isVendorModalOpen && (
          <div className="modal-overlay">
            <motion.div
              className="modal-content glass"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ maxWidth: 560 }}
            >
              <div className="modal-header">
                <h2>{editingVendor ? 'Edit Vendor' : 'Add Vendor'}</h2>
                <button onClick={() => setIsVendorModalOpen(false)} className="close-btn"><X size={24} /></button>
              </div>
              <form onSubmit={handleVendorSubmit} className="modal-form">
                <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  <div className="form-group">
                    <label>Vendor / Farm Name <span className="required">*</span></label>
                    <input type="text" name="name" value={vendorForm.name} onChange={handleVendorChange} required placeholder="e.g. Green Acres Farm" />
                  </div>
                  <div className="form-group">
                    <label>Specialty</label>
                    <input type="text" name="specialty" value={vendorForm.specialty} onChange={handleVendorChange} placeholder="e.g. Organic Vegetables, Dairy" />
                  </div>
                  <div className="row-2">
                    <div className="form-group">
                      <label>Location</label>
                      <input type="text" name="location" value={vendorForm.location} onChange={handleVendorChange} placeholder="e.g. Coimbatore, TN" />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input type="tel" name="phone" value={vendorForm.phone} onChange={handleVendorChange} placeholder="e.g. 9876543210" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={vendorForm.description} onChange={handleVendorChange} rows={3} placeholder="Brief description of the vendor or farm..." />
                  </div>
                  <div className="form-group">
                    <label>Vendor Photo <span className="required">*</span></label>
                    <ImageUploadArea 
                      value={vendorForm.image} 
                      onChange={(base64) => setVendorForm(p => ({ ...p, image: base64 }))} 
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={() => setIsVendorModalOpen(false)} className="cancel-btn">Cancel</button>
                  <button type="submit" className="save-btn btn-primary">
                    <Check size={18} /> {editingVendor ? 'Save Changes' : 'Add Vendor'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .admin-layout {
          min-height: 100vh;
          padding-top: 80px;
        }
        .admin-header {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 80px;
          z-index: 40;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .header-content {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-md);
        }
        .brand {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        .brand h1 { font-size: 1.25rem; color: var(--primary-dark); margin: 0; }
        @media (max-width: 640px) {
          .hide-mobile { display: none !important; }
        }
        .text-secondary { color: var(--secondary); }
        .actions {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }
        .view-site-link {
          font-weight: 600;
          color: var(--primary);
          font-size: 0.875rem;
        }
        .view-site-link:hover { text-decoration: underline; }
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #dc2626;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          background: rgba(220, 38, 38, 0.1);
          transition: var(--transition-normal);
        }
        .logout-btn:hover { background: #dc2626; color: white; }

        .admin-main {
          padding: var(--space-xl) var(--space-md);
        }
        .page-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: var(--space-xl);
          flex-wrap: wrap;
          gap: var(--space-md);
        }
        .page-head h2 { font-size: 2.5rem; color: var(--primary-dark); margin-bottom: 0.5rem; }
        .page-head p { color: var(--text-muted); font-size: 1.125rem; }
        .add-btn { box-shadow: var(--shadow-primary); }

        .empty-inventory {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-xxl) 0;
          background: white;
          border-radius: var(--radius-lg);
          border: 2px dashed rgba(0,0,0,0.1);
          color: var(--text-muted);
          font-weight: 600;
        }
        .mb-4 { margin-bottom: 1rem; }

        .inventory-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--space-lg);
        }
        .admin-product-card {
          background: white;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          border: 1px solid rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
        }
        .img-wrap {
          height: 200px;
          position: relative;
          background: #f0f0f0;
        }
        .img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .card-category {
          position: absolute;
          top: 0.75rem; left: 0.75rem;
          background: rgba(255,255,255,0.9);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
        }
        .card-info { padding: var(--space-md); flex: 1; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .card-info h3 { font-size: 1.125rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; white-space: normal; line-height: 1.4; }
        .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .price-row { display: flex; align-items: baseline; gap: 0.25rem; flex-wrap: wrap; }
        .price-row .price { font-weight: 800; font-size: 1.25rem; color: var(--primary); }
        .price-row .unit { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
        .card-actions {
          display: flex;
          padding: 0.5rem;
          gap: 0.5rem;
          background: #fafafa;
        }
        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          font-weight: 600;
          font-size: 0.875rem;
          border-radius: var(--radius-sm);
          transition: var(--transition-normal);
        }
        .action-btn.edit { background: rgba(212, 160, 23, 0.1); color: #b8860b; }
        .action-btn.edit:hover { background: var(--secondary); color: white; }
        .action-btn.delete { flex: 0 0 auto; background: rgba(220, 38, 38, 0.1); color: #dc2626; padding: 0.75rem 1rem; }
        .action-btn.delete:hover { background: #dc2626; color: white; }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-md);
        }
        .modal-content {
          background: white;
          width: 100%;
          max-width: 900px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          max-height: 90vh;
        }
        .modal-header {
          padding: var(--space-lg);
          border-bottom: 1px solid rgba(0,0,0,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-header h2 { font-size: 1.5rem; color: var(--primary-dark); }
        .close-btn { color: var(--text-muted); transition: 0.2s; }
        .close-btn:hover { color: #dc2626; transform: rotate(90deg); }
        
        .modal-form {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        .form-grid {
          padding: var(--space-lg);
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-xl);
        }
        @media (min-width: 768px) {
          .form-grid { grid-template-columns: 1fr 1fr; }
        }
        .details-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        .form-group label {
          display: block;
          font-weight: 700;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
          color: var(--text-main);
        }
        .required { color: #dc2626; }
        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid rgba(0,0,0,0.08);
          border-radius: var(--radius-sm);
          font-family: inherit;
          font-size: 1rem;
          transition: var(--transition-normal);
        }
        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(30, 58, 26, 0.1);
        }
        .row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-md);
        }
        .hidden-fields { 
          background: #f9faf9; 
          padding: var(--space-sm); 
          border-radius: var(--radius-sm);
          border: 1px dashed rgba(0,0,0,0.1);
        }
        
        .modal-footer {
          padding: var(--space-md) var(--space-lg);
          border-top: 1px solid rgba(0,0,0,0.05);
          display: flex;
          justify-content: flex-end;
          gap: var(--space-sm);
          background: #fafafa;
          border-bottom-left-radius: var(--radius-lg);
          border-bottom-right-radius: var(--radius-lg);
        }
        .cancel-btn {
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          color: var(--text-muted);
          border-radius: var(--radius-sm);
        }
        .cancel-btn:hover { background: rgba(0,0,0,0.05); color: var(--text-main); }
        .save-btn { border-radius: var(--radius-sm); }
        /* Category Management */
        .cat-section {
          padding: var(--space-xl) var(--space-md);
          border-top: 1px solid rgba(0,0,0,0.06);
          margin-bottom: var(--space-xl);
        }
        .cat-header {
          display: flex; justify-content: space-between; align-items: flex-end;
          margin-bottom: var(--space-lg);
        }
        .cat-header h2 { font-size: 1.75rem; color: var(--primary-dark); margin-bottom: 0.25rem; }
        .cat-header p { color: var(--text-muted); font-size: 0.95rem; }
        .cat-body { background: white; border-radius: var(--radius-lg); padding: var(--space-lg); border: 1px solid rgba(0,0,0,0.05); box-shadow: var(--shadow-sm); }
        .cat-add-row { display: flex; gap: var(--space-sm); margin-bottom: var(--space-md); flex-wrap: wrap; }
        .cat-input {
          flex: 1; min-width: 180px;
          padding: 0.75rem 1rem;
          border: 2px solid rgba(0,0,0,0.09);
          border-radius: var(--radius-sm);
          font-family: inherit; font-size: 1rem;
        }
        .cat-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(30,58,26,0.1); }
        .cat-add-btn { display: flex; align-items: center; gap: 0.4rem; white-space: nowrap; }
        .cat-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .cat-chip {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.4rem 0.75rem 0.4rem 1rem;
          background: rgba(30,58,26,0.07);
          border-radius: var(--radius-full);
          font-weight: 700; font-size: 0.875rem;
          color: var(--primary-dark);
        }
        .cat-remove-btn { color: #dc2626; opacity: 0.6; display: flex; align-items: center; transition: 0.2s; }
        .cat-remove-btn:hover { opacity: 1; }
        /* Unit Presets */
        .unit-presets { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.5rem; }
        .unit-preset-btn {
          padding: 0.2rem 0.6rem;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: var(--radius-full);
          border: 1.5px solid rgba(30,58,26,0.2);
          color: var(--primary);
          background: white;
          cursor: pointer;
          transition: 0.15s;
        }
        .unit-preset-btn:hover { background: var(--primary); color: white; border-color: var(--primary); }
        /* Vendor Admin Grid */
        .vendors-admin-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--space-md); }
        .vendor-admin-card { background: #fafafa; border-radius: var(--radius-md); padding: var(--space-md); border: 1px solid rgba(0,0,0,0.06); }
        .vendor-admin-img { width: 100%; height: 120px; object-fit: cover; border-radius: var(--radius-sm); margin-bottom: 0.5rem; }
        .vendor-admin-info { margin-bottom: 0.5rem; }
        .vendor-admin-info strong { font-size: 1rem; color: var(--primary-dark); display: block; }

        /* Review Management */
        .reviews-admin-list { margin-top: var(--space-md); }
        .reviews-table-wrap { overflow-x: auto; background: white; border-radius: var(--radius-md); border: 1px solid rgba(0,0,0,0.06); }
        .reviews-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
        .reviews-table th, .reviews-table td { padding: 1rem; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .reviews-table th { background: #f8faf8; font-weight: 700; color: var(--primary-dark); }
        .reviews-table tr:last-child td { border-bottom: none; }
        .p-cell { color: var(--primary); }
        .comment-cell { max-width: 300px; color: var(--text-muted); line-height: 1.4; }
        .status-badge { 
          padding: 0.25rem 0.6rem; border-radius: var(--radius-full); 
          font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
        }
        .status-badge.visible { background: rgba(30,58,26,0.1); color: var(--primary); }
        .status-badge.hidden { background: rgba(0,0,0,0.05); color: var(--text-muted); }
        .action-btn.visible { color: var(--primary); background: rgba(30,58,26,0.08); }
        .action-btn.hide { color: var(--text-muted); background: rgba(0,0,0,0.05); }
    
      `}</style>
    </div>
  );
};

export default AdminDashboard;
