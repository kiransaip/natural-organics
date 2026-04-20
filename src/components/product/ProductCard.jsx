import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Star, ChevronDown, ChevronUp, User, Send } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabase';

const ProductCard = ({ product }) => {
  const { id, name, price, unit, image, rating: initialRating, reviews: initialReviewCount, category, description, reviewsList = [], offer_tag } = product;
  const { addToCart } = useCart();
  const [showReviews, setShowReviews] = useState(false);
  const [newReview, setNewReview] = useState({ user: '', rating: 5, comment: '' });
  const [localReviews, setLocalReviews] = useState(reviewsList);

  const activeReviews = localReviews.filter(r => !r.isHidden);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.user.trim() || !newReview.comment.trim()) return;

    const reviewObj = {
      id: Date.now().toString(),
      user: newReview.user,
      rating: Number(newReview.rating),
      comment: newReview.comment,
      date: new Date().toLocaleDateString(),
      isHidden: false
    };

    const updatedReviews = [...localReviews, reviewObj];
    setLocalReviews(updatedReviews);

    // Update Supabase
    const { error } = await supabase
      .from('products')
      .update({ 
        reviewsList: updatedReviews, 
        reviews: (product.reviews || 0) + 1 
      })
      .eq('id', id);

    if (error) {
      console.error("Error saving review:", error);
      alert("Something went wrong saving your review. Please try again.");
    } else {
      alert("Thank you for your review!");
    }

    // Reset form
    setNewReview({ user: '', rating: 5, comment: '' });
  };

  return (
    <motion.div 
      className="product-card"
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <div className="image-container">
        <motion.img 
          src={image} 
          alt={name}
          className="product-img"
          whileHover={{ scale: 1.05, transition: { duration: 0.5 } }}
        />
        <div className="category-tag glass">{category}</div>
        {offer_tag && (
          <motion.div 
            className="offer-badge"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {offer_tag}
          </motion.div>
        )}
      </div>
      
      <div className="content">
        <h3 className="product-title">{name}</h3>
        
        <div className="rating">
          <Star size={16} color="#d4a017" fill="#d4a017" />
          <span className="rating-text">
            {initialRating} <span className="reviews" onClick={() => setShowReviews(!showReviews)} style={{ cursor: 'pointer' }}>
              ({activeReviews.length} reviews) {showReviews ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </span>
          </span>
        </div>

        {description && (
          <p className="product-desc">{description}</p>
        )}

        <div className="footer">
          <div className="price-box">
            <span className="price">₹{price}</span>
            <span className="unit">/ {unit}</span>
          </div>
          
          <motion.button
            onClick={() => addToCart(product)}
            className="add-cart-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Add to cart"
          >
            <Plus size={20} /> Add
          </motion.button>
        </div>

        <AnimatePresence>
          {showReviews && (
            <motion.div 
              className="reviews-section"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="reviews-list">
                {activeReviews.length === 0 ? (
                  <p className="no-reviews">No reviews yet. Be the first!</p>
                ) : (
                  activeReviews.map(r => (
                    <div key={r.id} className="review-item">
                      <div className="review-header">
                        <div className="u-icon"><User size={12} /></div>
                        <strong>{r.user}</strong>
                        <span className="r-stars">{'★'.repeat(r.rating)}</span>
                      </div>
                      <p className="r-comment">{r.comment}</p>
                      <span className="r-date">{r.date}</span>
                    </div>
                  ))
                )}
              </div>

              <form className="add-review-form" onSubmit={handleReviewSubmit}>
                <h4>Write a Review</h4>
                <div className="form-row">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    value={newReview.user}
                    onChange={e => setNewReview({...newReview, user: e.target.value})}
                    required 
                  />
                  <select 
                    value={newReview.rating}
                    onChange={e => setNewReview({...newReview, rating: e.target.value})}
                  >
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
                <textarea 
                  placeholder="Your experience..." 
                  value={newReview.comment}
                  onChange={e => setNewReview({...newReview, comment: e.target.value})}
                  required
                />
                <button type="submit" className="submit-review-btn">
                  <Send size={14} /> Post Review
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .reviews-section {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .reviews-list {
          margin-bottom: 1.5rem;
          max-height: 200px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-right: 0.5rem;
        }
        .no-reviews { font-size: 0.8rem; color: var(--text-muted); text-align: center; font-style: italic; }
        .review-item { 
          background: rgba(0,0,0,0.02); 
          padding: 0.75rem; 
          border-radius: 8px;
        }
        .review-header { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; margin-bottom: 0.35rem; }
        .u-icon { width: 20px; height: 20px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; }
        .r-stars { color: #d4a017; font-size: 0.75rem; margin-left: auto; letter-spacing: 1px; }
        .r-comment { font-size: 0.825rem; color: var(--text-main); line-height: 1.4; }
        .r-date { font-size: 0.7rem; color: var(--text-muted); display: block; margin-top: 0.25rem; }

        .add-review-form { display: flex; flex-direction: column; gap: 0.75rem; background: #f8faf8; padding: 1rem; border-radius: 12px; }
        .add-review-form h4 { font-size: 0.9rem; font-weight: 700; color: var(--primary-dark); }
        .form-row { display: flex; gap: 0.5rem; }
        .add-review-form input, .add-review-form select, .add-review-form textarea {
          padding: 0.5rem 0.75rem;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 6px;
          font-family: inherit;
          font-size: 0.8rem;
        }
        .add-review-form textarea { resize: vertical; min-height: 60px; }
        .submit-review-btn {
          display: flex; align-items: center; justify-content: center; gap: 0.4rem;
          padding: 0.6rem; background: var(--primary); color: white;
          border-radius: 6px; font-weight: 700; font-size: 0.8rem;
          cursor: pointer; transition: 0.2s;
        }
        .submit-review-btn:hover { background: var(--primary-dark); }
    
        .product-card {
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: var(--shadow-sm);
          transition: var(--transition-normal);
        }
        .product-card:hover {
          box-shadow: var(--shadow-md);
        }
        .image-container {
          position: relative;
          height: 240px;
          overflow: hidden;
          background: #f0f4f0;
        }
        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .category-tag {
          position: absolute;
          top: 1rem;
          left: 1rem;
          padding: 0.4rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--primary-dark);
        }
        .content {
          padding: var(--space-md);
        }
        .product-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--primary-dark);
          margin-bottom: 0.5rem;
        }
        .rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .rating-text {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .reviews {
          color: var(--text-muted);
          font-weight: 500;
        }
        .product-desc {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          white-space: pre-wrap;
        }
        .product-card:hover .product-desc,
        .product-desc:active {
          -webkit-line-clamp: unset;
          margin-bottom: 1.5rem;
        }
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--space-sm);
          border-top: 1px dashed rgba(0,0,0,0.08);
        }
        .price-box {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }
        .price {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--primary);
        }
        .unit {
          color: var(--text-muted);
          font-size: 0.875rem;
          font-weight: 600;
        }
        .add-cart-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1.1rem;
          border-radius: var(--radius-full);
          background: var(--gradient-primary);
          color: white;
          font-weight: 700;
          font-size: 0.875rem;
          box-shadow: var(--shadow-sm);
          cursor: pointer;
        }
        .add-cart-btn:hover {
          box-shadow: var(--shadow-primary);
        }
        .offer-badge {
          position: absolute;
          top: 1rem;
          right: -5px;
          background: #e11d48;
          color: white;
          padding: 0.5rem 1.25rem;
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-radius: 4px 0 0 4px;
          box-shadow: -2px 2px 10px rgba(225, 29, 72, 0.4);
          z-index: 10;
        }
        .offer-badge::after {
          content: '';
          position: absolute;
          bottom: -5px;
          right: 0;
          border-left: 5px solid #9f1239;
          border-bottom: 5px solid transparent;
        }
      `}</style>
    </motion.div>
  );
};

export default ProductCard;
