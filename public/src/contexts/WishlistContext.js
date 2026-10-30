import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [ids, setIds] = useState([]);
  const [map, setMap] = useState({});

  const userId = user ? user.email : 'guest';
  const storageKey = `wishlist_${userId}`;

  const loadWishlist = (key) => {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      setIds(parsed.map(p => p.id));
      const mapObj = {};
      parsed.forEach(p => { mapObj[p.id] = p; });
      setMap(mapObj);
    } else {
      setIds([]);
      setMap({});
    }
  };

  useEffect(() => {
    if (user) {
     
      const guestSaved = localStorage.getItem('wishlist_guest');
      const userSaved = localStorage.getItem(storageKey);

      const guestWishlist = guestSaved ? JSON.parse(guestSaved) : [];
      const userWishlist = userSaved ? JSON.parse(userSaved) : [];

      const merged = [...userWishlist];
      guestWishlist.forEach(gItem => {
        if (!merged.find(i => i.id === gItem.id)) {
          merged.push(gItem);
        }
      });

      localStorage.setItem(storageKey, JSON.stringify(merged));
      localStorage.removeItem('wishlist_guest');

      setIds(merged.map(p => p.id));
      const mapObj = {};
      merged.forEach(p => { mapObj[p.id] = p; });
      setMap(mapObj);
    } else {
   
      loadWishlist('wishlist_guest');
    }
  }, [userId, user]);

  const persistWishlist = (items) => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  };

  const isWishlisted = (id) => ids.includes(id);

  const toggleWishlist = (product) => {
    if (ids.includes(product.id)) {
      const newIds = ids.filter(x => x !== product.id);
      const { [product.id]: _, ...rest } = map;
      setIds(newIds);
      setMap(rest);
      persistWishlist(newIds.map(id => rest[id]).filter(Boolean));
    } else {
      const newIds = [...ids, product.id];
      const newMap = { ...map, [product.id]: product };
      setIds(newIds);
      setMap(newMap);
      persistWishlist(newIds.map(id => newMap[id]));
    }
  };

  const clearWishlist = () => {
    setIds([]);
    setMap({});
    localStorage.removeItem(storageKey);
  };

  const wishlistCount = ids.length;
  const wishlistItems = ids.map(id => map[id]).filter(Boolean);

  const value = useMemo(() => ({
    isWishlisted,
    toggleWishlist,
    wishlistCount,
    wishlistItems,
    clearWishlist,
  }), [ids, map]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  return useContext(WishlistContext);
}