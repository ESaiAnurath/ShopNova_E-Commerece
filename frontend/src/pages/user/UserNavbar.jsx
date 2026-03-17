import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UserNavbar({ cartCount = 0 }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate("/home")}>
        <div className="bdot" />
        <span>ShopNova</span>
      </div>

      <div className="nav-links">
        {[
          { label: "🏠 Home",      path: "/home"      },
          { label: "🛍️ Shop",      path: "/shop"      },
          { label: "📦 My Orders", path: "/my-orders" },
          { label: "👤 Profile",   path: "/profile"   },
        ].map(item => (
          <button
            key={item.path}
            className={`nav-link ${isActive(item.path) ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="nav-right">
        <button className="cart-btn" onClick={() => navigate("/cart")}>
          🛒
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
        <div className="user-menu">
          <div className="user-avatar" onClick={() => setMenuOpen(!menuOpen)}>
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          {menuOpen && (
            <div className="dropdown">
              <div className="dd-header">
                <p className="dd-name">{user?.name}</p>
                <p className="dd-email">{user?.email}</p>
              </div>
              <button onClick={() => { navigate("/profile");   setMenuOpen(false); }}>👤 Profile</button>
              <button onClick={() => { navigate("/my-orders"); setMenuOpen(false); }}>📦 My Orders</button>
              <button className="dd-logout" onClick={handleLogout}>⎋ Logout</button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        .navbar{display:flex;align-items:center;gap:20px;padding:14px 40px;background:rgba(8,8,26,0.95);border-bottom:1px solid rgba(255,255,255,0.07);position:sticky;top:0;z-index:200;backdrop-filter:blur(20px);font-family:'Sora',sans-serif}
        .nav-brand{display:flex;align-items:center;gap:10px;cursor:pointer;font-size:20px;font-weight:700;color:#fff;white-space:nowrap}
        .bdot{width:10px;height:10px;background:linear-gradient(135deg,#6C63FF,#3ECFCF);border-radius:50%;box-shadow:0 0 10px #6C63FF;flex-shrink:0}
        .nav-links{display:flex;align-items:center;gap:4px;margin-left:20px}
        .nav-link{background:none;border:none;color:rgba(255,255,255,0.55);font-family:'Sora',sans-serif;font-size:13.5px;padding:8px 14px;border-radius:10px;cursor:pointer;transition:all 0.2s;white-space:nowrap;font-weight:500}
        .nav-link:hover{background:rgba(255,255,255,0.06);color:#fff}
        .nav-link.active{background:rgba(108,99,255,0.15);color:#a099ff}
        .nav-right{display:flex;align-items:center;gap:12px;margin-left:auto}
        .cart-btn{position:relative;background:linear-gradient(135deg,#6C63FF,#3ECFCF);border:none;width:40px;height:40px;border-radius:10px;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform 0.2s}
        .cart-btn:hover{transform:scale(1.05)}
        .cart-badge{position:absolute;top:-6px;right:-6px;background:#FF6B9D;color:#fff;font-size:10px;font-weight:700;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center}
        .user-menu{position:relative}
        .user-avatar{width:38px;height:38px;background:linear-gradient(135deg,#6C63FF,#3ECFCF);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:#fff;cursor:pointer;user-select:none}
        .dropdown{position:absolute;top:48px;right:0;background:#13132a;border:1px solid rgba(255,255,255,0.12);border-radius:14px;padding:8px;min-width:200px;z-index:300;box-shadow:0 20px 60px rgba(0,0,0,0.6);animation:fadeIn 0.2s ease}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        .dd-header{padding:10px 10px 10px;border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:6px}
        .dd-name{font-size:13px;font-weight:600;color:#fff}
        .dd-email{font-size:11px;color:rgba(255,255,255,0.35);margin-top:2px}
        .dropdown button{display:block;width:100%;text-align:left;background:none;border:none;color:rgba(255,255,255,0.65);font-family:'Sora',sans-serif;font-size:13px;padding:9px 10px;border-radius:8px;cursor:pointer;transition:all 0.2s}
        .dropdown button:hover{background:rgba(255,255,255,0.06);color:#fff}
        .dd-logout{color:#FF6B9D!important}
        .dd-logout:hover{background:rgba(255,107,157,0.1)!important}
        @media(max-width:768px){.nav-links{display:none}.navbar{padding:12px 16px}}
      `}</style>
    </nav>
  );
}
