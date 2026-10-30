import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import styles from "../styles/Home.module.css";
import { getRequest } from "../utils/apiClient";

const categories = [
  { id: "electronics", name: "Electronics", image: "/images/Electronics.webp" },
  { id: "jewelery", name: "Jewelry", image: "/images/Jewelery.webp" },
  { id: "men's clothing", name: "Men", image: "/images/Mens.webp" },
  { id: "women's clothing", name: "Women", image: "/images/Womens.webp" },
];

export default function Home() {
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const productBaseUrl = process.env.REACT_APP_PRODUCT_BASE_URL;
  const fetchRelatedProducts = async () => {
    setError(null);
    setLoading(true);
    getRequest(`${productBaseUrl}/products?limit=8`)
      .then((data) => {
        setRelatedProducts(data);
      })
      .catch((err) => {
        setError("Failed to load products.");
        console.error("Error fetching related products:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRelatedProducts();
  }, [productBaseUrl]);

  const handleCategoryClick = (id) => {
    navigate(`/products?category=${encodeURIComponent(id)}`);
  };

  return (
    <div className={`container ${styles.page}`}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>Shop Smart. Live Better.</h1>
          <p>
            Discover premium products, curated collections, and seamless
            checkout.
          </p>
          <button onClick={() => navigate("/products")}>Start Shopping</button>
        </div>
        <img src="/images/Hero.jpg" alt="Hero" className={styles.heroImage} />
      </section>

      <section className={styles.categories}>
        <h2>Shop by Category</h2>
        <div className={styles.grid}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={styles.card}
              onClick={() => handleCategoryClick(cat.id)}
            >
              <img src={cat.image} alt={cat.name} />
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.related}>
        <h2>Related Products</h2>
        <div className={styles.grid}>
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
