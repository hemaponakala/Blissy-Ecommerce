import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import styles from '../styles/Header.module.css';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const { cartCount,clearCart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const { wishlistCount, clearWishlist } = useWishlist();  

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchTerm = params.get('search');

    if (location.pathname === '/products' && searchTerm) {
      setQuery(searchTerm);
    } else {
      setQuery('');
    }
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${query}`);
    }
  };

  const toggleDropdown = () => setOpen(!open);

  const handleLogout = () => {
    logout();       
    setOpen(false);
    navigate('/');
  };

  useEffect(() => {
    setOpen(false);
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
       
        <Link to="/" className={styles.brand}>Blissy</Link>

        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products or categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        
        <nav className={styles.navLinks}>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/wishlist">Wishlist ({wishlistCount})</NavLink>
          <NavLink to="/cart">🛒 ({cartCount})</NavLink>

          {isAuthenticated ? (
            <div className={styles.userMenu} ref={dropdownRef}>
              <span className={styles.userLabel} onClick={toggleDropdown}>
                Hi, {user?.name || 'User'}
              </span>

              {open && (
                <div className={styles.dropdown}>
                  <NavLink to="/orders">My Orders</NavLink>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Signup</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}