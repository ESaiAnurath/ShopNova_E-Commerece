import { useState } from "react";
import BackButton from "../../components/BackButton";
const themes = [
  { id: "purple-cyan", name: "Purple Cyan", primary: "#6C63FF", secondary: "#3ECFCF", bg: "#08081a", preview: ["#6C63FF","#3ECFCF","#08081a"] },
  { id: "orange-pink", name: "Sunset", primary: "#FF6B35", secondary: "#FF6B9D", bg: "#0f0810", preview: ["#FF6B35","#FF6B9D","#0f0810"] },
  { id: "green-blue", name: "Ocean", primary: "#00C9A7", secondary: "#4FACFE", bg: "#060f0a", preview: ["#00C9A7","#4FACFE","#060f0a"] },
  { id: "gold-red", name: "Fire", primary: "#FFD166", secondary: "#FF4757", bg: "#100808", preview: ["#FFD166","#FF4757","#100808"] },
  { id: "pink-purple", name: "Candy", primary: "#FF9FF3", secondary: "#A29BFE", bg: "#0d0810", preview: ["#FF9FF3","#A29BFE","#0d0810"] },
  { id: "white-gray", name: "Minimal", primary: "#ffffff", secondary: "#888888", bg: "#111111", preview: ["#ffffff","#888888","#111111"] },
];

