import { Link } from 'react-router-dom';
import styles from '../styles/NotFound.module.css';

export default function NotFound() {
  return (
    <div className="container page">
      <h2>404 — Page not found</h2>
      <p>We couldn’t find what you’re looking for.</p>
      <Link className={styles.btn} to="/">Go home</Link>
    </div>
  );
}