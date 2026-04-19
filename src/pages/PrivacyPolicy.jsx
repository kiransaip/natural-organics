import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

const PrivacyPolicy = () => {
  const [content, setContent] = useState('Loading Privacy Policy...');

  useEffect(() => {
    const fetchPolicy = async () => {
      const { data, error } = await supabase.from('legal_pages').select('content').eq('id', 'privacy').single();
      if (data && data.content) {
        setContent(data.content);
      } else {
        setContent('Privacy Policy could not be loaded at this time.');
      }
    };
    fetchPolicy();
  }, []);

  return (
    <div className="page bg-mesh" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '800px', padding: '2rem 1rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '3rem' }}>
        <h1 style={{ color: 'var(--primary-dark)', marginBottom: '1.5rem', fontSize: '2.5rem' }}>Privacy Policy</h1>
        
        <div style={{ color: 'var(--text-muted)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
          {content}
        </div>
        
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginTop: '3rem', fontSize: '0.9rem' }}>
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
