// src/context/CartContext.js
import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addToCart = (product, options) => {
    // options: { color, size, quantity }
    const key = product._id + options.color + options.size;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key
            ? { ...i, quantity: i.quantity + options.quantity }
            : i
        );
      }
      return [...prev, { key, product, ...options }];
    });
  };

  const removeFromCart = (key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  };

  const updateQuantity = (key, quantity) => {
    setItems((prev) =>
      prev.map((i) =>
        i.key === key ? { ...i, quantity: Number(quantity) } : i
      )
    );
  };

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [items]
  );

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        subtotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
