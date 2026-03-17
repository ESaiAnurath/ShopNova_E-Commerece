import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import productService from "../../services/productService";

const statusColor = { ACTIVE:"#3ECFCF", OUT_OF_STOCK:"#FF6B9D", LOW_STOCK:"#FFD166" };
const statusLabel = { ACTIVE:"Active", OUT_OF_STOCK:"Out of Stock", LOW_STOCK:"Low Stock" };
const badgeColors  = {"Best Seller":{bg:"#FFD166",color:"#000"},"Trending":{bg:"#FF6B9D",color:"#fff"},"Premium":{bg:"#6C63FF",color:"#fff"},"Deal":{bg:"#3ECFCF",color:"#000"},"New":{bg:"#00C9A7",color:"#fff"}};
const navItems = [
  {icon:"◈",label:"Dashboard",path:"/dashboard"},
  {icon:"📦",label:"Products",path:"/products"},
  {icon:"🛒",label:"Orders",path:"/orders"},
  {icon:"👥",label:"Users",path:"/users"},
  {icon:"📊",label:"Analytics",path:"/analytics"},
  {icon:"⚙️",label:"Settings",path:"/settings"},
];

const emptyForm = { name:"", description:"", category:"Electronics", price:"", originalPrice:"", stock:"", image:"", badge:"", rating:"4.5" };

