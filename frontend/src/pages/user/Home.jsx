import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import productService from "../../services/productService";

const featured = [
  { id:1,  name:"Sony WH-1000XM5",       category:"Electronics", price:24999, originalPrice:32000, rating:4.8, image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80", badge:"Best Seller" },
  { id:2,  name:"Nike Air Max 270",       category:"Fashion",     price:8999,  originalPrice:12000, rating:4.6, image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&q=80", badge:"Trending" },
  { id:3,  name:"Apple Watch Series 9",   category:"Electronics", price:41900, originalPrice:45000, rating:4.9, image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80", badge:"Premium" },
  { id:7,  name:"Nespresso Coffee Maker", category:"Home",        price:12999, originalPrice:16000, rating:4.8, image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&q=80", badge:"Deal" },
  { id:10, name:"Kindle Paperwhite",      category:"Electronics", price:13999, originalPrice:15000, rating:4.9, image:"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&q=80", badge:"Best Seller" },
  { id:11, name:"Adidas Ultraboost 22",   category:"Fashion",     price:14999, originalPrice:18000, rating:4.7, image:"https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop&q=80", badge:"Trending" },
];
const categories = [
  {name:"Electronics",icon:"💻",count:142,color:"#6C63FF"},
  {name:"Fashion",icon:"👗",count:89,color:"#FF6B9D"},
  {name:"Home",icon:"🏠",count:64,color:"#FFD166"},
  {name:"Sports",icon:"⚽",count:47,color:"#3ECFCF"},
  {name:"Books",icon:"📚",count:33,color:"#00C9A7"},
  {name:"Beauty",icon:"💄",count:28,color:"#A29BFE"},
];
const badgeColor={"Best Seller":{bg:"#FFD166",color:"#000"},"Trending":{bg:"#FF6B9D",color:"#fff"},"Premium":{bg:"#6C63FF",color:"#fff"},"Deal":{bg:"#3ECFCF",color:"#000"}};

export default function Home() {
  const navigate=useNavigate();
  const [featured, setFeatured]=useState([]);
  const [loading,  setLoading] =useState(true);
  const [cart,setCart]=useState([]);
  const [wishlist,setWishlist]=useState([]);
  const [added,setAdded]=useState(null);

  // Fetch products from API — show first 6 as featured
  useEffect(() => {
    productService.getAll()
      .then(data => setFeatured(data.slice(0, 6)))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);
  const addToCart=(p)=>{setCart(c=>[...c,p]);setAdded(p.id);setTimeout(()=>setAdded(null),1500);};
  const toggleWish=(id)=>setWishlist(w=>w.includes(id)?w.filter(i=>i!==id):[...w,id]);
  const discount=(p)=>Math.round((1-p.price/p.originalPrice)*100);
  return (
    <div className="home">
      <UserNavbar cartCount={cart.length}/>
      <section className="hero">
        <div className="hl">
          <div className="hbadge">🔥 New Arrivals This Week</div>
          <h1>Shop Everything<br/><span className="grad">You Love</span></h1>
          <p>Discover thousands of products at unbeatable prices. Free delivery on orders above ₹999!</p>
          <div className="hbtns">
            <button className="bp" onClick={()=>navigate("/shop")}>Shop Now →</button>
            <button className="bs" onClick={()=>navigate("/my-orders")}>Track Orders</button>
          </div>
          <div className="hstats">
            <div><b>50K+</b><span>Products</span></div><div className="hdiv"/>
            <div><b>2M+</b><span>Customers</span></div><div className="hdiv"/>
            <div><b>4.9★</b><span>Rating</span></div>
          </div>
        </div>
        <div className="hr">
          <div className="himgw">
            <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=600&fit=crop&q=80" alt="shop"/>
            <div className="fl fl1">🎧 Just Added!</div>
            <div className="fl fl2">⭐ 4.9 Rating</div>
            <div className="fl fl3">🚚 Free Delivery</div>
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="shead"><h2>Shop by Category</h2><button onClick={()=>navigate("/shop")}>View All →</button></div>
        <div className="cgrid">
          {categories.map(c=>(
            <div key={c.name} className="ccard" style={{"--cc":c.color}} onClick={()=>navigate("/shop")}>
              <div className="cicon">{c.icon}</div>
              <p className="cname">{c.name}</p>
              <p className="ccnt">{c.count} items</p>
              <div className="cglow"/>
            </div>
          ))}
        </div>
      </section>
      <section className="sec">
        <div className="shead"><h2>Featured Products</h2><button onClick={()=>navigate("/shop")}>See All →</button></div>
        {loading ? (
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,padding:"60px",color:"rgba(255,255,255,0.4)",fontSize:15}}>
            <div style={{width:22,height:22,border:"3px solid rgba(108,99,255,0.2)",borderTopColor:"#6C63FF",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
            Loading products...
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : featured.length === 0 ? (
          <div style={{padding:"60px",textAlign:"center",color:"rgba(255,255,255,0.3)",fontSize:15}}>
            🛒 No products yet. Check back soon!
          </div>
        ) : (
        <div className="pgrid">
          {featured.map(p=>(
            <div key={p.id} className="pc">
              {p.badge&&<div className="pba" style={{background:badgeColor[p.badge]?.bg,color:badgeColor[p.badge]?.color}}>{p.badge}</div>}
              <div className="pdi">-{discount(p)}%</div>
              <button className="pwi" onClick={()=>toggleWish(p.id)}>{wishlist.includes(p.id)?"❤️":"🤍"}</button>
              <div className="piw" onClick={()=>navigate(`/product/${p.id}`)}>
                <img src={p.image} alt={p.name} className="pi"/>
                <div className="pov"><span>Quick View 👁</span></div>
              </div>
              <div className="pin">
                <p className="pct">{p.category}</p>
                <h3 className="pnm">{p.name}</h3>
                <div className="pst">{"★★★★★".split("").map((s,i)=><span key={i} style={{color:i<Math.round(p.rating)?"#FFD166":"rgba(255,255,255,0.2)",fontSize:13}}>{s}</span>)}<span className="prn">{p.rating}</span></div>
                <div className="ppr"><span className="pp">₹{parseFloat(p.price||0).toLocaleString()}</span>{p.originalPrice&&<span className="po">₹{parseFloat(p.originalPrice).toLocaleString()}</span>}</div>
                <button className={`pad ${added===p.id?"ok":""}`} onClick={()=>addToCart(p)}>{added===p.id?"✅ Added!":"🛒 Add to Cart"}</button>
              </div>
            </div>
          ))}
        </div>
        )}
      </section>
      <section className="sec">
        <div className="promo">
          <div><h2>🚚 Free Delivery on Orders Above ₹999!</h2><p>Use code <b>SHOPNOVA10</b> for 10% off</p></div>
          <button onClick={()=>navigate("/shop")}>Shop Now →</button>
        </div>
      </section>
      <footer className="foot">
        <div className="fb"><div className="fbd"/>ShopNova</div>
        <p>© 2026 ShopNova. All rights reserved.</p>
        <div className="fls"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a></div>
      </footer>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .home{min-height:100vh;background:#08081a;font-family:'Sora',sans-serif;color:#e0e0f0}
        .hero{display:grid;grid-template-columns:1fr 1fr;gap:40px;padding:60px 40px;align-items:center;max-width:1400px;margin:0 auto}
        .hbadge{display:inline-block;background:rgba(108,99,255,0.2);border:1px solid rgba(108,99,255,0.4);color:#a099ff;padding:6px 14px;border-radius:20px;font-size:13px;margin-bottom:20px}
        .hl h1{font-size:52px;font-weight:800;color:#fff;letter-spacing:-2px;line-height:1.1;margin-bottom:16px}
        .grad{background:linear-gradient(135deg,#6C63FF,#3ECFCF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .hl p{font-size:16px;color:rgba(255,255,255,0.5);line-height:1.6;margin-bottom:28px}
        .hbtns{display:flex;gap:12px;margin-bottom:36px}
        .bp{background:linear-gradient(135deg,#6C63FF,#3ECFCF);border:none;color:#fff;padding:14px 28px;border-radius:12px;font-family:'Sora',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.2s}
        .bp:hover{opacity:0.9;transform:translateY(-2px)}
        .bs{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.8);padding:14px 28px;border-radius:12px;font-family:'Sora',sans-serif;font-size:15px;cursor:pointer}
        .bs:hover{background:rgba(255,255,255,0.1)}
        .hstats{display:flex;align-items:center;gap:20px}
        .hstats b{display:block;font-size:22px;font-weight:700;color:#fff}
        .hstats span{font-size:12px;color:rgba(255,255,255,0.4)}
        .hdiv{width:1px;height:32px;background:rgba(255,255,255,0.15)}
        .himgw{position:relative;border-radius:24px;overflow:hidden;aspect-ratio:1}
        .himgw img{width:100%;height:100%;object-fit:cover}
        .fl{position:absolute;background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:8px 14px;border-radius:12px;font-size:12px;font-weight:600}
        .fl1{top:20px;left:20px;animation:bob 3s ease-in-out infinite}
        .fl2{bottom:60px;right:20px;animation:bob 3s ease-in-out infinite 1s}
        .fl3{bottom:20px;left:20px;animation:bob 3s ease-in-out infinite 2s}
        @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .sec{padding:40px;max-width:1400px;margin:0 auto}
        .shead{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
        .shead h2{font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.5px}
        .shead button{background:none;border:none;color:#6C63FF;font-family:'Sora',sans-serif;font-size:14px;font-weight:500;cursor:pointer}
        .cgrid{display:grid;grid-template-columns:repeat(6,1fr);gap:14px}
        .ccard{position:relative;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:22px 16px;text-align:center;cursor:pointer;transition:all 0.3s;overflow:hidden}
        .ccard:hover{transform:translateY(-4px);border-color:var(--cc)}
        .cicon{font-size:32px;margin-bottom:10px}
        .cname{font-size:13px;font-weight:600;color:#fff;margin-bottom:4px}
        .ccnt{font-size:11px;color:rgba(255,255,255,0.4)}
        .cglow{position:absolute;top:-20px;right:-20px;width:60px;height:60px;background:var(--cc);border-radius:50%;filter:blur(30px);opacity:0;transition:opacity 0.3s}
        .ccard:hover .cglow{opacity:0.25}
        .pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .pc{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:18px;overflow:hidden;position:relative;transition:all 0.3s}
        .pc:hover{transform:translateY(-6px);border-color:rgba(108,99,255,0.4);box-shadow:0 20px 60px rgba(0,0,0,0.4)}
        .pba{position:absolute;top:12px;left:12px;z-index:3;padding:4px 10px;border-radius:20px;font-size:10px;font-weight:700}
        .pdi{position:absolute;top:12px;right:38px;z-index:3;background:#FF4757;color:#fff;padding:3px 7px;border-radius:6px;font-size:10px;font-weight:700}
        .pwi{position:absolute;top:10px;right:10px;z-index:3;background:rgba(255,255,255,0.1);border:none;border-radius:7px;width:28px;height:28px;cursor:pointer;font-size:14px}
        .piw{height:210px;overflow:hidden;position:relative;cursor:pointer}
        .pi{width:100%;height:100%;object-fit:cover;transition:transform 0.4s}
        .pc:hover .pi{transform:scale(1.06)}
        .pov{position:absolute;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.3s}
        .pc:hover .pov{opacity:1}
        .pov span{background:rgba(255,255,255,0.95);color:#000;padding:8px 18px;border-radius:20px;font-size:13px;font-weight:600}
        .pin{padding:16px}
        .pct{font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:5px}
        .pnm{font-size:14px;font-weight:600;color:#fff;margin-bottom:6px;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}
        .pst{display:flex;align-items:center;gap:1px;margin-bottom:8px}
        .prn{font-size:11px;color:rgba(255,255,255,0.4);margin-left:4px}
        .ppr{display:flex;align-items:center;gap:8px;margin-bottom:12px}
        .pp{font-size:18px;font-weight:700;color:#fff}
        .po{font-size:12px;color:rgba(255,255,255,0.3);text-decoration:line-through}
        .pad{width:100%;background:linear-gradient(135deg,#6C63FF,#3ECFCF);border:none;color:#fff;padding:10px;border-radius:10px;font-family:'Sora',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s}
        .pad.ok{background:linear-gradient(135deg,#00C9A7,#3ECFCF)}
        .promo{background:linear-gradient(135deg,rgba(108,99,255,0.25),rgba(62,207,207,0.25));border:1px solid rgba(108,99,255,0.3);border-radius:20px;padding:36px 40px;display:flex;justify-content:space-between;align-items:center;gap:20px}
        .promo h2{font-size:22px;font-weight:700;color:#fff;margin-bottom:6px}
        .promo p{color:rgba(255,255,255,0.55);font-size:14px}
        .promo b{color:#FFD166}
        .promo button{background:linear-gradient(135deg,#6C63FF,#3ECFCF);border:none;color:#fff;padding:12px 28px;border-radius:10px;font-family:'Sora',sans-serif;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap}
        .foot{border-top:1px solid rgba(255,255,255,0.07);padding:24px 40px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;font-family:'Sora',sans-serif}
        .fb{display:flex;align-items:center;gap:8px;font-size:16px;font-weight:700;color:#fff}
        .fbd{width:10px;height:10px;background:linear-gradient(135deg,#6C63FF,#3ECFCF);border-radius:50%}
        .foot p{font-size:13px;color:rgba(255,255,255,0.3)}
        .fls{display:flex;gap:16px}
        .fls a{font-size:13px;color:rgba(255,255,255,0.4);text-decoration:none}
        .fls a:hover{color:#6C63FF}
        @media(max-width:1100px){.pgrid{grid-template-columns:repeat(2,1fr)}.cgrid{grid-template-columns:repeat(3,1fr)}.hero{grid-template-columns:1fr}.hr{display:none}.hl h1{font-size:36px}}
        @media(max-width:600px){.sec{padding:20px}.pgrid{grid-template-columns:1fr}.cgrid{grid-template-columns:repeat(2,1fr)}.promo{flex-direction:column;text-align:center}}
      `}</style>
    </div>
  );
}