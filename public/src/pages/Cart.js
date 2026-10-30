import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom'; 
import styles from '../styles/Cart.module.css';


export default function Cart() {
  const { items, updateQty, removeFromCart, totalPriceINR, clearCart } = useCart();
  const navigate = useNavigate(); 

  return (
    <div className="container page">
      <h2>Your cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className={styles.cartList}>
          {items.map(({ product, qty }) => (
            <div key={product.id} className={styles.cartItem}>
              <div className={`${styles.imageBox} ${styles.sm}`}>
                <img src={product.image} alt={product.title} />
              </div>
              <div className={styles.info}>
                <div className={styles.title}>{product.title}</div>
                <div className={styles.price}>₹{(product.price * 83).toFixed(0)}</div>
                <div className={styles.qtyRow}>
                  <label>Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => updateQty(product.id, Number(e.target.value))}
                  />
                </div>
              </div>
              <button
                className={styles.btnOutline}
                onClick={() => removeFromCart(product.id)}
              >
                Remove
              </button>
            </div>
          ))}

          <div className={styles.cartTotal}>
            <div className={styles.label}>Total</div>
            <div className={styles.amount}>₹{totalPriceINR.toFixed(0)}</div>
          </div>

          <div className={styles.cartActions}>
            <button className={styles.btnOutline} onClick={clearCart}>
              Clear cart
            </button>
            <button
              className={styles.btn}
              onClick={() => navigate('/checkout')} 
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}