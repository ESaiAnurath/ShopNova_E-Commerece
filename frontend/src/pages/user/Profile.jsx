import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserNavbar from "./UserNavbar";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("profile");
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: "", city: "", pincode: "" });
  const [saved, setSaved] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handlePw = () => {
    if (!pwForm.current) { setPwMsg("❌ Enter current password"); return; }
    if (pwForm.newPw.length < 6) { setPwMsg("❌ Min 6 characters"); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg("❌ Passwords don't match"); return; }
    setPwMsg("✅ Password changed successfully!");
    setPwForm({ current: "", newPw: "", confirm: "" });
  };

  const stats = [
    { label: "Total Orders", value: "4",       icon: "📦" },
    { label: "Delivered",    value: "2",       icon: "✅" },
    { label: "Wishlist",     value: "6",       icon: "❤️" },
    { label: "Total Spent",  value: "₹1,06,896", icon: "💰" },
  ];

  return (
    <div className="pp">
      <UserNavbar cartCount={0} />
      <div className="wrap">
        {/* Profile Header */}
        <div className="prof-header">
          <div className="avatar-big">{user?.name?.[0]?.toUpperCase() || "U"}</div>
          <div className="prof-info">
            <h1>{user?.name || "User"}</h1>
            <p>{user?.email}</p>
            <span className="role-tag">👤 Customer</span>
          </div>
          <button className="logout-btn" onClick={() => { logout(); navigate("/login"); }}>⎋ Logout</button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {stats.map(s => (
            <div key={s.label} className="stat-box">
              <span>{s.icon}</span>
              <b>{s.value}</b>
              <p>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tabs">
          {["profile", "address", "password"].map(t => (
            <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t === "profile" ? "👤 Profile" : t === "address" ? "📍 Address" : "🔒 Password"}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === "profile" && (
          <div className="form-card">
            <h2>Personal Information</h2>
            <div className="fgrid">
              <div className="ff"><label>Full Name</label><input value={form.name} onChange={e => setForm({...form,name:e.target.value})} /></div>
              <div className="ff"><label>Email Address</label><input value={form.email} onChange={e => setForm({...form,email:e.target.value})} /></div>
              <div className="ff"><label>Phone Number</label><input placeholder="+91 9876543210" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} /></div>
            </div>
            <button className={`save-btn ${saved ? "saved" : ""}`} onClick={handleSave}>
              {saved ? "✅ Saved!" : "Save Changes"}
            </button>
          </div>
        )}

        {/* Address Tab */}
        {tab === "address" && (
          <div className="form-card">
            <h2>Delivery Address</h2>
            <div className="fgrid">
              <div className="ff full"><label>Full Address</label><input placeholder="House no, Street, Area" /></div>
              <div className="ff"><label>City</label><input placeholder="Hyderabad" value={form.city} onChange={e => setForm({...form,city:e.target.value})} /></div>
              <div className="ff"><label>State</label><input placeholder="Telangana" /></div>
              <div className="ff"><label>Pincode</label><input placeholder="500001" value={form.pincode} onChange={e => setForm({...form,pincode:e.target.value})} /></div>
            </div>
            <button className="save-btn" onClick={handleSave}>{saved ? "✅ Saved!" : "Save Address"}</button>
          </div>
        )}

        {/* Password Tab */}
        {tab === "password" && (
          <div className="form-card">
            <h2>Change Password</h2>
            <div className="fgrid">
              <div className="ff"><label>Current Password</label><input type="password" placeholder="••••••••" value={pwForm.current} onChange={e => setPwForm({...pwForm,current:e.target.value})} /></div>
              <div className="ff"><label>New Password</label><input type="password" placeholder="Min 6 characters" value={pwForm.newPw} onChange={e => setPwForm({...pwForm,newPw:e.target.value})} /></div>
              <div className="ff"><label>Confirm Password</label><input type="password" placeholder="Repeat new password" value={pwForm.confirm} onChange={e => setPwForm({...pwForm,confirm:e.target.value})} /></div>
            </div>
            {pwMsg && <p className={`pmsg ${pwMsg.startsWith("✅") ? "ok" : "err"}`}>{pwMsg}</p>}
            <button className="save-btn" onClick={handlePw}>Change Password</button>
          </div>
        )}
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .pp{min-height:100vh;background:#08081a;font-family:'Sora',sans-serif;color:#e0e0f0}
        .wrap{max-width:800px;margin:0 auto;padding:32px}
        .prof-header{display:flex;align-items:center;gap:20px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:24px;margin-bottom:24px;flex-wrap:wrap}
        .avatar-big{width:72px;height:72px;background:linear-gradient(135deg,#6C63FF,#3ECFCF);border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;color:#fff;flex-shrink:0}
        .prof-info h1{font-size:22px;font-weight:700;color:#fff;margin-bottom:4px}
        .prof-info p{font-size:14px;color:rgba(255,255,255,0.4);margin-bottom:8px}
        .role-tag{background:rgba(108,99,255,0.15);color:#a099ff;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:500;border:1px solid rgba(108,99,255,0.3)}
        .logout-btn{margin-left:auto;background:rgba(255,107,157,0.1);border:1px solid rgba(255,107,157,0.2);color:#FF6B9D;padding:8px 16px;border-radius:10px;font-family:'Sora',sans-serif;font-size:13px;cursor:pointer;transition:background 0.2s}
        .logout-btn:hover{background:rgba(255,107,157,0.2)}
        .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
        .stat-box{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:18px;text-align:center;transition:border-color 0.2s}
        .stat-box:hover{border-color:rgba(108,99,255,0.3)}
        .stat-box span{font-size:24px;display:block;margin-bottom:8px}
        .stat-box b{font-size:18px;font-weight:700;color:#fff;display:block;margin-bottom:4px}
        .stat-box p{font-size:11px;color:rgba(255,255,255,0.4)}
        .tabs{display:flex;gap:8px;margin-bottom:20px}
        .tab{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.5);padding:10px 20px;border-radius:10px;font-family:'Sora',sans-serif;font-size:13px;cursor:pointer;transition:all 0.2s}
        .tab.active{background:rgba(108,99,255,0.2);border-color:#6C63FF;color:#a099ff;font-weight:500}
        .form-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px}
        .form-card h2{font-size:16px;font-weight:700;color:#fff;margin-bottom:20px}
        .fgrid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
        .ff.full{grid-column:1/-1}
        .ff label{display:block;font-size:12px;font-weight:500;color:rgba(255,255,255,0.5);margin-bottom:6px}
        .ff input{width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#fff;font-family:'Sora',sans-serif;font-size:13px;padding:11px 12px;border-radius:10px;outline:none;transition:border-color 0.2s}
        .ff input:focus{border-color:#6C63FF}
        .ff input::placeholder{color:rgba(255,255,255,0.25)}
        .save-btn{background:linear-gradient(135deg,#6C63FF,#3ECFCF);border:none;color:#fff;padding:11px 24px;border-radius:10px;font-family:'Sora',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s}
        .save-btn.saved{background:linear-gradient(135deg,#00C9A7,#3ECFCF)}
        .save-btn:hover{opacity:0.9;transform:translateY(-1px)}
        .pmsg{font-size:13px;margin-bottom:14px}
        .pmsg.ok{color:#3ECFCF}
        .pmsg.err{color:#FF6B9D}
        @media(max-width:600px){.stats-row{grid-template-columns:repeat(2,1fr)}.fgrid{grid-template-columns:1fr}.tabs{flex-direction:column}}
      `}</style>
    </div>
  );
}
