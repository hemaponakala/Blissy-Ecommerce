import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AddressContext = createContext(null);

export function AddressProvider({ children }) {
  const { user } = useAuth();
  const [address, setAddress] = useState(null);

  const userId = user ? (user.id || user.email) : 'guest';

  const loadAddress = () => {
    const saved = localStorage.getItem(`address_${userId}`);
    if (saved) {
      setAddress(JSON.parse(saved));
    } else {
      setAddress(null);
    }
  };

  useEffect(() => {
    loadAddress();
  }, [userId]);

  const saveAddress = (addr) => {
    localStorage.setItem(`address_${userId}`, JSON.stringify(addr));
    setAddress(addr);
  };

  const clearAddress = () => {
    localStorage.removeItem(`address_${userId}`);
    setAddress(null);
  };

  const value = {
    address,
    saveAddress,
    clearAddress,
  };

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
}

export const useAddress = () => useContext(AddressContext);
