import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navChips = ["All", "Fresh", "Bestsellers", "Prime", "Mobiles", "Fashion", "Electronics"];

export default function UserNavbar({ cartCount = 0 }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.name ? user.name.split(" ")[0] : "Customer";

  return (
    <nav className="navbar">
      <div className="nav-top">
        <div className="brand-block" onClick={() => navigate("/home")}> 
          <span className="brand-logo">S</span>
          <div>
            <div className="brand-name">ShopNova</div>
            <div className="brand-sub">Delivering value every day</div>
          </div>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search ShopNova"
            className="search-box"
          />
          <button className="search-btn">🔍</button>
        </div>

        <div className="nav-actions">
          <button className="location-pill">
            Deliver to <strong>{displayName}</strong>
            <span>Warangal 506001</span>
          </button>

          <button className="action-pill" onClick={() => navigate("/profile")}> 
            <span className="action-label">Hello, {displayName}</span>
            <span className="action-sub">Account & Lists</span>
          </button>

          <button className="action-pill" onClick={() => navigate("/my-orders")}> 
            <span className="action-label">Returns</span>
            <span className="action-sub">& Orders</span>
          </button>

          <button className="cart-btn" onClick={() => navigate("/cart")}> 
            <span className="cart-icon">🛒</span>
            <span className="cart-label">Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          <div className="user-menu">
            <button className="user-avatar" onClick={() => setMenuOpen((open) => !open)}>
              {displayName[0].toUpperCase()}
            </button>
            {menuOpen && (
              <div className="dropdown">
                <div className="dd-header">
                  <p className="dd-name">{user?.name || "Guest"}</p>
                  <p className="dd-email">{user?.email || "guest@example.com"}</p>
                </div>
                <button onClick={() => { navigate("/profile"); setMenuOpen(false); }}>Profile</button>
                <button onClick={() => { navigate("/my-orders"); setMenuOpen(false); }}>My Orders</button>
                <button className="dd-logout" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="nav-bottom">
        {navChips.map((label) => (
          <button key={label} className="nav-chip">{label}</button>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
        .navbar{
          position:sticky;
          top:0;
          z-index:999;
          width:100%;
          background:#131921;
          color:#fff;
          font-family:'Roboto',sans-serif;
          box-shadow:0 3px 12px rgba(0,0,0,0.15);
        }
        .nav-top{
          display:flex;
          align-items:center;
          gap:16px;
          padding:12px 22px;
          flex-wrap:wrap;
        }
        .brand-block{
          display:flex;
          align-items:center;
          gap:12px;
          cursor:pointer;
          min-width:220px;
        }
        .brand-logo{
          width:44px;
          height:44px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:22px;
          font-weight:700;
          color:#131921;
          background:#FEBD69;
          border-radius:8px;
        }
        .brand-name{font-size:18px;font-weight:700;letter-spacing:-0.3px;}
        .brand-sub{font-size:12px;color:rgba(255,255,255,0.75);}
        .search-container{
          flex:1;
          display:flex;
          min-width:260px;
          max-width:720px;
          background:#fff;
          border-radius:8px;
          overflow:hidden;
          box-shadow:0 2px 10px rgba(0,0,0,0.08);
        }
        .search-box{
          flex:1;
          border:none;
          outline:none;
          padding:0 14px;
          font-size:14px;
          color:#111;
          min-width:0;
        }
        .search-box::placeholder{color:#757575;}
        .search-btn{
          width:56px;
          border:none;
          background:#FEBD69;
          color:#111;
          cursor:pointer;
          font-size:16px;
        }
        .nav-actions{
          display:flex;
          align-items:center;
          gap:10px;
          flex-wrap:wrap;
          justify-content:flex-end;
          min-width:260px;
        }
        .location-pill,
        .action-pill{
          display:flex;
          flex-direction:column;
          align-items:flex-start;
          gap:2px;
          padding:10px 12px;
          background:rgba(255,255,255,0.08);
          border:1px solid rgba(255,255,255,0.12);
          border-radius:8px;
          color:#fff;
          cursor:pointer;
          min-width:120px;
          text-align:left;
        }
        .location-pill strong,
        .action-label{font-weight:700;}
        .location-pill span,
        .action-sub{font-size:11px;color:rgba(255,255,255,0.72);}
        .cart-btn{
          position:relative;
          display:flex;
          align-items:center;
          gap:8px;
          background:#FEBD69;
          border:none;
          color:#111;
          padding:10px 14px;
          border-radius:8px;
          cursor:pointer;
          font-weight:700;
          white-space:nowrap;
        }
        .cart-badge{
          position:absolute;
          top:-7px;
          right:-7px;
          background:#ff4d4d;
          color:#fff;
          width:20px;
          height:20px;
          border-radius:50%;
          display:grid;
          place-items:center;
          font-size:12px;
        }
        .user-menu{position:relative;}
        .user-avatar{
          width:42px;
          height:42px;
          border-radius:50%;
          background:#232F3E;
          border:1px solid rgba(255,255,255,0.16);
          color:#fff;
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          font-weight:700;
        }
        .dropdown{
          position:absolute;
          top:54px;
          right:0;
          background:#fff;
          min-width:220px;
          border-radius:10px;
          box-shadow:0 20px 50px rgba(0,0,0,0.15);
          overflow:hidden;
          z-index:10;
        }
        .dd-header{padding:16px;border-bottom:1px solid #f1f1f1;}
        .dd-name{color:#111;font-weight:700;}
        .dd-email{color:#666;font-size:13px;margin-top:4px;}
        .dropdown button{width:100%;padding:12px 16px;border:none;background:#fff;text-align:left;cursor:pointer;color:#111;font-size:14px;}
        .dropdown button:hover{background:#f7f7f7;}
        .dd-logout{color:#d93025;font-weight:700;}
        .nav-bottom{
          display:flex;
          align-items:center;
          gap:10px;
          padding:10px 22px 14px;
          overflow-x:auto;
          border-top:1px solid rgba(255,255,255,0.08);
        }
        .nav-chip{
          padding:10px 12px;
          border-radius:999px;
          border:1px solid rgba(255,255,255,0.16);
          background:rgba(255,255,255,0.08);
          color:#fff;
          white-space:nowrap;
          cursor:pointer;
          font-size:13px;
        }
        .nav-chip:hover{background:rgba(255,255,255,0.14);}
        @media(max-width:900px){
          .nav-top{flex-direction:column;align-items:stretch;}
          .nav-actions{justify-content:flex-start;}
          .search-container{max-width:100%;}
        }
      `}</style>
    </nav>
  );
}
