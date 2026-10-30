import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Payment.module.css';

export default function Payment() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
 
    const hasEmpty = Object.values(form).some(val => !val.trim());
    if (hasEmpty) {
      return 'All fields are required';
    }

    
    if (!/^[A-Za-z ]+$/.test(form.name)) {
      return 'Card holder name must contain only letters';
    }
    if (!/^\d{16}$/.test(form.cardNumber.replace(/\s+/g, ''))) {
      return 'Card number must be 16 digits';
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) {
      return 'Expiry must be in MM/YY format';
    }
    if (!/^\d{3}$/.test(form.cvv)) {
      return 'CVV must be 3 digits';
    }

    return '';
  };

  const handlePayment = (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    alert('Payment successful!');
    navigate('/orders');
  };

  return (
    <div className={`container ${styles.page}`}>
      <h2 className={styles.title}>Payment</h2>
      <form className={styles.form} onSubmit={handlePayment}>
        
      
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.formRow}>
          <label>Card Holder Name</label>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formRow}>
          <label>Card Number</label>
          <input
            type="text"
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={form.cardNumber}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inlineRow}>
          <div className={styles.halfField}>
            <label>Expiry Date</label>
            <input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              value={form.expiry}
              onChange={handleChange}
            />
          </div>
          <div className={styles.halfField}>
            <label>CVV</label>
            <input
              type="password"
              name="cvv"
              placeholder="•••"
              value={form.cvv}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.payRow}>
          <button className={styles.btn} type="submit">Pay Now</button>
        </div>
      </form>
    </div>
  );
}
