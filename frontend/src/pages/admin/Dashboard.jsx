import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const StatCard = ({ icon, label, value, trend, color }) => (
  <div className="stat-card" style={{ "--accent": color }}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-body">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      <span className={`stat-trend ${trend >= 0 ? "up" : "down"}`}>
        {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% this month
      </span>
    </div>
    <div className="stat-glow" />
  </div>
);

const navItems = [
  { icon: "◈", label: "Dashboard",  path: "/dashboard" },
  { icon: "◻", label: "Products",   path: "/products"  },
  { icon: "◑", label: "Orders",     path: "/orders"    },
  { icon: "◎", label: "Users",      path: "/users"     },
  { icon: "◧", label: "Analytics",  path: "/analytics" },
  { icon: "⚙", label: "Settings",   path: "/settings"  },
];

const recentOrders = [
  { id: "#ORD-1042", customer: "Arjun Sharma", product: "Wireless Headphones", status: "Delivered", amount: "₹2,499", date: "Mar 14" },
  { id: "#ORD-1041", customer: "Priya Nair",   product: "Running Shoes",       status: "Processing", amount: "₹3,899", date: "Mar 14" },
  { id: "#ORD-1040", customer: "Rahul Gupta",  product: "Smart Watch",         status: "Shipped",   amount: "₹8,299", date: "Mar 13" },
  { id: "#ORD-1039", customer: "Sneha Patel",  product: "Laptop Stand",        status: "Delivered", amount: "₹1,299", date: "Mar 13" },
  { id: "#ORD-1038", customer: "Vikram Rao",   product: "USB-C Hub",           status: "Cancelled", amount: "₹1,799", date: "Mar 12" },
];

const statusColor = {
  Delivered:  "#3ECFCF",
  Processing: "#6C63FF",
  Shipped:    "#FFD166",
  Cancelled:  "#FF6B9D",
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();                         // ← know current path
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => { logout(); navigate("/login"); };

  const stats = {
    revenue:  "₹4,28,350",
    orders:   "1,284",
    users:    "9,823",
    products: "342",
  };

  return (
    <div className={`app-shell ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

      {/* ─── SIDEBAR ─── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-dot" />
          <span className="brand-text">ShopNova</span>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}   // ← REAL navigation now
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {location.pathname === item.path && <div className="nav-indicator" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="user-avatar">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || "Admin"}</span>
              <span className="user-role">Administrator</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <span>⎋</span>
          </button>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main className="main-content">

        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="page-title">Dashboard</h1>
            <span className="page-sub">Welcome back, {user?.name || "Admin"} 👋</span>
          </div>
          <div className="topbar-right">
            <div className="search-bar">
              <span>🔍</span>
              <input placeholder="Search orders, products..." />
            </div>
            <div className="notif-btn">
              🔔
              <span className="notif-badge">3</span>
            </div>
            <button className="topbar-logout" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </header>

        {/* Stats */}
        <section className="stats-grid">
          <StatCard icon="₹"  label="Total Revenue" value={stats.revenue}  trend={12.5} color="#6C63FF" />
          <StatCard icon="📦" label="Total Orders"  value={stats.orders}   trend={8.2}  color="#3ECFCF" />
          <StatCard icon="👥" label="Total Users"   value={stats.users}    trend={5.7}  color="#FFD166" />
          <StatCard icon="🛒" label="Products"      value={stats.products} trend={-2.1} color="#FF6B9D" />
        </section>

        {/* Content Grid */}
        <section className="content-grid">

          {/* Orders Table */}
          <div className="panel orders-panel">
            <div className="panel-header">
              <h2 className="panel-title">Recent Orders</h2>
              <button className="panel-action" onClick={() => navigate("/orders")}>View All →</button>
            </div>
            <div className="table-wrap">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th><th>Customer</th><th>Product</th>
                    <th>Status</th><th>Amount</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id}>
                      <td className="order-id">{o.id}</td>
                      <td>{o.customer}</td>
                      <td className="product-name">{o.product}</td>
                      <td>
                        <span className="status-badge" style={{ "--sc": statusColor[o.status] }}>
                          {o.status}
                        </span>
                      </td>
                      <td className="amount">{o.amount}</td>
                      <td className="date">{o.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-col">

            {/* Activity */}
            <div className="panel activity-panel">
              <div className="panel-header">
                <h2 className="panel-title">Live Activity</h2>
                <span className="live-dot"><span />LIVE</span>
              </div>
              <div className="activity-list">
                {[
                  { msg: "New order placed by Arjun Sharma", time: "2m ago",  icon: "📦" },
                  { msg: "User Priya Nair registered",       time: "8m ago",  icon: "👤" },
                  { msg: "Product 'Smart Watch' updated",    time: "15m ago", icon: "✏️" },
                  { msg: "Payment received ₹3,899",          time: "22m ago", icon: "💳" },
                  { msg: "Order #1038 cancelled",            time: "1h ago",  icon: "❌" },
                ].map((a, i) => (
                  <div className="activity-item" key={i}>
                    <div className="activity-icon">{a.icon}</div>
                    <div className="activity-body">
                      <p>{a.msg}</p>
                      <span>{a.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Categories */}
            <div className="panel categories-panel">
              <div className="panel-header">
                <h2 className="panel-title">Top Categories</h2>
              </div>
              {[
                { name: "Electronics",   pct: 42 },
                { name: "Fashion",       pct: 28 },
                { name: "Home & Living", pct: 18 },
                { name: "Books",         pct: 12 },
              ].map((c) => (
                <div className="category-row" key={c.name}>
                  <span>{c.name}</span>
                  <div className="cat-bar-wrap">
                    <div className="cat-bar" style={{ width: `${c.pct}%` }} />
                  </div>
                  <span className="cat-pct">{c.pct}%</span>
                </div>
              ))}
            </div>

          </div>
        </section>
      </main>

      {/* ─── ALL YOUR ORIGINAL STYLES (unchanged) ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .app-shell { display: flex; min-height: 100vh; background: #08081a; font-family: 'Sora', sans-serif; color: #e0e0f0; }
        .sidebar { width: 240px; background: rgba(255,255,255,0.03); border-right: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; position: fixed; left: 0; top: 0; bottom: 0; transition: width 0.3s cubic-bezier(0.4,0,0.2,1); z-index: 100; overflow: hidden; }
        .sidebar-closed .sidebar { width: 70px; }
        .sidebar-brand { display: flex; align-items: center; gap: 12px; padding: 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .brand-dot { width: 10px; height: 10px; background: linear-gradient(135deg, #6C63FF, #3ECFCF); border-radius: 50%; flex-shrink: 0; box-shadow: 0 0 12px #6C63FF; }
        .brand-text { font-size: 17px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; }
        .sidebar-toggle { margin-left: auto; background: none; border: none; color: rgba(255,255,255,0.3); cursor: pointer; font-size: 12px; flex-shrink: 0; }
        .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; padding: 16px 12px; overflow-y: auto; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 11px 12px; border-radius: 10px; background: none; border: none; color: rgba(255,255,255,0.45); cursor: pointer; font-family: 'Sora', sans-serif; font-size: 13.5px; font-weight: 500; transition: all 0.2s; text-align: left; position: relative; white-space: nowrap; overflow: hidden; }
        .nav-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.8); }
        .nav-item.active { background: rgba(108,99,255,0.15); color: #a099ff; }
        .nav-icon { font-size: 16px; flex-shrink: 0; }
        .nav-label { overflow: hidden; }
        .nav-indicator { position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 60%; background: #6C63FF; border-radius: 2px; }
        .sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 10px; }
        .user-chip { display: flex; align-items: center; gap: 10px; flex: 1; overflow: hidden; }
        .user-avatar { width: 34px; height: 34px; background: linear-gradient(135deg, #6C63FF, #3ECFCF); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #fff; flex-shrink: 0; }
        .user-info { overflow: hidden; }
        .user-name { display: block; font-size: 13px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-role { display: block; font-size: 11px; color: rgba(255,255,255,0.35); white-space: nowrap; }
        .logout-btn { background: rgba(255,107,157,0.1); border: 1px solid rgba(255,107,157,0.2); color: #FF6B9D; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.2s; }
        .logout-btn:hover { background: rgba(255,107,157,0.2); }
        .main-content { flex: 1; margin-left: 240px; transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1); min-height: 100vh; display: flex; flex-direction: column; }
        .sidebar-closed .main-content { margin-left: 70px; }
        .topbar { display: flex; align-items: center; justify-content: space-between; padding: 20px 32px; border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); position: sticky; top: 0; z-index: 50; backdrop-filter: blur(10px); }
        .page-title { font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.5px; }
        .page-sub { font-size: 13px; color: rgba(255,255,255,0.4); display: block; margin-top: 2px; }
        .topbar-right { display: flex; align-items: center; gap: 16px; }
        .search-bar { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 9px 14px; }
        .search-bar input { background: none; border: none; color: #fff; font-family: 'Sora', sans-serif; font-size: 13px; outline: none; width: 200px; }
        .search-bar input::placeholder { color: rgba(255,255,255,0.3); }
        .notif-btn { position: relative; font-size: 18px; cursor: pointer; padding: 6px; }
        .notif-badge { position: absolute; top: 0; right: 0; background: #FF6B9D; color: #fff; font-size: 9px; font-weight: 700; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .topbar-logout { background: rgba(255,107,157,0.1); border: 1px solid rgba(255,107,157,0.25); color: #FF6B9D; padding: 8px 16px; border-radius: 8px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.2s; }
        .topbar-logout:hover { background: rgba(255,107,157,0.2); }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; padding: 28px 32px 0; }
        .stat-card { position: relative; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; display: flex; gap: 16px; align-items: flex-start; overflow: hidden; transition: transform 0.2s, border-color 0.2s; }
        .stat-card:hover { transform: translateY(-2px); border-color: var(--accent); }
        .stat-icon { font-size: 22px; width: 44px; height: 44px; background: color-mix(in srgb, var(--accent) 15%, transparent); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--accent); }
        .stat-body { flex: 1; }
        .stat-label { font-size: 12px; color: rgba(255,255,255,0.4); display: block; margin-bottom: 6px; letter-spacing: 0.3px; }
        .stat-value { font-size: 24px; font-weight: 700; color: #fff; display: block; letter-spacing: -0.5px; }
        .stat-trend { font-size: 12px; margin-top: 4px; display: block; }
        .stat-trend.up { color: #3ECFCF; }
        .stat-trend.down { color: #FF6B9D; }
        .stat-glow { position: absolute; top: -30px; right: -30px; width: 80px; height: 80px; background: var(--accent); border-radius: 50%; filter: blur(40px); opacity: 0.1; }
        .content-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; padding: 20px 32px 32px; }
        .panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 24px; }
        .panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .panel-title { font-size: 15px; font-weight: 600; color: #fff; }
        .panel-action { background: none; border: none; color: #6C63FF; font-family: 'Sora', sans-serif; font-size: 13px; cursor: pointer; font-weight: 500; }
        .table-wrap { overflow-x: auto; }
        .orders-table { width: 100%; border-collapse: collapse; }
        .orders-table th { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.8px; padding: 10px 12px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .orders-table td { padding: 13px 12px; font-size: 13.5px; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.04); }
        .orders-table tr:hover td { background: rgba(255,255,255,0.02); }
        .order-id { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #6C63FF; }
        .amount { font-weight: 600; color: #fff; }
        .date { color: rgba(255,255,255,0.35); font-size: 12px; }
        .product-name { color: rgba(255,255,255,0.9); }
        .status-badge { padding: 4px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; background: color-mix(in srgb, var(--sc) 15%, transparent); color: var(--sc); border: 1px solid color-mix(in srgb, var(--sc) 30%, transparent); white-space: nowrap; }
        .right-col { display: flex; flex-direction: column; gap: 20px; }
        .live-dot { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; color: #3ECFCF; letter-spacing: 0.5px; }
        .live-dot span { display: inline-block; width: 7px; height: 7px; background: #3ECFCF; border-radius: 50%; animation: pulse 1.5s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        .activity-list { display: flex; flex-direction: column; gap: 14px; }
        .activity-item { display: flex; gap: 12px; align-items: flex-start; }
        .activity-icon { width: 32px; height: 32px; background: rgba(255,255,255,0.05); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
        .activity-body p { font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.4; }
        .activity-body span { font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 3px; display: block; }
        .categories-panel .panel-header { margin-bottom: 16px; }
        .category-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; font-size: 13px; color: rgba(255,255,255,0.6); }
        .category-row > span:first-child { width: 100px; flex-shrink: 0; }
        .cat-bar-wrap { flex: 1; background: rgba(255,255,255,0.06); border-radius: 4px; height: 6px; overflow: hidden; }
        .cat-bar { height: 100%; background: linear-gradient(90deg, #6C63FF, #3ECFCF); border-radius: 4px; transition: width 1s ease; }
        .cat-pct { font-size: 12px; color: rgba(255,255,255,0.4); width: 32px; text-align: right; flex-shrink: 0; }
        @media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .content-grid { grid-template-columns: 1fr; } }
        @media (max-width: 700px) { .stats-grid { grid-template-columns: 1fr; padding: 16px; } .content-grid { padding: 16px; } .topbar { padding: 16px; } .topbar-right .search-bar { display: none; } }
      `}</style>
    </div>
  );
}