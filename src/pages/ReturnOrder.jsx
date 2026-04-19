import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = "918074745490";

const ReturnOrder = () => {
  const [formData, setFormData] = useState({ name: '', orderId: '', reason: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.orderId.trim()) errs.orderId = 'Order ID is required';
    if (!formData.reason.trim()) errs.reason = 'Please provide a reason for the return';
    
    // Attempt to decode the Order ID as validation (Double Decoder)
    try {
      if (formData.orderId.trim()) {
        const firstDecode = atob(formData.orderId.trim());
        const decoded = decodeURIComponent(escape(atob(firstDecode)));
        if (!decoded.startsWith('ORD-')) {
          errs.orderId = 'Invalid Order ID format. Must match original WhatsApp order.';
        }
      }
    } catch {
      errs.orderId = 'Invalid Order ID format. Did you paste it correctly?';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const message = [
      `*Return Request - Natural Organics*`,
      ``,
      `*Customer Details*`,
      `  Name: ${formData.name}`,
      `  Order ID: ${formData.orderId}`,
      ``,
      `*Reason for Return*`,
      formData.reason,
      ``,
      `Please review this return request.`
    ].join('\n');

    const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank', 'noopener,noreferrer');
    
    // Clear form after submitting
    setFormData({ name: '', orderId: '', reason: '' });
  };

  return (
    <div className="page bg-mesh" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '600px', padding: '2rem 1rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '3rem' }}>
        <h1 style={{ color: 'var(--primary-dark)', marginBottom: '0.5rem', fontSize: '2.5rem' }}>Return Order</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
          We are sorry to hear you want to return an item. Please formulate your return request using the secure Order ID found at the top of your WhatsApp order ticket.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-main)' }}>Your Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Ravi Kumar"
              style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid rgba(0,0,0,0.09)', borderRadius: '8px', fontFamily: 'inherit' }}
            />
            {errors.name && <span style={{ color: '#dc2626', fontSize: '0.75rem' }}>{errors.name}</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-main)' }}>Secure Order ID</label>
            <input 
              type="text" 
              value={formData.orderId}
              onChange={e => setFormData(p => ({ ...p, orderId: e.target.value }))}
              placeholder="e.g. T1JELTE2OTg3NjU0MzIxLTQyMA=="
              style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid rgba(0,0,0,0.09)', borderRadius: '8px', fontFamily: 'inherit' }}
            />
            {errors.orderId && <span style={{ color: '#dc2626', fontSize: '0.75rem' }}>{errors.orderId}</span>}
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>You can find this Base64 string at the top of the WhatsApp message in your order history.</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-main)' }}>Reason for Return</label>
            <textarea 
              rows={4}
              value={formData.reason}
              onChange={e => setFormData(p => ({ ...p, reason: e.target.value }))}
              placeholder="Please explain why you are requesting a return so we can assist you better."
              style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid rgba(0,0,0,0.09)', borderRadius: '8px', fontFamily: 'inherit', resize: 'vertical' }}
            />
            {errors.reason && <span style={{ color: '#dc2626', fontSize: '0.75rem' }}>{errors.reason}</span>}
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '0.875rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem' }}>
            <MessageCircle size={18} /> Request Return
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReturnOrder;