export default function Settings() {
  const [activeTheme, setActiveTheme] = useState("purple-cyan");
  const [profile, setProfile] = useState({ name: "Admin", email: "admin@shopnova.com", phone: "+91 9876543210", timezone: "Asia/Kolkata" });
  const [notifications, setNotifications] = useState({ email: true, orders: true, lowStock: true, newUser: false, marketing: false });
  const [security, setSecurity] = useState({ twoFA: false, sessionTimeout: "30" });
  const [store, setStore] = useState({ name: "ShopNova", currency: "INR", language: "English", taxRate: "18" });
  const [saved, setSaved] = useState("");

  const handleSave = (section) => {
    setSaved(section);
    setTimeout(() => setSaved(""), 2000);
  };

  const toggle = (key) => setNotifications({ ...notifications, [key]: !notifications[key] });

  return (
    <div className="page">
      <div className="page-header">
         <BackButton />
        <div><h1>Settings</h1><p>Manage your store preferences</p></div>
      </div>

      <div className="settings-layout">
        {/* Left nav */}
        <div className="settings-nav">
          {[
            { icon: "🎨", label: "Themes" },
            { icon: "👤", label: "Profile" },
            { icon: "🏪", label: "Store" },
            { icon: "🔔", label: "Notifications" },
            { icon: "🔒", label: "Security" },
          ].map(item => (
            <a key={item.label} href={`#${item.label.toLowerCase()}`} className="snav-item">
              <span>{item.icon}</span>{item.label}
            </a>
          ))}
        </div>

        {/* Right content */}
        <div className="settings-content">

          {/* THEMES */}
          <div className="section" id="themes">
            <div className="section-header"><h2>🎨 Themes</h2><p>Choose your dashboard appearance</p></div>
            <div className="themes-grid">
              {themes.map(t => (
                <div
                  key={t.id}
                  className={`theme-card ${activeTheme === t.id ? "selected" : ""}`}
                  onClick={() => setActiveTheme(t.id)}
                >
                  <div className="theme-preview" style={{ background: t.bg }}>
                    <div className="theme-sidebar" style={{ background: `${t.primary}22` }}>
                      <div className="ts-dot" style={{ background: t.primary }} />
                      <div className="ts-line" style={{ background: `${t.primary}66` }} />
                      <div className="ts-line" style={{ background: `${t.primary}44` }} />
                      <div className="ts-line" style={{ background: `${t.primary}44` }} />
                    </div>
                    <div className="theme-main">
                      <div className="tm-card" style={{ borderColor: `${t.primary}44` }}>
                        <div className="tm-bar" style={{ background: `linear-gradient(90deg,${t.primary},${t.secondary})`, width: "60%" }} />
                        <div className="tm-bar" style={{ background: `${t.primary}33`, width: "80%", marginTop: 4 }} />
                      </div>
                      <div className="tm-btn" style={{ background: `linear-gradient(135deg,${t.primary},${t.secondary})` }} />
                    </div>
                  </div>
                  <div className="theme-info">
                    <span className="theme-name">{t.name}</span>
                    <div className="theme-dots">
                      {t.preview.map((c, i) => <div key={i} style={{ background: c, width: 10, height: 10, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)" }} />)}
                    </div>
                  </div>
                  {activeTheme === t.id && <div className="theme-check">✓</div>}
                </div>
              ))}
            </div>
            <button className="save-btn" onClick={() => handleSave("theme")}>
              {saved === "theme" ? "✅ Theme Applied!" : "Apply Theme"}
            </button>
          </div>

          {/* PROFILE */}
          <div className="section" id="profile">
            <div className="section-header"><h2>👤 Profile</h2><p>Update your personal information</p></div>
            <div className="form-grid">
              <div className="form-field"><label>Full Name</label><input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} /></div>
              <div className="form-field"><label>Email Address</label><input value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} /></div>
              <div className="form-field"><label>Phone Number</label><input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} /></div>
              <div className="form-field"><label>Timezone</label>
                <select value={profile.timezone} onChange={e => setProfile({...profile, timezone: e.target.value})}>
                  <option>Asia/Kolkata</option><option>UTC</option><option>America/New_York</option><option>Europe/London</option>
                </select>
              </div>
            </div>
            <button className="save-btn" onClick={() => handleSave("profile")}>
              {saved === "profile" ? "✅ Saved!" : "Save Profile"}
            </button>
          </div>

          {/* STORE */}
          <div className="section" id="store">
            <div className="section-header"><h2>🏪 Store Settings</h2><p>Configure your store details</p></div>
            <div className="form-grid">
              <div className="form-field"><label>Store Name</label><input value={store.name} onChange={e => setStore({...store, name: e.target.value})} /></div>
              <div className="form-field"><label>Currency</label>
                <select value={store.currency} onChange={e => setStore({...store, currency: e.target.value})}>
                  <option>INR</option><option>USD</option><option>EUR</option><option>GBP</option>
                </select>
              </div>
              <div className="form-field"><label>Language</label>
                <select value={store.language} onChange={e => setStore({...store, language: e.target.value})}>
                  <option>English</option><option>Hindi</option><option>Tamil</option>
                </select>
              </div>
              <div className="form-field"><label>Tax Rate (%)</label><input type="number" value={store.taxRate} onChange={e => setStore({...store, taxRate: e.target.value})} /></div>
            </div>
            <button className="save-btn" onClick={() => handleSave("store")}>
              {saved === "store" ? "✅ Saved!" : "Save Store Settings"}
            </button>
          </div>

          {/* NOTIFICATIONS */}
          <div className="section" id="notifications">
            <div className="section-header"><h2>🔔 Notifications</h2><p>Control what alerts you receive</p></div>
            <div className="toggle-list">
              {[
                { key: "email", label: "Email Notifications", desc: "Receive notifications via email" },
                { key: "orders", label: "New Orders", desc: "Get notified when a new order is placed" },
                { key: "lowStock", label: "Low Stock Alerts", desc: "Alert when product stock falls below 10" },
                { key: "newUser", label: "New User Registrations", desc: "Notify when a new user signs up" },
                { key: "marketing", label: "Marketing Updates", desc: "Promotional and marketing emails" },
              ].map(item => (
                <div key={item.key} className="toggle-row">
                  <div className="toggle-info">
                    <p className="toggle-label">{item.label}</p>
                    <p className="toggle-desc">{item.desc}</p>
                  </div>
                  <div className={`toggle-switch ${notifications[item.key] ? "on" : ""}`} onClick={() => toggle(item.key)}>
                    <div className="toggle-thumb" />
                  </div>
                </div>
              ))}
            </div>
            <button className="save-btn" onClick={() => handleSave("notif")}>
              {saved === "notif" ? "✅ Saved!" : "Save Notifications"}
            </button>
          </div>

          {/* SECURITY */}
          <div className="section" id="security">
            <div className="section-header"><h2>🔒 Security</h2><p>Keep your account safe</p></div>
            <div className="toggle-list">
              <div className="toggle-row">
                <div className="toggle-info">
                  <p className="toggle-label">Two-Factor Authentication</p>
                  <p className="toggle-desc">Add an extra layer of security to your account</p>
                </div>
                <div className={`toggle-switch ${security.twoFA ? "on" : ""}`} onClick={() => setSecurity({...security, twoFA: !security.twoFA})}>
                  <div className="toggle-thumb" />
                </div>
              </div>
            </div>
            <div className="form-grid" style={{marginTop: 20}}>
              <div className="form-field">
                <label>Session Timeout (minutes)</label>
                <select value={security.sessionTimeout} onChange={e => setSecurity({...security, sessionTimeout: e.target.value})}>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
              <div className="form-field">
                <label>Change Password</label>
                <input type="password" placeholder="Enter new password" />
              </div>
            </div>
            <button className="save-btn" onClick={() => handleSave("security")}>
              {saved === "security" ? "✅ Saved!" : "Save Security Settings"}
            </button>
          </div>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .page{padding:28px 32px;font-family:'Sora',sans-serif;color:#e0e0f0;min-height:100vh;background:#08081a}
        .page-header{margin-bottom:28px}
        .page-header h1{font-size:24px;font-weight:700;color:#fff;letter-spacing:-0.5px}
        .page-header p{font-size:13px;color:rgba(255,255,255,0.4);margin-top:4px}
        .settings-layout{display:grid;grid-template-columns:200px 1fr;gap:24px;align-items:start}
        .settings-nav{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:12px;position:sticky;top:20px;display:flex;flex-direction:column;gap:4px}
        .snav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;color:rgba(255,255,255,0.5);text-decoration:none;font-size:13px;font-weight:500;transition:all 0.2s}
        .snav-item:hover{background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.8)}
        .settings-content{display:flex;flex-direction:column;gap:24px}
        .section{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:28px}
        .section-header{margin-bottom:24px}
        .section-header h2{font-size:16px;font-weight:700;color:#fff}
        .section-header p{font-size:13px;color:rgba(255,255,255,0.4);margin-top:4px}
        .themes-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px}
        .theme-card{border:2px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;cursor:pointer;transition:all 0.2s;position:relative}
        .theme-card:hover{border-color:rgba(255,255,255,0.2);transform:translateY(-2px)}
        .theme-card.selected{border-color:#6C63FF;box-shadow:0 0 20px rgba(108,99,255,0.3)}
        .theme-preview{height:90px;display:flex;gap:6px;padding:10px}
        .theme-sidebar{width:28px;border-radius:6px;padding:6px 4px;display:flex;flex-direction:column;gap:4px;flex-shrink:0}
        .ts-dot{width:10px;height:10px;border-radius:50%;margin-bottom:4px}
        .ts-line{height:4px;border-radius:2px}
        .theme-main{flex:1;display:flex;flex-direction:column;gap:6px}
        .tm-card{border:1px solid;border-radius:6px;padding:6px;flex:1}
        .tm-bar{height:5px;border-radius:3px}
        .tm-btn{height:16px;width:50px;border-radius:5px;margin-top:auto}
        .theme-info{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:rgba(0,0,0,0.3)}
        .theme-name{font-size:12px;font-weight:600;color:#fff}
        .theme-dots{display:flex;gap:4px;align-items:center}
        .theme-check{position:absolute;top:8px;right:8px;width:20px;height:20px;background:#6C63FF;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff;font-weight:700}
        .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
        .form-field label{display:block;font-size:12px;font-weight:500;color:rgba(255,255,255,0.5);margin-bottom:6px}
        .form-field input,.form-field select{width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#fff;font-family:'Sora',sans-serif;font-size:13px;padding:11px 12px;border-radius:10px;outline:none;transition:border-color 0.2s}
        .form-field input:focus,.form-field select:focus{border-color:#6C63FF}
        .form-field select option{background:#13132a}
        .toggle-list{display:flex;flex-direction:column;gap:0;margin-bottom:20px}
        .toggle-row{display:flex;align-items:center;justify-content:space-between;padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.06)}
        .toggle-row:last-child{border-bottom:none}
        .toggle-label{font-size:14px;font-weight:500;color:rgba(255,255,255,0.85)}
        .toggle-desc{font-size:12px;color:rgba(255,255,255,0.35);margin-top:3px}
        .toggle-switch{width:44px;height:24px;background:rgba(255,255,255,0.1);border-radius:12px;cursor:pointer;position:relative;transition:background 0.3s;flex-shrink:0}
        .toggle-switch.on{background:linear-gradient(135deg,#6C63FF,#3ECFCF)}
        .toggle-thumb{width:18px;height:18px;background:#fff;border-radius:50%;position:absolute;top:3px;left:3px;transition:transform 0.3s;box-shadow:0 1px 4px rgba(0,0,0,0.3)}
        .toggle-switch.on .toggle-thumb{transform:translateX(20px)}
        .save-btn{background:linear-gradient(135deg,#6C63FF,#3ECFCF);border:none;color:#fff;padding:11px 24px;border-radius:10px;font-family:'Sora',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:opacity 0.2s,transform 0.1s}
        .save-btn:hover{opacity:0.9;transform:translateY(-1px)}
        @media(max-width:900px){.settings-layout{grid-template-columns:1fr}.settings-nav{position:static;flex-direction:row;flex-wrap:wrap}.themes-grid{grid-template-columns:repeat(2,1fr)}.form-grid{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}
