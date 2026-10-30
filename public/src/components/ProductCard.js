import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import styles from '../styles/ProductCard.module.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  return (
    <div className={styles.productCard}>
      <Link to={`/product/${product.id}`} className={styles.productMedia}>
        <div className={styles.imageBox}>
          <img src={product.image} alt={product.title} />
        </div>
      </Link>

      <div className={styles.productInfo}>
        <Link to={`/product/${product.id}`} className={styles.productTitle}>{product.title}</Link>
        <div className={styles.productMeta}>
          <span className={styles.price}>₹{(product.price * 83).toFixed(0)}</span>
          <span className={styles.rating}>★ {product.rating?.rate ?? '4.0'}</span>
        </div>
        <div className={styles.actions}>
          <button className={styles.btn} onClick={() => addToCart(product)}>Add to cart</button>
          <button
            className={`${styles.iconBtn} ${isWishlisted(product.id) ? styles.active : ''}`}
            aria-label="Toggle wishlist"
            onClick={() => toggleWishlist(product)}
            title={isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            ♥
          </button>
        </div>
      </div>
    </div>
  );
}