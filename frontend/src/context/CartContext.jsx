import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('ql_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist cart to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem('ql_cart', JSON.stringify(cart));
    } catch {
      /* ignore storage errors */
    }
  }, [cart]);

  const addToCart = (item) => {
    if (item.available === false) return;
    setCart((prev) => {
      const exists = prev.find((i) => i._id === item._id);
      if (exists) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: Math.min(i.quantity + 1, 99) } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((i) => (i._id === id ? { ...i, quantity: Math.min(i.quantity + 1, 99) } : i))
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((i) => (i._id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem('ql_cart');
    } catch {
      /* ignore */
    }
  };

  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, increaseQty, decreaseQty, removeFromCart, clearCart, totalPrice, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
