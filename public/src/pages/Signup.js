
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Signup.module.css';

export default function Signup() {
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!name || name.length < 2) return 'Please enter your name.';
    if (!email || !email.includes('@')) return 'Please enter a valid email.';
    if (!password || password.length < 6) return 'Password must be at least 6 characters.';
    return null;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setFormError(err);
    setFormError(null);
    setSubmitting(true);

    const defaultAvatar = 'https://i.pravatar.cc/150?u=' + email;

    signup({ name, email, password, avatar: defaultAvatar })
      .then(() => login(email, password))
      .then(() => navigate('/', { replace: true }))
      .catch(error => setFormError(error?.response?.data?.message || error.message))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className={styles.signupBox}>
      <h2 className={styles.title}>Create Account</h2>

      <form className={styles.form} onSubmit={onSubmit}>
        {formError && <div className={styles.formError}>{formError}</div>}

        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={styles.signupBtn} type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Signup'}
        </button>
      </form>

      <p className={styles.loginPrompt}>
        Already have an account?{" "}
        <span onClick={() => navigate('/login')} className={styles.loginLink}>
          Login
        </span>
      </p>
    </div>
  );
}