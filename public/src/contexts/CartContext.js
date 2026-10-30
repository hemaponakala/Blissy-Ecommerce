import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  const userId = user ? (user.email || user.id) : 'guest';
  const storageKey = `cart_${userId}`;

  
  const loadCart = () => {
    const saved = localStorage.getItem(storageKey);
    setItems(saved ? JSON.parse(saved) : []);
  };

  const mergeCarts = (guestCart, userCart) => {
    const merged = [...userCart];
    guestCart.forEach(gItem => {
      const idx = merged.findIndex(i => i.product.id === gItem.product.id);
      if (idx > -1) {
        merged[idx] = { ...merged[idx], qty: merged[idx].qty + gItem.qty };
      } else {
        merged.push(gItem);
      }
    });
    return merged;
  };

  const handleUserCart = () => {
    const guestSaved = localStorage.getItem('cart_guest');
    const userSaved = localStorage.getItem(storageKey);

    const guestCart = guestSaved ? JSON.parse(guestSaved) : [];
    const userCart = userSaved ? JSON.parse(userSaved) : [];

    const merged = mergeCarts(guestCart, userCart);

    localStorage.setItem(storageKey, JSON.stringify(merged));
    localStorage.removeItem('cart_guest');
    setItems(merged);
  };

  const persistCart = (items) => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  };

  useEffect(() => {
    if (user) {
      handleUserCart();
    } else {
      loadCart();
    }
  }, [userId, user]);

  const addToCart = (product, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.product.id === product.id);
      let next;
      if (idx > -1) {
        next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
      } else {
        next = [...prev, { product, qty }];
      }
      persistCart(next);
      return next;
    });
  };

  const removeFromCart = (productId) => {
    setItems(prev => {
      const next = prev.filter(i => i.product.id !== productId);
      persistCart(next);
      return next;
    });
  };

  const updateQty = (productId, qty) => {
    setItems(prev => {
      const next = prev.map(i =>
        i.product.id === productId ? { ...i, qty } : i
      );
      persistCart(next);
      return next;
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(storageKey);
  };


  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPriceINR = items.reduce(
    (sum, i) => sum + i.qty * i.product.price * 83,
    0
  );

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      cartCount,
      totalPriceINR,
    }),
    [items, cartCount, totalPriceINR]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
