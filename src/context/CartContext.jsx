import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // [{product, quantity}]
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) return removeFromCart(productId);
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      isCartOpen, setIsCartOpen, totalItems, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
