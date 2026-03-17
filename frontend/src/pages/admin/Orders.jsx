import { useState } from "react";
import BackButton from "../../components/BackButton";
const initialOrders = [
  { id: "#ORD-1042", customer: "Arjun Sharma", email: "arjun@email.com", product: "Wireless Headphones", status: "Delivered", amount: 2499, date: "Mar 14, 2026", items: 1 },
  { id: "#ORD-1041", customer: "Priya Nair", email: "priya@email.com", product: "Running Shoes", status: "Processing", amount: 3899, date: "Mar 14, 2026", items: 2 },
  { id: "#ORD-1040", customer: "Rahul Gupta", email: "rahul@email.com", product: "Smart Watch", status: "Shipped", amount: 8299, date: "Mar 13, 2026", items: 1 },
  { id: "#ORD-1039", customer: "Sneha Patel", email: "sneha@email.com", product: "Laptop Stand", status: "Delivered", amount: 1299, date: "Mar 13, 2026", items: 3 },
  { id: "#ORD-1038", customer: "Vikram Rao", email: "vikram@email.com", product: "USB-C Hub", status: "Cancelled", amount: 1799, date: "Mar 12, 2026", items: 1 },
  { id: "#ORD-1037", customer: "Meera Singh", email: "meera@email.com", product: "Yoga Mat", status: "Delivered", amount: 999, date: "Mar 12, 2026", items: 1 },
  { id: "#ORD-1036", customer: "Kiran Kumar", email: "kiran@email.com", product: "Coffee Maker", status: "Shipped", amount: 4599, date: "Mar 11, 2026", items: 1 },
  { id: "#ORD-1035", customer: "Divya Reddy", email: "divya@email.com", product: "Backpack", status: "Processing", amount: 2199, date: "Mar 11, 2026", items: 2 },
];

const statusColor = { Delivered: "#3ECFCF", Processing: "#6C63FF", Shipped: "#FFD166", Cancelled: "#FF6B9D" };
const statusIcons = { Delivered: "✅", Processing: "⏳", Shipped: "🚚", Cancelled: "❌" };

