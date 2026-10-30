import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const OrdersContext = createContext();

export function OrdersProvider({ children }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const userId = user ? user.email : 'guest';
  const storageKey = `orders_${userId}`;


  const loadOrders = () => {
    setLoading(true);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setOrders(JSON.parse(saved));
      } else {
        setOrders([]);
      }
    } catch (err) {
      setError(err);
      console.error('Error loading orders from localStorage:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [userId]);

  const persistOrders = (items) => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  };

  const addOrder = (order) => {
    try {
      const newOrders = [...orders, order];
      setOrders(newOrders);
      persistOrders(newOrders);
    } catch (err) {
      setError(err);
      console.error('Error saving order to localStorage:', err);
    }
  };

  const clearOrders = () => {
    try {
      setOrders([]);
      localStorage.removeItem(storageKey);
    } catch (err) {
      setError(err);
      console.error('Error clearing orders from localStorage:', err);
    }
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder, clearOrders, loading, error }}>
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => useContext(OrdersContext);
