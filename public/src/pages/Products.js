import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import styles from '../styles/Products.module.css';
import {getRequest} from "../utils/apiClient";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

   const location = useLocation();
   const params = new URLSearchParams(location.search);
   const category = params.get('category');
   const search = params.get('search');
   const fetchProducts = () => {
    setLoading(true);
    setFetchError(null);
    getRequest(`${process.env.REACT_APP_PRODUCT_BASE_URL}/products`)
      .then(data => {
        if (category) {
          data = data.filter(
            p => p.category?.toLowerCase() === category.toLowerCase()
          );
        }

        if (search) {
          data = data.filter(
            p => p.title.toLowerCase().includes(search.toLowerCase())
          );
        }

        setProducts(data);
      })
      .catch(err => {
        setFetchError(err);
        console.error('Error fetching products:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
     fetchProducts();
  }, [location.search]);


  const sortedProducts = [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'top-rated') return b.rating?.rate - a.rating?.rate;

    return 0;
  });

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Products</h2>
        <span className={styles.count}>{sortedProducts.length} items found</span>

        <div className={styles.sortBox}>
          <label htmlFor="sort">Sort by</label>
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Select</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
             <option value="top-rated">Top Rated</option>

          </select>
        </div>
      </div>

      <div className={styles.grid}>
        {sortedProducts.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}