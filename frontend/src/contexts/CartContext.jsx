import { useState, useEffect, useCallback } from 'react';
import { CartContext } from './CartContextValue.jsx';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    // Load cart from localStorage on mount
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product) => {
    let action = 'added';
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        action = 'updated';
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      action = 'added';
      return [...current, { ...product, quantity: 1 }];
    });
    return action;
  }, []);

  const removeFromCart = useCallback((id) => {
    let removedItem;
    setItems((current) => {
      removedItem = current.find((item) => item.id === id);
      return current.filter((item) => item.id !== id);
    });
    return removedItem;
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) {
      const removedItem = removeFromCart(id);
      return { removedItem, quantity: 0 };
    }
    let updatedItem;
    setItems((current) =>
      current.map((item) => {
        if (item.id === id) {
          updatedItem = { ...item, quantity };
          return updatedItem;
        }
        return item;
      })
    );
    return { updatedItem, quantity };
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    let hadItems = false;
    setItems((current) => {
      hadItems = current.length > 0;
      return [];
    });
    return hadItems;
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

