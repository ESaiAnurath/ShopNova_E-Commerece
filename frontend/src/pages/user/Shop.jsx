import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import productService from "../../services/productService";

const badgeColor={"Best Seller":{bg:"#FFD166",color:"#000"},"Trending":{bg:"#FF6B9D",color:"#fff"},"Premium":{bg:"#6C63FF",color:"#fff"},"Deal":{bg:"#3ECFCF",color:"#000"},"New":{bg:"#00C9A7",color:"#fff"},"Low Stock":{bg:"#FF4757",color:"#fff"}};
const statusLabel={"ACTIVE":"Active","LOW_STOCK":"Low Stock","OUT_OF_STOCK":"Out of Stock"};

export default function Shop() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [search,   setSearch]   = useState("");
  const [cat,      setCat]      = useState("All");
  const [sort,     setSort]     = useState("default");
  const [cart,     setCart]     = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [added,    setAdded]    = useState(null);

  // ── Fetch from API ──────────────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAll();
        setProducts(data);
      } catch (e) {
        setError("Could not load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (p) => {
    if (p.status === "OUT_OF_STOCK") return;
    setCart(c => {
      const ex = c.find(i => i.id === p.id);
      return ex ? c.map(i => i.id===p.id ? {...i,qty:i.qty+1} : i) : [...c,{...p,qty:1}];
    });
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1500);
  };

  const toggleWish = (id) => setWishlist(w => w.includes(id) ? w.filter(i=>i!==id) : [...w,id]);
  const discount   = (p)  => p.originalPrice && p.price ? Math.round((1 - p.price/p.originalPrice)*100) : 0;
  const totalItems = cart.reduce((s,i) => s+i.qty, 0);

  // ── Filter & Sort ───────────────────────────────────────
  let filtered = products
    .filter(p => cat==="All" || p.category===cat)
    .filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  if (sort==="low")    filtered = [...filtered].sort((a,b) => a.price-b.price);
  if (sort==="high")   filtered = [...filtered].sort((a,b) => b.price-a.price);
  if (sort==="rating") filtered = [...filtered].sort((a,b) => (b.rating||0)-(a.rating||0));

  // Get unique categories from real products
  const cats = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <div className="shop">
      <UserNavbar cartCount={totalItems}/>
      <div className="layout">

        {/* Sidebar */}
        <aside className="sidebar">
          <h3>Categories</h3>
          {cats.map(c=>(
            <button key={c} className={`fb ${cat===c?"active":""}`} onClick={()=>setCat(c)}>{c}</button>
          ))}
          <h3 style={{marginTop:24}}>Sort By</h3>
          {[["default","Relevance"],["low","Price: Low → High"],["high","Price: High → Low"],["rating","Top Rated"]].map(([v,l])=>(
            <button key={v} className={`fb ${sort===v?"active":""}`} onClick={()=>setSort(v)}>{l}</button>
          ))}
          <div className="fdiv"/>
          <div className="fstat"><span>🛍️</span> {filtered.length} products</div>
          <div className="fstat"><span>❤️</span> {wishlist.length} wishlisted</div>
          <div className="fstat"><span>🛒</span> {totalItems} in cart</div>
        </aside>

        {/* Main */}
        <div className="main">
          <div className="top-bar">
            <div className="sbox">
              <span>🔍</span>
              <input placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <h2>{cat==="All"?"All Products":cat} <span>({filtered.length})</span></h2>
          </div>

          {/* Loading */}
          {loading && (
            <div className="loading">
              <div className="spin"/>
              Loading products...
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="err-box">
              <p>😕 {error}</p>
              <button onClick={() => window.location.reload()}>🔄 Retry</button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div className="empty">
              {products.length === 0
                ? "🛒 No products available yet. Check back soon!"
                : "😕 No products match your search."}
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <div className="pgrid">
              {filtered.map(p=>(
                <div key={p.id} className={`pc ${p.status==="OUT_OF_STOCK"?"oos":""}`}>
                  {p.badge && (
                    <div className="pbadge" style={{background:badgeColor[p.badge]?.bg||"#6C63FF",color:badgeColor[p.badge]?.color||"#fff"}}>
                      {p.badge}
                    </div>
                  )}
                  {discount(p)>0 && <div className="pdisc">-{discount(p)}%</div>}
                  <button className="pwish" onClick={()=>toggleWish(p.id)}>
                    {wishlist.includes(p.id)?"❤️":"🤍"}
                  </button>
                  <div className="piw" onClick={()=>navigate(`/product/${p.id}`)}>
                    {p.image
                      ? <img src={p.image} alt={p.name} className="pi" onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}/>
                      : null
                    }
                    <div className="pfb" style={{display:p.image?"none":"flex"}}>📦</div>
                    {p.status==="OUT_OF_STOCK" && <div className="oos-overlay">Out of Stock</div>}
                    <div className="pov"><button className="pqb">View Details</button></div>
                  </div>
                  <div className="pin">
                    <p className="pcat">{p.category}</p>
                    <h3 className="pnm">{p.name}</h3>
                    <div className="pst">
                      {"★★★★★".split("").map((s,i)=>(
                        <span key={i} style={{color:i<Math.round(p.rating||0)?"#FFD166":"rgba(255,255,255,0.2)",fontSize:12}}>{s}</span>
                      ))}
                      <span className="prn">{p.rating||0}</span>
                    </div>
                    <div className="ppr">
                      <span className="pp">₹{parseFloat(p.price||0).toLocaleString()}</span>
                      {p.originalPrice && <span className="po">₹{parseFloat(p.originalPrice).toLocaleString()}</span>}
                    </div>
                    <button
                      className={`padd ${added===p.id?"ok":""} ${p.status==="OUT_OF_STOCK"?"disabled":""}`}
                      onClick={()=>addToCart(p)}
                      disabled={p.status==="OUT_OF_STOCK"}
                    >
                      {p.status==="OUT_OF_STOCK" ? "Out of Stock" : added===p.id ? "✅ Added!" : "🛒 Add to Cart"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .shop{min-height:100vh;background:#08081a;font-family:'Sora',sans-serif;color:#e0e0f0}
        .layout{display:grid;grid-template-columns:220px 1fr;gap:24px;padding:28px 32px;max-width:1400px;margin:0 auto}
        .sidebar{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:20px;height:fit-content;position:sticky;top:80px}
        .sidebar h3{font-size:12px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px}
        .fb{display:block;width:100%;text-align:left;background:none;border:none;color:rgba(255,255,255,0.5);font-family:'Sora',sans-serif;font-size:13px;padding:8px 10px;border-radius:8px;cursor:pointer;transition:all 0.2s;margin-bottom:2px}
        .fb:hover{background:rgba(255,255,255,0.05);color:#fff}
        .fb.active{background:rgba(108,99,255,0.2);color:#a099ff;font-weight:500}
        .fdiv{height:1px;background:rgba(255,255,255,0.07);margin:16px 0}
        .fstat{display:flex;align-items:center;gap:8px;font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:6px}
        .top-bar{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;gap:16px;flex-wrap:wrap}
        .sbox{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:9px 14px;flex:1;max-width:360px}
        .sbox input{background:none;border:none;color:#fff;font-family:'Sora',sans-serif;font-size:13px;outline:none;width:100%}
        .sbox input::placeholder{color:rgba(255,255,255,0.3)}
        .top-bar h2{font-size:20px;font-weight:700;color:#fff}
        .top-bar span{color:rgba(255,255,255,0.4);font-weight:400}
        .loading{display:flex;align-items:center;justify-content:center;gap:14px;padding:80px;color:rgba(255,255,255,0.4);font-size:15px}
        .spin{width:24px;height:24px;border:3px solid rgba(108,99,255,0.2);border-top-color:#6C63FF;border-radius:50%;animation:spin 0.8s linear infinite;flex-shrink:0}
        @keyframes spin{to{transform:rotate(360deg)}}
        .err-box{background:rgba(255,80,80,0.1);border:1px solid rgba(255,80,80,0.2);border-radius:12px;padding:24px;text-align:center;color:#ff8080}
        .err-box button{margin-top:12px;background:rgba(255,80,80,0.2);border:1px solid rgba(255,80,80,0.3);color:#ff8080;padding:8px 16px;border-radius:8px;font-family:'Sora',sans-serif;font-size:13px;cursor:pointer}
        .empty{padding:80px;text-align:center;color:rgba(255,255,255,0.3);font-size:15px;line-height:1.6}
        .pgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px}
        .pc{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;position:relative;transition:all 0.3s}
        .pc:hover{transform:translateY(-4px);border-color:rgba(108,99,255,0.4);box-shadow:0 16px 40px rgba(0,0,0,0.4)}
        .pc.oos{opacity:0.7}
        .pbadge{position:absolute;top:10px;left:10px;z-index:3;padding:3px 8px;border-radius:20px;font-size:10px;font-weight:700}
        .pdisc{position:absolute;top:10px;right:36px;z-index:3;background:#FF4757;color:#fff;padding:3px 6px;border-radius:6px;font-size:10px;font-weight:700}
        .pwish{position:absolute;top:8px;right:8px;z-index:3;background:rgba(255,255,255,0.1);border:none;border-radius:6px;width:26px;height:26px;cursor:pointer;font-size:12px}
        .piw{height:180px;overflow:hidden;position:relative;cursor:pointer;background:rgba(255,255,255,0.03)}
        .pi{width:100%;height:100%;object-fit:cover;transition:transform 0.4s}
        .pc:hover .pi{transform:scale(1.06)}
        .pfb{width:100%;height:100%;align-items:center;justify-content:center;font-size:48px}
        .oos-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;color:#FF6B9D;font-size:13px;font-weight:600}
        .pov{position:absolute;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.3s}
        .pc:hover .pov{opacity:1}
        .pqb{background:rgba(255,255,255,0.95);color:#000;border:none;padding:7px 14px;border-radius:20px;font-family:'Sora',sans-serif;font-size:12px;font-weight:600;cursor:pointer}
        .pin{padding:12px}
        .pcat{font-size:10px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px}
        .pnm{font-size:13px;font-weight:600;color:#fff;margin-bottom:5px;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}
        .pst{display:flex;align-items:center;gap:1px;margin-bottom:6px}
        .prn{font-size:10px;color:rgba(255,255,255,0.35);margin-left:3px}
        .ppr{display:flex;align-items:center;gap:6px;margin-bottom:8px}
        .pp{font-size:16px;font-weight:700;color:#fff}
        .po{font-size:11px;color:rgba(255,255,255,0.3);text-decoration:line-through}
        .padd{width:100%;background:linear-gradient(135deg,#6C63FF,#3ECFCF);border:none;color:#fff;padding:8px;border-radius:8px;font-family:'Sora',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s}
        .padd.ok{background:linear-gradient(135deg,#00C9A7,#3ECFCF)}
        .padd.disabled{background:rgba(255,255,255,0.1);cursor:not-allowed;color:rgba(255,255,255,0.4)}
        @media(max-width:768px){.layout{grid-template-columns:1fr}.sidebar{position:static}}
      `}</style>
    </div>
  );
}