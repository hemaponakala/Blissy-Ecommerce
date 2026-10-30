import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddress } from '../contexts/AddressContext';
import styles from '../styles/AddAddress.module.css';

export default function AddAddress() {
  const navigate = useNavigate();
  const { saveAddress } = useAddress();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    pincode: '',
    city: '',
    state: '',
    street: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const hasEmpty = Object.values(form).some(val => !val.trim());
    if (hasEmpty) {
      setError('All fields are required');
      return;
    }
    saveAddress(form);   
    navigate('/checkout'); 
  };

  return (
    <div className={styles.addressBox}>
      <h2 className={styles.sectionTitle}>Add Address</h2>

      {error && <p className={styles.error}>{error}</p>}

      <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
      <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
      <input type="text" name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} />
      <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} />
      <input type="text" name="state" placeholder="State" value={form.state} onChange={handleChange} />
      <input type="text" name="street" placeholder="Street" value={form.street} onChange={handleChange} />

      <button className={styles.saveBtn} onClick={handleSave}>
        Save Address
      </button>
    </div>
  );
}
