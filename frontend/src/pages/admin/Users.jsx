import { useState } from "react";
import BackButton from "../../components/BackButton";
const initialUsers = [
  { id: 1, name: "Arjun Sharma", email: "arjun@email.com", role: "User", status: "Active", joined: "Jan 12, 2026", orders: 8, spent: 18420 },
  { id: 2, name: "Priya Nair", email: "priya@email.com", role: "User", status: "Active", joined: "Feb 3, 2026", orders: 5, spent: 12300 },
  { id: 3, name: "Rahul Gupta", email: "rahul@email.com", role: "Admin", status: "Active", joined: "Dec 1, 2025", orders: 12, spent: 45600 },
  { id: 4, name: "Sneha Patel", email: "sneha@email.com", role: "User", status: "Inactive", joined: "Mar 1, 2026", orders: 2, spent: 2500 },
  { id: 5, name: "Vikram Rao", email: "vikram@email.com", role: "User", status: "Active", joined: "Feb 20, 2026", orders: 6, spent: 9800 },
  { id: 6, name: "Meera Singh", email: "meera@email.com", role: "User", status: "Active", joined: "Jan 28, 2026", orders: 9, spent: 22100 },
  { id: 7, name: "Admin", email: "admin@shopnova.com", role: "Admin", status: "Active", joined: "Dec 1, 2025", orders: 0, spent: 0 },
];

const roleColor = { Admin: "#FFD166", User: "#6C63FF" };
const statusColor = { Active: "#3ECFCF", Inactive: "#FF6B9D" };

export default function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || u.role === filter || u.status === filter;
    return matchSearch && matchFilter;
  });

  const toggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u));
  };

  return (
    <div className="page">
      <div className="page-header">
         <BackButton />
        <div><h1>Users</h1><p>{users.length} registered users</p></div>
      </div>

      {/* Stats */}
      <div className="user-stats">
        <div className="ustat"><span>👥</span><div><b>{users.length}</b><p>Total Users</p></div></div>
        <div className="ustat"><span>✅</span><div><b>{users.filter(u => u.status === "Active").length}</b><p>Active</p></div></div>
        <div className="ustat"><span>🔴</span><div><b>{users.filter(u => u.status === "Inactive").length}</b><p>Inactive</p></div></div>
        <div className="ustat"><span>👑</span><div><b>{users.filter(u => u.role === "Admin").length}</b><p>Admins</p></div></div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <span>🔍</span>
          <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {["All", "Admin", "User", "Active", "Inactive"].map(f => (
            <button key={f} className={`tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="panel">
        <table className="data-table">
          <thead>
            <tr><th>User</th><th>Role</th><th>Status</th><th>Joined</th><th>Orders</th><th>Total Spent</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>
                  <div className="user-cell">
                    <div className="avatar" style={{ background: `linear-gradient(135deg, ${roleColor[u.role]}, #3ECFCF)` }}>{u.name[0]}</div>
                    <div><p className="uname">{u.name}</p><p className="uemail">{u.email}</p></div>
                  </div>
                </td>
                <td><span className="role-badge" style={{"--rc": roleColor[u.role]}}>{u.role === "Admin" ? "👑" : "👤"} {u.role}</span></td>
                <td><span className="status-badge" style={{"--sc": statusColor[u.status]}}>{u.status}</span></td>
                <td className="date">{u.joined}</td>
                <td className="center">{u.orders}</td>
                <td className="amount">₹{u.spent.toLocaleString()}</td>
                <td>
                  <button
                    className={`toggle-btn ${u.status === "Active" ? "deactivate" : "activate"}`}
                    onClick={() => toggleStatus(u.id)}
                  >
                    {u.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty">No users found</div>}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .page{padding:28px 32px;font-family:'Sora',sans-serif;color:#e0e0f0;min-height:100vh;background:#08081a}
        .page-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
        .page-header h1{font-size:24px;font-weight:700;color:#fff;letter-spacing:-0.5px}
        .page-header p{font-size:13px;color:rgba(255,255,255,0.4);margin-top:4px}
        .user-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
        .ustat{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:18px 20px;display:flex;align-items:center;gap:14px}
        .ustat span{font-size:26px}
        .ustat b{font-size:22px;font-weight:700;color:#fff;display:block}
        .ustat p{font-size:12px;color:rgba(255,255,255,0.4);margin-top:2px}
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
        .user-cell{display:flex;align-items:center;gap:10px}
        .avatar{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;flex-shrink:0}
        .uname{font-size:13px;color:rgba(255,255,255,0.85);font-weight:500}
        .uemail{font-size:11px;color:rgba(255,255,255,0.35);margin-top:2px}
        .role-badge{padding:4px 10px;border-radius:20px;font-size:11.5px;font-weight:600;background:color-mix(in srgb,var(--rc) 15%,transparent);color:var(--rc);border:1px solid color-mix(in srgb,var(--rc) 30%,transparent)}
        .status-badge{padding:4px 10px;border-radius:20px;font-size:11.5px;font-weight:600;background:color-mix(in srgb,var(--sc) 15%,transparent);color:var(--sc);border:1px solid color-mix(in srgb,var(--sc) 30%,transparent)}
        .date{color:rgba(255,255,255,0.35);font-size:12px}
        .center{text-align:center}
        .amount{font-weight:600;color:#fff}
        .toggle-btn{padding:5px 12px;border-radius:7px;font-family:'Sora',sans-serif;font-size:12px;cursor:pointer;border:1px solid;transition:all 0.2s}
        .deactivate{background:rgba(255,107,157,0.1);border-color:rgba(255,107,157,0.3);color:#FF6B9D}
        .activate{background:rgba(62,207,207,0.1);border-color:rgba(62,207,207,0.3);color:#3ECFCF}
        .empty{padding:40px;text-align:center;color:rgba(255,255,255,0.3);font-size:14px}
        @media(max-width:768px){.user-stats{grid-template-columns:repeat(2,1fr)}}
      `}</style>
    </div>
  );
}