export default function Orders() {
  const [orders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const statuses = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

  const filtered = orders.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search);
    const matchFilter = filter === "All" || o.status === filter;
    return matchSearch && matchFilter;
  });

  const totalRevenue = orders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + o.amount, 0);

  return (
    <div className="page">
      <div className="page-header">
           <BackButton />
        <div><h1>Orders</h1><p>{orders.length} total orders</p></div>
      </div>

      {/* Stats */}
      <div className="order-stats">
        {statuses.filter(s => s !== "All").map(s => (
          <div key={s} className="ostat" style={{"--c": statusColor[s]}}>
            <span className="ostat-icon">{statusIcons[s]}</span>
            <div>
              <b>{orders.filter(o => o.status === s).length}</b>
              <p>{s}</p>
            </div>
          </div>
        ))}
        <div className="ostat" style={{"--c": "#fff"}}>
          <span className="ostat-icon">💰</span>
          <div><b>₹{totalRevenue.toLocaleString()}</b><p>Revenue</p></div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <span>🔍</span>
          <input placeholder="Search by customer or order ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {statuses.map(s => (
            <button key={s} className={`tab ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}
              style={filter === s && s !== "All" ? {"--ac": statusColor[s]} : {}}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="panel">
        <table className="data-table">
          <thead>
            <tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Items</th><th>Amount</th><th>Status</th><th>Date</th><th>View</th></tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td className="order-id">{o.id}</td>
                <td>
                  <div className="customer-cell">
                    <div className="avatar">{o.customer[0]}</div>
                    <div><p className="cname">{o.customer}</p><p className="cemail">{o.email}</p></div>
                  </div>
                </td>
                <td>{o.product}</td>
                <td className="center">{o.items}</td>
                <td className="amount">₹{o.amount.toLocaleString()}</td>
                <td><span className="status-badge" style={{"--sc": statusColor[o.status]}}>{statusIcons[o.status]} {o.status}</span></td>
                <td className="date">{o.date}</td>
                <td><button className="view-btn" onClick={() => setSelected(o)}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty">No orders found</div>}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="detail-body">
              <div className="detail-row"><span>Order ID</span><b className="order-id">{selected.id}</b></div>
              <div className="detail-row"><span>Customer</span><b>{selected.customer}</b></div>
              <div className="detail-row"><span>Email</span><b>{selected.email}</b></div>
              <div className="detail-row"><span>Product</span><b>{selected.product}</b></div>
              <div className="detail-row"><span>Items</span><b>{selected.items}</b></div>
              <div className="detail-row"><span>Amount</span><b className="amount">₹{selected.amount.toLocaleString()}</b></div>
              <div className="detail-row"><span>Date</span><b>{selected.date}</b></div>
              <div className="detail-row"><span>Status</span>
                <span className="status-badge" style={{"--sc": statusColor[selected.status]}}>{statusIcons[selected.status]} {selected.status}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=JetBrains+Mono:wght@400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .page{padding:28px 32px;font-family:'Sora',sans-serif;color:#e0e0f0;min-height:100vh;background:#08081a}
        .page-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
        .page-header h1{font-size:24px;font-weight:700;color:#fff;letter-spacing:-0.5px}
        .page-header p{font-size:13px;color:rgba(255,255,255,0.4);margin-top:4px}
        .order-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:24px}
        .ostat{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-left:3px solid var(--c);border-radius:14px;padding:16px;display:flex;align-items:center;gap:12px;transition:border-color 0.2s}
        .ostat-icon{font-size:22px}
        .ostat b{font-size:20px;font-weight:700;color:#fff;display:block}
        .ostat p{font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px}
        .toolbar{display:flex;gap:16px;margin-bottom:20px;flex-wrap:wrap}
        .search-box{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:10px 14px;flex:1;min-width:220px}
        .search-box input{background:none;border:none;color:#fff;font-family:'Sora',sans-serif;font-size:13px;outline:none;width:100%}
        .search-box input::placeholder{color:rgba(255,255,255,0.3)}
        .filter-tabs{display:flex;gap:6px;flex-wrap:wrap}
        .tab{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.5);padding:8px 14px;border-radius:8px;font-family:'Sora',sans-serif;font-size:12px;cursor:pointer;transition:all 0.2s}
        .tab.active{background:rgba(108,99,255,0.2);border-color:#6C63FF;color:#a099ff}
        .panel{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;overflow:hidden}
        .data-table{width:100%;border-collapse:collapse}
        .data-table th{font-size:11px;font-weight:600;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.8px;padding:14px 16px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.06)}
        .data-table td{padding:13px 16px;font-size:13px;color:rgba(255,255,255,0.7);border-bottom:1px solid rgba(255,255,255,0.04)}
        .data-table tr:last-child td{border-bottom:none}
        .data-table tr:hover td{background:rgba(255,255,255,0.02)}
        .order-id{font-family:'JetBrains Mono',monospace;font-size:12px;color:#6C63FF}
        .customer-cell{display:flex;align-items:center;gap:10px}
        .avatar{width:32px;height:32px;background:linear-gradient(135deg,#6C63FF,#3ECFCF);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0}
        .cname{font-size:13px;color:rgba(255,255,255,0.85);font-weight:500}
        .cemail{font-size:11px;color:rgba(255,255,255,0.35);margin-top:2px}
        .amount{font-weight:600;color:#fff}
        .center{text-align:center}
        .date{color:rgba(255,255,255,0.35);font-size:12px}
        .status-badge{padding:4px 10px;border-radius:20px;font-size:11.5px;font-weight:600;background:color-mix(in srgb,var(--sc) 15%,transparent);color:var(--sc);border:1px solid color-mix(in srgb,var(--sc) 30%,transparent);white-space:nowrap}
        .view-btn{background:rgba(108,99,255,0.15);border:1px solid rgba(108,99,255,0.3);color:#a099ff;padding:5px 12px;border-radius:7px;font-family:'Sora',sans-serif;font-size:12px;cursor:pointer;transition:background 0.2s}
        .view-btn:hover{background:rgba(108,99,255,0.3)}
        .empty{padding:40px;text-align:center;color:rgba(255,255,255,0.3);font-size:14px}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(4px)}
        .modal{background:#13132a;border:1px solid rgba(255,255,255,0.12);border-radius:20px;width:100%;max-width:420px;padding:28px;animation:slideUp 0.3s ease}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
        .modal-header h2{font-size:18px;font-weight:700;color:#fff}
        .modal-header button{background:none;border:none;color:rgba(255,255,255,0.4);font-size:18px;cursor:pointer}
        .detail-body{display:flex;flex-direction:column;gap:14px}
        .detail-row{display:flex;justify-content:space-between;align-items:center;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.06)}
        .detail-row:last-child{border-bottom:none;padding-bottom:0}
        .detail-row span{font-size:13px;color:rgba(255,255,255,0.4)}
        .detail-row b{font-size:13px;color:#fff;font-weight:500}
        @media(max-width:768px){.order-stats{grid-template-columns:repeat(2,1fr)}}
      `}</style>
    </div>
  );
}
