import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import ProductCard from '../components/ProductCard'; 
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import styles from '../styles/ProductDetails.module.css';
import { getRequest } from '../utils/apiClient.js';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  
  const productBaseUrl = process.env.REACT_APP_PRODUCT_BASE_URL;
  const fetchProductDetails = () => {
    setLoading(true);
    setFetchError(null);

    getRequest(`${productBaseUrl}/products/${id}`)
      .then((data) => {
        setProduct(data);

      
        return getRequest(
          `${productBaseUrl}/products/category/${encodeURIComponent(data.category)}`
        );
      })
      .then((categoryProducts) => {
        const others = categoryProducts
          .filter((p) => p.id !== Number(id))
          .slice(0, 6);
        setRelated(others);
      })
      .catch((err) => {
        setFetchError(err);
        console.error("Error fetching product details:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
   useEffect(() => {
    fetchProductDetails();
  }, [id, productBaseUrl]);

  if (fetchError) throw fetchError;
  if (loading) return <div className="container page"><Spinner /></div>;
  if (!product) return <div className="container page"><p>Product not found.</p></div>;

  return (
    <div className={styles.detailsPage}>
      <div className={styles.detailsBox}>
        <img className={styles.detailsImg} src={product.image} alt={product.title} />
        <div className={styles.detailsRight}>
          <h2>{product.title}</h2>
          <p className={styles.detailsPrice}>₹{(product.price * 83).toFixed(0)}</p>
          <p className={styles.detailsRating}>★ {product.rating?.rate ?? '4.0'}</p>
          <p className={styles.detailsDesc}>{product.description}</p>
          <div className={styles.detailsBtnRow}>
            <button className={styles.detailsCartBtn} onClick={() => addToCart(product)}>
              🛒 Add to Cart
            </button>
            <button
              className={`${styles.iconBtn} ${isWishlisted(product.id) ? styles.active : ''}`}
              onClick={() => toggleWishlist(product)}
              title={isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              ♥
            </button>
          </div>
        </div>
      </div>

      <h3 className={styles.relatedTitle}>Related Products</h3>
      <div className={styles.relatedGrid}>
        {related.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}