import { useCart } from '../contexts/CartContext';
import { useAddress } from '../contexts/AddressContext';
import { useOrders } from '../contexts/OrdersContext';  
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from '../styles/Checkout.module.css';

export default function Checkout() {
  const { items, totalPriceINR, clearCart } = useCart();
  const { address } = useAddress();
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);


  const redirectIfNoAddress = () => {
    if (!address) {
      navigate('/add-address');
    }
  };

  useEffect(() => {
    redirectIfNoAddress();
  }, [address, navigate]);

  if (!address) {
    return (
      <div className={`container ${styles.page}`}>
        <h2 className={styles.title}>Redirecting to Add Address...</h2>
      </div>
    );
  }

  const handleProceedToPay = async () => {
    setSubmitting(true);

    const newOrder = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      status: 'Pending',
      address,
      items,
      total: totalPriceINR.toFixed(0),
    };

    try {
      await addOrder(newOrder);
      clearCart();
      navigate('/payment');
    } catch (err) {
      console.error('Error adding order:', err);
      navigate('/payment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`container ${styles.page}`}>
      <h2 className={styles.title}>Checkout</h2>

      <div className={styles.addressBox}>
        <h3 className={styles.sectionTitle}>Delivery Address</h3>
        <p className={styles.addressLine}><strong>{address.name}</strong></p>
        <p className={styles.addressLine}>{address.street}</p>
        <p className={styles.addressLine}>
          {address.city}, {address.state} - {address.pincode}
        </p>
        <p className={styles.addressLine}>{address.phone}</p>
        <button
          className={styles.editBtn}
          onClick={() => navigate('/add-address')}
        >
          Edit Address
        </button>
      </div>

      <div className={styles.summaryBox}>
        <h3 className={styles.sectionTitle}>Order Summary</h3>
        <ul className={styles.itemList}>
          {items.map(({ product, qty }) => (
            <li key={product.id} className={styles.summaryItem}>
              <div className={styles.summaryLeft}>
                <img
                  src={product.image}
                  alt={product.title}
                  className={styles.summaryImg}
                />
                <span className={styles.summaryTitle}>
                  {product.title} × {qty}
                </span>
              </div>
              <span className={styles.summaryPrice}>
                ₹{(product.price * 83 * qty).toFixed(0)}
              </span>
            </li>
          ))}
        </ul>
        <div className={styles.totalRow}>
          <span>Total:</span>
          <span>₹{totalPriceINR.toFixed(0)}</span>
        </div>

        <div className={styles.actionRow}>
          <button
            className={styles.backBtn}
            onClick={() => navigate('/cart')}
            disabled={submitting}
          >
            Back to Cart
          </button>
          <button
            className={styles.payBtn}
            onClick={handleProceedToPay}
            disabled={submitting || items.length === 0}
          >
            {submitting ? 'Processing...' : 'Proceed to Pay'}
          </button>
        </div>
      </div>
    </div>
  );
}