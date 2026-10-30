import { useWishlist } from '../contexts/WishlistContext';
import ProductCard from '../components/ProductCard';
import styles from '../styles/Wishlist.module.css';


export default function Wishlist() {
  const { wishlistItems } = useWishlist();

  return (
    <div className="container page">
      <h2>Your wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p>No items wishlisted yet.</p>
      ) : (
        <div className={styles.grid}>
          {wishlistItems.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}