export default function Products() {
  const navigate = useNavigate();
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [search,     setSearch]     = useState("");
  const [filter,     setFilter]     = useState("All");
  const [view,       setView]       = useState("grid");
  const [showModal,  setShowModal]  = useState(false);
  const [editProd,   setEditProd]   = useState(null);
  const [form,       setForm]       = useState(emptyForm);
  const [saving,     setSaving]     = useState(false);
  const [toast,      setToast]      = useState("");
  const [sidebarOpen,setSidebarOpen]= useState(true);

  // ── Load products from API ──────────────────────────────
  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
    } catch (e) {
      setError("Failed to load products. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  // ── Open Add Modal ──────────────────────────────────────
  const openAdd = () => {
    setEditProd(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  // ── Open Edit Modal ─────────────────────────────────────
  const openEdit = (p) => {
    setEditProd(p);
    setForm({
      name:          p.name          || "",
      description:   p.description   || "",
      category:      p.category      || "Electronics",
      price:         p.price         || "",
      originalPrice: p.originalPrice || "",
      stock:         p.stock         || "",
      image:         p.image         || "",
      badge:         p.badge         || "",
      rating:        p.rating        || "4.5",
    });
    setShowModal(true);
  };

  // ── Save (Add or Update) ────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim())  { showToast("❌ Product name is required!"); return; }
    if (!form.price)        { showToast("❌ Price is required!");        return; }

    setSaving(true);
    try {
      const payload = {
        name:          form.name,
        description:   form.description,
        category:      form.category,
        price:         parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        stock:         form.stock ? parseInt(form.stock) : 0,
        image:         form.image,
        badge:         form.badge || null,
        rating:        parseFloat(form.rating) || 4.5,
      };

      if (editProd) {
        await productService.update(editProd.id, payload);
        showToast("✅ Product updated successfully!");
      } else {
        await productService.add(payload);
        showToast("✅ Product added successfully!");
      }

      setShowModal(false);
      fetchProducts(); // refresh list
    } catch (e) {
      showToast("❌ " + e.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await productService.delete(id);
      showToast("✅ Product deleted!");
      fetchProducts();
    } catch (e) {
      showToast("❌ " + e.message);
    }
  };

  // ── Filter ──────────────────────────────────────────────
  const filtered = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.category === filter;
    return matchSearch && matchFilter;
  });

  const discount = (p) => p.originalPrice && p.price
    ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;

  return (
    <div className={`shell ${sidebarOpen?"open":"closed"}`}>
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="bdot"/>
          {sidebarOpen && <span>ShopNova</span>}
          <button className="toggle" onClick={()=>setSidebarOpen(!sidebarOpen)}>{sidebarOpen?"◀":"▶"}</button>
        </div>
        <nav className="snav">
          {navItems.map(item=>(
            <button key={item.path} className={`ni ${location.pathname===item.path?"active":""}`} onClick={()=>navigate(item.path)}>
              <span>{item.icon}</span>
              {sidebarOpen&&<span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="sfooter">
          <div className="savatar">A</div>
          {sidebarOpen&&<div><p className="sname">Admin</p><p className="srole">Administrator</p></div>}
          {sidebarOpen&&<button className="slout" onClick={()=>{localStorage.clear();navigate("/login");}}>⎋</button>}
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* Topbar */}
        <header className="topbar">
          <div className="tleft">
            <button className="back-btn" onClick={() => navigate("/dashboard")}>← Back</button>
            <h1>Products</h1>
          </div>
          <div className="tright">
            <div className="sbox"><span>🔍</span><input placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
            <button className="add-btn" onClick={openAdd}>+ Add Product</button>
          </div>
        </header>

        <div className="content">
          {/* Stats */}
          <div className="mstats">
            <div className="ms"><span>📦</span><div><b>{products.length}</b><p>Total</p></div></div>
            <div className="ms"><span>✅</span><div><b>{products.filter(p=>p.status==="ACTIVE").length}</b><p>Active</p></div></div>
            <div className="ms"><span>⚠️</span><div><b>{products.filter(p=>p.status==="LOW_STOCK").length}</b><p>Low Stock</p></div></div>
            <div className="ms"><span>❌</span><div><b>{products.filter(p=>p.status==="OUT_OF_STOCK").length}</b><p>Out of Stock</p></div></div>
          </div>

          {/* Toolbar */}
          <div className="toolbar">
            <div className="ftabs">
              {["All","Electronics","Fashion","Home","Sports"].map(c=>(
                <button key={c} className={`ftab ${filter===c?"active":""}`} onClick={()=>setFilter(c)}>{c}</button>
              ))}
            </div>
            <div className="vtoggle">
              <button className={view==="grid"?"vb active":"vb"} onClick={()=>setView("grid")}>⊞</button>
              <button className={view==="list"?"vb active":"vb"} onClick={()=>setView("list")}>☰</button>
            </div>
          </div>

          {/* Loading */}
          {loading && <div className="loading"><div className="spinner"/>Loading products...</div>}

          {/* Error */}
          {error && (
            <div className="err-box">
              <p>{error}</p>
              <button onClick={fetchProducts}>🔄 Retry</button>
            </div>
          )}

          {/* GRID VIEW */}
          {!loading && !error && view==="grid" && (
            <div className="pgrid">
              {filtered.map(p=>(
                <div key={p.id} className="pc">
                  {p.badge&&<div className="pbadge" style={{background:badgeColors[p.badge]?.bg,color:badgeColors[p.badge]?.color}}>{p.badge}</div>}
                  {discount(p)>0&&<div className="pdisc">-{discount(p)}%</div>}
                  <div className="pimgw">
                    {p.image
                      ? <img src={p.image} alt={p.name} className="pimg" onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}/>
                      : null
                    }
                    <div className="pfallback" style={{display:p.image?"none":"flex"}}>📦</div>
                  </div>
                  <div className="pinfo">
                    <p className="pcat">{p.category}</p>
                    <h3 className="pnm">{p.name}</h3>
                    <p className="pdesc">{p.description}</p>
                    <div className="ppr">
                      <span className="pp">₹{parseFloat(p.price).toLocaleString()}</span>
                      {p.originalPrice&&<span className="po">₹{parseFloat(p.originalPrice).toLocaleString()}</span>}
                    </div>
                    <div className="pfoot">
                      <span className="psbadge" style={{"--sc":statusColor[p.status]||"#3ECFCF"}}>{statusLabel[p.status]||p.status} ({p.stock})</span>
                      <div className="pacts">
                        <button className="ib edit" onClick={()=>openEdit(p)} title="Edit">✏️</button>
                        <button className="ib del"  onClick={()=>handleDelete(p.id)} title="Delete">🗑️</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length===0&&!loading&&<div className="empty">No products found</div>}
            </div>
          )}

          {/* LIST VIEW */}
          {!loading && !error && view==="list" && (
            <div className="panel">
              <table className="tbl">
                <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {filtered.map(p=>(
                    <tr key={p.id}>
                      <td>
                        <div className="tcell">
                          {p.image&&<img src={p.image} alt={p.name} className="timg" onError={e=>e.target.style.display="none"}/>}
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td><span className="catbadge">{p.category}</span></td>
                      <td className="tprice">₹{parseFloat(p.price).toLocaleString()}</td>
                      <td className={p.stock===0?"red":p.stock<10?"yellow":""}>{p.stock}</td>
                      <td><span className="psbadge" style={{"--sc":statusColor[p.status]||"#3ECFCF"}}>{statusLabel[p.status]||p.status}</span></td>
                      <td>
                        <div className="tacts">
                          <button className="ib edit" onClick={()=>openEdit(p)}>✏️</button>
                          <button className="ib del" onClick={()=>handleDelete(p.id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length===0&&<div className="empty">No products found</div>}
            </div>
          )}
        </div>
      </main>

      {/* ADD/EDIT MODAL */}
      {showModal&&(
        <div className="overlay" onClick={()=>setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="mhead">
              <h2>{editProd?"Edit Product":"Add New Product"}</h2>
              <button onClick={()=>setShowModal(false)}>✕</button>
            </div>
            <div className="mbody">
              <div className="mf"><label>Product Name *</label><input placeholder="e.g. iPhone 15 Pro" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
              <div className="mf"><label>Description</label><input placeholder="Short description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
              <div className="mf"><label>Image URL</label><input placeholder="https://images.unsplash.com/..." value={form.image} onChange={e=>setForm({...form,image:e.target.value})}/></div>
              {form.image&&<div className="imgprev"><img src={form.image} alt="preview" onError={e=>e.target.style.display="none"}/><span>Preview</span></div>}
              <div className="mrow">
                <div className="mf"><label>Category</label>
                  <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                    {["Electronics","Fashion","Home","Sports","Books","Beauty"].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="mf"><label>Badge</label>
                  <select value={form.badge} onChange={e=>setForm({...form,badge:e.target.value})}>
                    <option value="">None</option>
                    {["Best Seller","Trending","Premium","Deal","New"].map(b=><option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="mrow">
                <div className="mf"><label>Price (₹) *</label><input type="number" placeholder="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></div>
                <div className="mf"><label>Original Price (₹)</label><input type="number" placeholder="0" value={form.originalPrice} onChange={e=>setForm({...form,originalPrice:e.target.value})}/></div>
              </div>
              <div className="mrow">
                <div className="mf"><label>Stock</label><input type="number" placeholder="0" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/></div>
                <div className="mf"><label>Rating</label><input type="number" step="0.1" min="0" max="5" placeholder="4.5" value={form.rating} onChange={e=>setForm({...form,rating:e.target.value})}/></div>
              </div>
            </div>
            <div className="mfoot">
              <button className="cbtn" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="sbtn" onClick={handleSave} disabled={saving}>
                {saving ? <span className="spinner sm"/> : (editProd ? "Update Product" : "Add Product")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast&&<div className="toast">{toast}</div>}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .shell{display:flex;min-height:100vh;background:#08081a;font-family:'Sora',sans-serif;color:#e0e0f0}
        .sidebar{width:240px;background:rgba(255,255,255,0.03);border-right:1px solid rgba(255,255,255,0.07);display:flex;flex-direction:column;position:fixed;left:0;top:0;bottom:0;transition:width 0.3s;z-index:100;overflow:hidden}
        .closed .sidebar{width:72px}
        .brand{display:flex;align-items:center;gap:10px;padding:22px 18px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:17px;font-weight:700;color:#fff}
        .bdot{width:10px;height:10px;background:linear-gradient(135deg,#6C63FF,#3ECFCF);border-radius:50%;flex-shrink:0;box-shadow:0 0 10px #6C63FF}
        .toggle{margin-left:auto;background:none;border:none;color:rgba(255,255,255,0.3);cursor:pointer;font-size:11px;flex-shrink:0}
        .snav{flex:1;display:flex;flex-direction:column;gap:4px;padding:16px 10px;overflow-y:auto}
        .ni{display:flex;align-items:center;gap:12px;padding:11px 12px;border-radius:10px;background:none;border:none;color:rgba(255,255,255,0.45);cursor:pointer;font-family:'Sora',sans-serif;font-size:13.5px;font-weight:500;transition:all 0.2s;text-align:left;white-space:nowrap;overflow:hidden}
        .ni:hover{background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.8)}
        .ni.active{background:rgba(108,99,255,0.15);color:#a099ff}
        .sfooter{padding:14px 10px;border-top:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:8px}
        .savatar{width:34px;height:34px;background:linear-gradient(135deg,#6C63FF,#3ECFCF);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;flex-shrink:0}
        .sname{font-size:13px;font-weight:600;color:#fff}
        .srole{font-size:11px;color:rgba(255,255,255,0.35)}
        .slout{background:rgba(255,107,157,0.1);border:1px solid rgba(255,107,157,0.2);color:#FF6B9D;width:30px;height:30px;border-radius:8px;cursor:pointer;font-size:14px;margin-left:auto}
        .main{flex:1;margin-left:240px;transition:margin-left 0.3s;display:flex;flex-direction:column;min-height:100vh}
        .closed .main{margin-left:72px}
        .topbar{display:flex;align-items:center;justify-content:space-between;padding:18px 32px;border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);position:sticky;top:0;z-index:50;backdrop-filter:blur(10px);gap:16px}
        .topbar h1{font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.5px;white-space:nowrap}
        .tleft{display:flex;align-items:center;gap:14px}
        .back-btn{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.6);padding:8px 14px;border-radius:10px;font-family:'Sora',sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:6px;white-space:nowrap}
        .back-btn:hover{background:rgba(108,99,255,0.15);border-color:#6C63FF;color:#a099ff;transform:translateX(-2px)}
        .tright{display:flex;align-items:center;gap:12px}
        .sbox{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:9px 14px}
        .sbox input{background:none;border:none;color:#fff;font-family:'Sora',sans-serif;font-size:13px;outline:none;width:200px}
        .sbox input::placeholder{color:rgba(255,255,255,0.3)}
        .add-btn{background:linear-gradient(135deg,#6C63FF,#3ECFCF);border:none;color:#fff;padding:10px 20px;border-radius:10px;font-family:'Sora',sans-serif;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;transition:all 0.2s}
        .add-btn:hover{opacity:0.9;transform:translateY(-1px)}
        .content{padding:28px 32px}
        .mstats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px}
        .ms{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:16px 18px;display:flex;align-items:center;gap:12px}
        .ms span{font-size:22px}
        .ms b{font-size:20px;font-weight:700;color:#fff;display:block}
        .ms p{font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px}
        .toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;flex-wrap:wrap;gap:10px}
        .ftabs{display:flex;gap:6px;flex-wrap:wrap}
        .ftab{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.5);padding:7px 14px;border-radius:8px;font-family:'Sora',sans-serif;font-size:12px;cursor:pointer;transition:all 0.2s}
        .ftab.active{background:rgba(108,99,255,0.2);border-color:#6C63FF;color:#a099ff}
        .vtoggle{display:flex;gap:4px;background:rgba(255,255,255,0.05);border-radius:8px;padding:3px}
        .vb{background:none;border:none;color:rgba(255,255,255,0.4);padding:6px 10px;border-radius:6px;cursor:pointer;font-size:16px;transition:all 0.2s}
        .vb.active{background:rgba(108,99,255,0.3);color:#a099ff}
        .loading{display:flex;align-items:center;justify-content:center;gap:12px;padding:60px;color:rgba(255,255,255,0.4);font-size:14px}
        .err-box{background:rgba(255,80,80,0.1);border:1px solid rgba(255,80,80,0.3);border-radius:12px;padding:20px;text-align:center;color:#ff8080}
        .err-box button{margin-top:12px;background:rgba(255,80,80,0.2);border:1px solid rgba(255,80,80,0.3);color:#ff8080;padding:8px 16px;border-radius:8px;font-family:'Sora',sans-serif;font-size:13px;cursor:pointer}
        .pgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px}
        .pc{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;position:relative;transition:all 0.3s}
        .pc:hover{transform:translateY(-4px);border-color:rgba(108,99,255,0.4);box-shadow:0 16px 40px rgba(0,0,0,0.4)}
        .pbadge{position:absolute;top:10px;left:10px;z-index:3;padding:3px 8px;border-radius:20px;font-size:10px;font-weight:700}
        .pdisc{position:absolute;top:10px;right:10px;z-index:3;background:#FF4757;color:#fff;padding:3px 7px;border-radius:6px;font-size:10px;font-weight:700}
        .pimgw{height:180px;overflow:hidden;position:relative;background:rgba(255,255,255,0.03)}
        .pimg{width:100%;height:100%;object-fit:cover;transition:transform 0.4s}
        .pc:hover .pimg{transform:scale(1.06)}
        .pfallback{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:50px}
        .pinfo{padding:14px}
        .pcat{font-size:10px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px}
        .pnm{font-size:13px;font-weight:600;color:#fff;margin-bottom:4px;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}
        .pdesc{font-size:11px;color:rgba(255,255,255,0.35);margin-bottom:8px;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}
        .ppr{display:flex;align-items:center;gap:6px;margin-bottom:10px}
        .pp{font-size:16px;font-weight:700;color:#fff}
        .po{font-size:11px;color:rgba(255,255,255,0.3);text-decoration:line-through}
        .pfoot{display:flex;justify-content:space-between;align-items:center}
        .psbadge{font-size:11px;font-weight:600;padding:3px 8px;border-radius:20px;background:color-mix(in srgb,var(--sc) 15%,transparent);color:var(--sc);border:1px solid color-mix(in srgb,var(--sc) 30%,transparent)}
        .pacts{display:flex;gap:5px}
        .ib{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:5px 7px;cursor:pointer;font-size:12px;transition:all 0.2s}
        .ib.edit:hover{background:rgba(108,99,255,0.25);border-color:#6C63FF}
        .ib.del:hover{background:rgba(255,107,157,0.2);border-color:#FF6B9D}
        .panel{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;overflow:hidden}
        .tbl{width:100%;border-collapse:collapse}
        .tbl th{font-size:11px;font-weight:600;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.8px;padding:14px 16px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.06)}
        .tbl td{padding:12px 16px;font-size:13px;color:rgba(255,255,255,0.7);border-bottom:1px solid rgba(255,255,255,0.04)}
        .tbl tr:hover td{background:rgba(255,255,255,0.02)}
        .tcell{display:flex;align-items:center;gap:10px}
        .timg{width:44px;height:44px;object-fit:cover;border-radius:8px;flex-shrink:0}
        .catbadge{background:rgba(108,99,255,0.15);color:#a099ff;padding:3px 10px;border-radius:20px;font-size:11.5px}
        .tprice{font-weight:700;color:#fff}
        .tacts{display:flex;gap:6px}
        .red{color:#FF6B9D!important;font-weight:600}
        .yellow{color:#FFD166!important;font-weight:600}
        .empty{padding:50px;text-align:center;color:rgba(255,255,255,0.3);font-size:14px}
        .overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(4px);padding:20px}
        .modal{background:#13132a;border:1px solid rgba(255,255,255,0.12);border-radius:20px;width:100%;max-width:540px;padding:28px;animation:pop 0.3s ease;max-height:90vh;overflow-y:auto}
        @keyframes pop{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
        .mhead{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px}
        .mhead h2{font-size:18px;font-weight:700;color:#fff}
        .mhead button{background:none;border:none;color:rgba(255,255,255,0.4);font-size:18px;cursor:pointer}
        .mbody{display:flex;flex-direction:column;gap:14px}
        .mrow{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .mf label{display:block;font-size:12px;font-weight:500;color:rgba(255,255,255,0.5);margin-bottom:6px}
        .mf input,.mf select{width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#fff;font-family:'Sora',sans-serif;font-size:13px;padding:10px 12px;border-radius:10px;outline:none;transition:border-color 0.2s}
        .mf input:focus,.mf select:focus{border-color:#6C63FF}
        .mf select option{background:#13132a}
        .imgprev{display:flex;align-items:center;gap:10px;padding:10px;background:rgba(255,255,255,0.04);border-radius:10px}
        .imgprev img{width:56px;height:56px;object-fit:cover;border-radius:8px}
        .imgprev span{font-size:12px;color:rgba(255,255,255,0.4)}
        .mfoot{display:flex;gap:10px;margin-top:22px;justify-content:flex-end}
        .cbtn{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);padding:10px 20px;border-radius:10px;font-family:'Sora',sans-serif;font-size:13px;cursor:pointer}
        .sbtn{background:linear-gradient(135deg,#6C63FF,#3ECFCF);border:none;color:#fff;padding:10px 24px;border-radius:10px;font-family:'Sora',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:8px;transition:opacity 0.2s}
        .sbtn:disabled{opacity:0.6;cursor:not-allowed}
        .spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite}
        .spinner.sm{width:14px;height:14px}
        @keyframes spin{to{transform:rotate(360deg)}}
        .toast{position:fixed;bottom:24px;right:24px;background:#13132a;border:1px solid rgba(255,255,255,0.15);color:#fff;padding:14px 20px;border-radius:12px;font-size:14px;font-weight:500;z-index:2000;box-shadow:0 8px 32px rgba(0,0,0,0.4);animation:slideIn 0.3s ease}
        @keyframes slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:900px){.mstats{grid-template-columns:repeat(2,1fr)}}
      `}</style>
    </div>
  );
}
