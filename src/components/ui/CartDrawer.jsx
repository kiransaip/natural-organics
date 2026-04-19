import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingCart, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const WHATSAPP_NUMBER = "918074745490";

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const [step, setStep] = useState('cart'); // 'cart' | 'form'
  const [formData, setFormData] = useState({ name: '', mobile: '', address: '' });
  const [formErrors, setFormErrors] = useState({});

  const handleClose = () => {
    setIsCartOpen(false);
    setStep('cart');
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!/^[0-9]{10}$/.test(formData.mobile.trim())) errs.mobile = 'Enter a valid 10-digit mobile number';
    if (!formData.address.trim()) errs.address = 'Address is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOrder = () => {
    if (!validate()) return;

    const itemLines = cart.map(({ product, quantity }) =>
      `  • ${product.name} x${quantity} — ₹${(product.price * quantity).toLocaleString()} (${product.unit})`
    ).join('\n');

    const now = new Date();
    const dateTimeStr = now.toLocaleDateString('en-IN', { 
      day: '2-digit', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit', hour12: true 
    });

    // Make Order ID securely identifiable through date, name, last 4 of mobile, and total price
    const mobileLast4 = formData.mobile.slice(-4) || '0000';
    const idString = `ORD-${formData.name} (${mobileLast4}) | ${dateTimeStr} | ₹${totalPrice.toLocaleString()}`;
    const orderIdB64 = btoa(unescape(encodeURIComponent(idString)));

    const message = [
      `*New Order - Natural Organics*`,
      `*Order ID:* ${orderIdB64}`,
      `*Date:* ${dateTimeStr}`,
      ``,
      `*Customer Details*`,
      `  Name: ${formData.name}`,
      `  Mobile: ${formData.mobile}`,
      `  Address: ${formData.address}`,
      ``,
      `*Order Summary*`,
      itemLines,
      ``,
      `*Total Amount: ₹${totalPrice.toLocaleString()}*`,
      `---------------------------------------`,
      `Please confirm my order. Thank you!`
    ].join('\n');

    const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank', 'noopener,noreferrer');
    clearCart();
    handleClose();
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Drawer */}
          <motion.div
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="cart-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShoppingCart size={22} />
                <h2>
                  {step === 'cart' ? `Your Cart (${totalItems})` : 'Your Details'}
                </h2>
              </div>
              <button onClick={handleClose} className="cart-close-btn">
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            <div className="cart-body">
              {step === 'cart' ? (
                cart.length === 0 ? (
                  <div className="cart-empty">
                    <ShoppingCart size={48} opacity={0.2} />
                    <p>Your cart is empty.<br />Add some fresh produce!</p>
                  </div>
                ) : (
                  cart.map(({ product, quantity }) => (
                    <div key={product.id} className="cart-item">
                      <img src={product.image} alt={product.name} className="cart-item-img" />
                      <div className="cart-item-info">
                        <p className="cart-item-name">{product.name}</p>
                        <p className="cart-item-price">₹{product.price} / {product.unit}</p>
                        <div className="cart-qty-row">
                          <button onClick={() => updateQuantity(product.id, quantity - 1)} className="qty-btn"><Minus size={14} /></button>
                          <span className="qty-val">{quantity}</span>
                          <button onClick={() => updateQuantity(product.id, quantity + 1)} className="qty-btn"><Plus size={14} /></button>
                          <span className="cart-subtotal">₹{(product.price * quantity).toLocaleString()}</span>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(product.id)} className="remove-btn"><Trash2 size={16} /></button>
                    </div>
                  ))
                )
              ) : (
                <div className="order-form">
                  <p className="form-hint">Please fill in your details to complete the order via WhatsApp.</p>
                  <div className="order-field">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Ravi Kumar"
                    />
                    {formErrors.name && <span className="field-error">{formErrors.name}</span>}
                  </div>
                  <div className="order-field">
                    <label>Mobile Number</label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={e => setFormData(p => ({ ...p, mobile: e.target.value }))}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                    />
                    {formErrors.mobile && <span className="field-error">{formErrors.mobile}</span>}
                  </div>
                  <div className="order-field">
                    <label>Delivery Address</label>
                    <textarea
                      value={formData.address}
                      onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                      placeholder="Full address including pincode or Google Maps link"
                      rows={3}
                    />
                    {formErrors.address && <span className="field-error">{formErrors.address}</span>}
                  </div>

                  <div className="order-summary-mini">
                    <strong>Order Summary</strong>
                    {cart.map(({ product, quantity }) => (
                      <div key={product.id} className="mini-item">
                        <span>{product.name} × {quantity}</span>
                        <span>₹{(product.price * quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="mini-total">
                      <strong>Total</strong>
                      <strong>₹{totalPrice.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total</span>
                  <strong>₹{totalPrice.toLocaleString()}</strong>
                </div>
                {step === 'cart' ? (
                  <button className="checkout-btn btn-primary" onClick={() => setStep('form')}>
                    Proceed to Order →
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="back-btn" onClick={() => setStep('cart')}>← Back</button>
                    <button className="checkout-btn btn-primary" onClick={handleOrder}>
                      <MessageCircle size={18} /> Send via WhatsApp
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}

      <style>{`
        .cart-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 200;
          backdrop-filter: blur(3px);
        }
        .cart-drawer {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: min(420px, 100vw);
          background: white;
          z-index: 201;
          display: flex; flex-direction: column;
          box-shadow: -8px 0 40px rgba(0,0,0,0.15);
        }
        .cart-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(0,0,0,0.07);
          background: var(--primary-dark);
          color: white;
        }
        .cart-header h2 { font-size: 1.125rem; font-weight: 700; color: white; }
        .cart-close-btn { color: rgba(255,255,255,0.7); transition: 0.2s; }
        .cart-close-btn:hover { color: white; transform: rotate(90deg); }
        .cart-body { flex: 1; overflow-y: auto; padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .cart-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; gap: 1rem; color: var(--text-muted); text-align: center; min-height: 200px; }
        .cart-item { display: flex; align-items: flex-start; gap: 1rem; padding: 1rem; background: #f9faf9; border-radius: 12px; border: 1px solid rgba(0,0,0,0.05); }
        .cart-item-img { width: 64px; height: 64px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
        .cart-item-info { flex: 1; }
        .cart-item-name { font-weight: 700; color: var(--primary-dark); font-size: 0.95rem; }
        .cart-item-price { font-size: 0.8rem; color: var(--text-muted); margin: 0.2rem 0 0.5rem; }
        .cart-qty-row { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
        .qty-btn { width: 28px; height: 28px; border-radius: 50%; background: white; border: 2px solid rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
        .qty-btn:hover { border-color: var(--primary); color: var(--primary); }
        .qty-val { font-weight: 700; min-width: 20px; text-align: center; }
        .cart-subtotal { font-weight: 700; font-size: 0.875rem; color: var(--primary); margin-left: 0.5rem; }
        .remove-btn { color: #dc2626; opacity: 0.5; transition: 0.2s; flex-shrink: 0; padding: 0.25rem; }
        .remove-btn:hover { opacity: 1; }

        .order-form { display: flex; flex-direction: column; gap: 1rem; }
        .form-hint { font-size: 0.875rem; color: var(--text-muted); padding: 0.75rem; background: rgba(30,58,26,0.05); border-radius: 8px; line-height: 1.5; }
        .order-field label { display: block; font-weight: 700; font-size: 0.8rem; color: var(--text-main); margin-bottom: 0.35rem; }
        .order-field input, .order-field textarea {
          width: 100%; padding: 0.75rem 1rem;
          border: 2px solid rgba(0,0,0,0.09);
          border-radius: 8px;
          font-family: inherit; font-size: 0.95rem;
          transition: 0.2s;
        }
        .order-field input:focus, .order-field textarea:focus {
          outline: none; border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(30,58,26,0.1);
        }
        .order-field textarea { resize: vertical; }
        .field-error { color: #dc2626; font-size: 0.75rem; margin-top: 0.25rem; display: block; }
        .order-summary-mini { border: 1px dashed rgba(0,0,0,0.1); border-radius: 10px; padding: 1rem; font-size: 0.875rem; display: flex; flex-direction: column; gap: 0.4rem; }
        .order-summary-mini strong { display: block; margin-bottom: 0.5rem; color: var(--primary-dark); }
        .mini-item { display: flex; justify-content: space-between; color: var(--text-muted); }
        .mini-total { display: flex; justify-content: space-between; padding-top: 0.5rem; border-top: 1px solid rgba(0,0,0,0.08); margin-top: 0.25rem; }

        .cart-footer { padding: 1rem 1.5rem; border-top: 1px solid rgba(0,0,0,0.07); background: #fafafa; }
        .cart-total { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; font-size: 1.1rem; }
        .cart-total strong { color: var(--primary); font-size: 1.4rem; }
        .checkout-btn { width: 100%; padding: 0.875rem; font-size: 1rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .back-btn { padding: 0.875rem 1rem; font-weight: 600; color: var(--text-muted); border-radius: var(--radius-sm); border: 2px solid rgba(0,0,0,0.1); flex-shrink: 0; }
        .back-btn:hover { background: rgba(0,0,0,0.04); }
      `}</style>
    </AnimatePresence>
  );
};

export default CartDrawer;
