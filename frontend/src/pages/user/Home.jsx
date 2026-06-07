import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import productService from "../../services/productService";

const categories = [
  { name: "Electronics", icon: "💻", count: 142, color: "#6C63FF" },
  { name: "Fashion", icon: "👗", count: 89, color: "#FF6B9D" },
  { name: "Home", icon: "🏠", count: 64, color: "#FFD166" },
  { name: "Sports", icon: "⚽", count: 47, color: "#3ECFCF" },
  { name: "Books", icon: "📚", count: 33, color: "#00C9A7" },
  { name: "Beauty", icon: "💄", count: 28, color: "#A29BFE" },
];

const badgeColor = {
  "Best Seller": { bg: "#FFD166", color: "#000" },
  Trending: { bg: "#FF6B9D", color: "#fff" },
  Premium: { bg: "#6C63FF", color: "#fff" },
  Deal: { bg: "#3ECFCF", color: "#000" },
};

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [added, setAdded] = useState(null);

  useEffect(() => {
    productService
      .getAll()
      .then((data) => setProducts(data.slice(0, 6)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (product) => {
    setCart((current) => [...current, product]);
    setAdded(product.id);
    setTimeout(() => setAdded(null), 1500);
  };

  const toggleWish = (id) =>
    setWishlist((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );

  const discount = (product) => Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <div className="home">
      <UserNavbar cartCount={cart.length} />

      <section className="hero">
        <div className="hero-copy">
          <span className="hero-badge">📦 Today's top deals</span>
          <h1>Amazon-style shopping,<br/>built for your store.</h1>
          <p>Discover curated collections, best sellers, and deals across every category with fast delivery and easy returns.</p>
          <div className="hero-actions">
            <button className="button-primary" onClick={() => navigate("/shop")}>Shop today's deals</button>
            <button className="button-secondary" onClick={() => navigate("/my-orders")}>Your orders</button>
          </div>
          <div className="hero-stats">
            <div><strong>60K+</strong><span>Products</span></div>
            <div><strong>1.2M</strong><span>Customers</span></div>
            <div><strong>4.9★</strong><span>Avg. Rating</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&h=900&fit=crop&q=80" alt="Shopping highlights" />
            <div className="hero-chip">Free delivery</div>
            <div className="hero-chip hero-chip--secondary">Best seller</div>
            <div className="hero-chip hero-chip--tertiary">Fast delivery</div>
          </div>
        </div>
      </section>

      <section className="sec categories-section">
        <div className="shead">
          <h2>Categories to explore</h2>
          <button onClick={() => navigate("/shop")}>See all</button>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <button
              key={category.name}
              className="category-card"
              style={{ '--accent': category.color }}
              onClick={() => navigate("/shop")}
            >
              <div className="category-icon">{category.icon}</div>
              <div>
                <div className="category-name">{category.name}</div>
                <div className="category-count">{category.count} items</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="sec highlight-row">
        <div className="highlight-card">
          <h3>Pick up where you left off</h3>
          <div className="highlight-tags">
            <span>Peter England</span>
            <span>NOBERO clothing</span>
          </div>
        </div>
        <div className="highlight-card">
          <h3>Continue shopping deals</h3>
          <div className="highlight-tags">
            <span>Centrino sneakers</span>
            <span>Bacca Bucci shoes</span>
          </div>
        </div>
        <div className="highlight-card">
          <h3>Deals related to saved items</h3>
          <div className="highlight-tags">
            <span>Men's fashion</span>
            <span>Leather slippers</span>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="shead">
          <h2>Featured products</h2>
          <button onClick={() => navigate("/shop")}>See all</button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" /> Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">🛒 No products yet. Check back soon!</div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                {product.badge && (
                  <span className="product-badge" style={{ background: badgeColor[product.badge]?.bg, color: badgeColor[product.badge]?.color }}>
                    {product.badge}
                  </span>
                )}
                <span className="product-discount">-{discount(product)}%</span>
                <button className="wishlist-btn" onClick={() => toggleWish(product.id)}>
                  {wishlist.includes(product.id) ? '❤️' : '🤍'}
                </button>
                <div className="product-image" onClick={() => navigate(`/product/${product.id}`)}>
                  <img src={product.image} alt={product.name} />
                  <div className="product-hover">Quick view</div>
                </div>
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <h3>{product.name}</h3>
                  <div className="product-rating">{product.rating} ★</div>
                  <div className="product-price">
                    <span className="price">₹{product.price.toLocaleString()}</span>
                    <span className="original">₹{product.originalPrice.toLocaleString()}</span>
                  </div>
                  <p className="product-delivery">FREE Delivery by Tomorrow</p>
                  <button className={`add-btn ${added === product.id ? 'added' : ''}`} onClick={() => addToCart(product)}>
                    {added === product.id ? '✅ Added' : '🛒 Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="sec promo-banner">
        <div>
          <h2>Free delivery on orders above ₹999</h2>
          <p>Use code <strong>SHOPNOVA10</strong> for instant savings at checkout.</p>
        </div>
        <button onClick={() => navigate("/shop")}>Shop now</button>
      </section>

      <footer className="foot">
        <div className="footer-brand"><span className="footer-dot" />ShopNova</div>
        <p>© 2026 ShopNova. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Conditions of Use</a>
          <a href="#">Privacy Notice</a>
          <a href="#">Help</a>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .home{min-height:100vh;background:#F3F6F8;font-family:'Roboto',Arial,sans-serif;color:#111}
        .hero{display:grid;grid-template-columns:1.35fr 1fr;gap:32px;padding:24px 28px 8px;align-items:center;max-width:1400px;margin:0 auto}
        .hero-copy{padding-top:12px}
        .hero-badge{display:inline-flex;align-items:center;padding:10px 16px;background:#FF9900;color:#111;border-radius:999px;font-size:13px;font-weight:700;margin-bottom:18px}
        .hero h1{font-size:48px;font-weight:800;line-height:1.05;margin-bottom:18px}
        .hero p{max-width:620px;font-size:16px;color:#4B5563;line-height:1.75;margin-bottom:30px}
        .hero-actions{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:32px}
        .button-primary,.button-secondary{padding:14px 28px;border-radius:999px;border:none;font-size:15px;font-weight:700;cursor:pointer}
        .button-primary{background:#FF9900;color:#111}
        .button-secondary{background:#111;color:#fff}
        .button-primary:hover,.button-secondary:hover{opacity:0.95}
        .hero-stats{display:flex;flex-wrap:wrap;gap:18px}
        .hero-stats div{min-width:120px}
        .hero-stats strong{display:block;font-size:22px;font-weight:800;color:#111}
        .hero-stats span{font-size:13px;color:#6B7280}
        .hero-visual{display:flex;justify-content:center}
        .hero-card{position:relative;border-radius:28px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,0.12);background:#fff}
        .hero-card img{width:100%;height:100%;min-height:480px;object-fit:cover}
        .hero-chip{position:absolute;top:20px;left:20px;background:rgba(255,255,255,0.95);color:#111;padding:10px 16px;border-radius:999px;font-size:13px;font-weight:700;box-shadow:0 12px 30px rgba(0,0,0,0.12)}
        .hero-chip--secondary{top:auto;bottom:20px;left:20px}
        .hero-chip--tertiary{top:20px;right:20px}
        .sec{padding:40px 28px;max-width:1400px;margin:0 auto}
        .shead{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
        .shead h2{font-size:24px;font-weight:800;color:#111}
        .shead button{background:none;border:none;color:#007185;font-size:14px;font-weight:700;cursor:pointer}
        .category-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:18px}
        .category-card{display:flex;align-items:center;gap:16px;padding:24px;border-radius:18px;border:1px solid #E5E7EB;background:#fff;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s}
        .category-card:hover{transform:translateY(-4px);box-shadow:0 20px 40px rgba(0,0,0,0.08)}
        .category-icon{font-size:28px}
        .category-name{font-size:16px;font-weight:700;color:#111}
        .category-count{font-size:13px;color:#6B7280}
        .highlight-row{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .highlight-card{background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:18px;box-shadow:0 18px 45px rgba(0,0,0,0.05)}
        .highlight-card h3{font-size:18px;font-weight:800;color:#111}
        .highlight-tags{display:flex;flex-wrap:wrap;gap:10px}
        .highlight-tags span{background:#F8FAFC;border:1px solid #E5E7EB;border-radius:16px;padding:12px 16px;font-size:14px;color:#111}
        .products-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .product-card{background:#fff;border:1px solid #E5E7EB;border-radius:20px;overflow:hidden;position:relative;transition:transform 0.25s,box-shadow 0.25s}
        .product-card:hover{transform:translateY(-4px);box-shadow:0 24px 55px rgba(0,0,0,0.08)}
        .product-badge{position:absolute;top:16px;left:16px;padding:6px 12px;border-radius:999px;font-size:11px;font-weight:700;z-index:1}
        .product-discount{position:absolute;top:16px;right:16px;padding:6px 10px;border-radius:999px;background:#FF4757;color:#fff;font-size:11px;font-weight:700;z-index:1}
        .wishlist-btn{position:absolute;top:16px;right:70px;width:34px;height:34px;border:none;border-radius:999px;background:#fff;cursor:pointer;box-shadow:0 12px 30px rgba(0,0,0,0.08);font-size:16px;z-index:1}
        .product-image{height:240px;background:#F8FAFC;cursor:pointer;position:relative}
        .product-image img{width:100%;height:100%;object-fit:contain;transition:transform 0.3s}
        .product-card:hover .product-image img{transform:scale(1.05)}
        .product-hover{position:absolute;inset:0;background:rgba(0,0,0,0.44);opacity:0;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;transition:opacity 0.25s}
        .product-card:hover .product-hover{opacity:1}
        .product-info{padding:22px;display:flex;flex-direction:column;gap:12px}
        .product-category{font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#6B7280}
        .product-info h3{font-size:16px;font-weight:700;color:#111;line-height:1.3}
        .product-rating{font-size:14px;color:#F59E0B}
        .product-price{display:flex;align-items:center;gap:10px;font-size:16px}
        .price{font-weight:800;color:#B12704}
        .original{font-size:13px;color:#6B7280;text-decoration:line-through}
        .product-delivery{font-size:13px;color:#6B7280}
        .add-btn{width:100%;padding:14px;border-radius:12px;border:none;background:#FF9900;color:#111;font-size:14px;font-weight:700;cursor:pointer;transition:transform 0.2s,opacity 0.2s}
        .add-btn:hover{opacity:0.95;transform:translateY(-1px)}
        .add-btn.added{background:#00C9A7}
        .promo-banner{display:flex;justify-content:space-between;align-items:center;gap:24px;background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:32px 28px;box-shadow:0 18px 40px rgba(0,0,0,0.05)}
        .promo-banner h2{font-size:22px;font-weight:800;color:#111;margin-bottom:8px}
        .promo-banner p{font-size:15px;color:#4B5563}
        .promo-banner button{padding:14px 28px;border:none;border-radius:999px;background:#FF9900;color:#111;font-weight:700;cursor:pointer}
        .promo-banner button:hover{opacity:0.95}
        .foot{background:#232F3E;color:#fff;padding:30px 40px;margin-top:32px;border-radius:20px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px}
        .footer-brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:16px}
        .footer-dot{width:10px;height:10px;border-radius:50%;background:linear-gradient(135deg,#6C63FF,#3ECFCF)}
        .foot p{margin:0;color:#D1D5DB}
        .footer-links{display:flex;gap:18px;flex-wrap:wrap}
        .footer-links a{color:#D1D5DB;text-decoration:none;font-size:14px}
        .footer-links a:hover{color:#fff}
        .loading-state{display:flex;align-items:center;gap:12px;padding:60px;color:#4B5563;font-size:15px}
        .spinner{width:20px;height:20px;border:3px solid rgba(0,0,0,0.1);border-top-color:#FF9900;border-radius:50%;animation:spin 0.8s linear infinite}
        .empty-state{padding:60px;text-align:center;color:#6B7280;font-size:15px}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:1100px){.products-grid{grid-template-columns:repeat(2,1fr)}.category-grid{grid-template-columns:repeat(3,1fr)}.hero{grid-template-columns:1fr}.hero-visual{display:none}.hero h1{font-size:36px}}
        @media(max-width:800px){.sec{padding:22px 18px}.promo-banner{flex-direction:column;text-align:center}.foot{padding:24px}}
        @media(max-width:600px){.category-grid{grid-template-columns:1fr}.products-grid{grid-template-columns:1fr}.hero{padding:18px 18px 8px}.highlight-row{grid-template-columns:1fr}.hero h1{font-size:32px}}
      `}</style>
    </div>
  );
}
