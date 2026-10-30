import { useOrders } from '../contexts/OrdersContext'; 
import styles from '../styles/Orders.module.css';

export default function Orders() {
  const { orders } = useOrders();

  return (
    <div className={`container ${styles.page}`}>
      <h2 className={styles.title}>My Orders</h2>

      {orders.length === 0 ? (
        <p className={styles.empty}>No orders yet.</p>
      ) : (
        <div className={styles.orderList}>
          {orders.map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <span className={styles.orderId}>Order #{order.id}</span>
                <span className={styles.orderDate}>{order.date}</span>
              </div>

              <div className={styles.orderItems}>
                {order.items.map(item => (
                  <div key={item.product.id} className={styles.itemRow}>
                    <img src={item.product.image} alt={item.product.title} className={styles.itemImg} />
                    <div className={styles.itemInfo}>
                      <span className={styles.itemTitle}>{item.product.title}</span>
                      <span className={styles.itemQty}>Qty: {item.qty}</span>
                    </div>
                    <span className={styles.itemPrice}>
                      ₹{(item.product.price * 83 * item.qty).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}