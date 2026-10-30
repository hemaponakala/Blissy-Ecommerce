import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/Login.module.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ||'/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
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

    login(email, password)
      .then(() => navigate(from, { replace: true }))
      .catch(error => setFormError(error?.response?.data?.message || error.message))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className={styles.loginBox}>
      <h2 className={styles.title}>Welcome Back</h2>

      <form className={styles.form} onSubmit={onSubmit}>
        {formError && <div className={styles.formError}>{formError}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <button className={styles.loginBtn} type="submit" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <p className={styles.signupPrompt}>
        New user? <span onClick={() => navigate('/signup')} className={styles.signupLink}>Create account</span>
      </p>
    </div>
  );
}