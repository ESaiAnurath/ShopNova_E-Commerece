import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match!"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters!"); return; }
    setLoading(true);
    try {
      const data = await authService.register(form.name, form.email, form.password);
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStrength = () => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColor = ["", "#FF6B9D", "#FFD166", "#FFD166", "#3ECFCF", "#3ECFCF"];
  const s = getStrength();

  return (
    <div className="reg-root">
      <div className="reg-bg">
        <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />
        <div className="grid-overlay" />
      </div>

      <div className="reg-card">
        <div className="reg-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="12" fill="url(#g2)" />
              <path d="M10 20L18 28L30 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <defs><linearGradient id="g2" x1="0" y1="0" x2="40" y2="40"><stop stopColor="#6C63FF"/><stop offset="1" stopColor="#3ECFCF"/></linearGradient></defs>
            </svg>
          </div>
          <div>
            <h1 className="brand-name">ShopNova</h1>
            <p className="brand-sub">E-Commerce Platform</p>
          </div>
        </div>

        <div className="reg-header">
          <h2>Create Account</h2>
          <p>Join ShopNova and start shopping today</p>
        </div>

        {error && <div className="error-banner"><span>⚠</span> {error}</div>}

        <form onSubmit={handleSubmit} className="reg-form">
          <div className="field">
            <label>Full Name</label>
            <div className="input-wrap">
              <span className="input-icon">👤</span>
              <input type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>
          </div>

          <div className="field">
            <label>Email Address</label>
            <div className="input-wrap">
              <span className="input-icon">✉</span>
              <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="field">
            <label>Password</label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input type="password" name="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
            </div>
            {form.password.length > 0 && (
              <div className="strength-wrap">
                <div className="strength-bars">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="strength-bar" style={{ background: i <= s ? strengthColor[s] : "rgba(255,255,255,0.1)" }} />
                  ))}
                </div>
                <span style={{ color: strengthColor[s] }}>{strengthLabel[s]}</span>
              </div>
            )}
          </div>

          <div className="field">
            <label>Confirm Password</label>
            <div className="input-wrap">
              <span className="input-icon">🔐</span>
              <input type="password" name="confirm" placeholder="Re-enter password" value={form.confirm} onChange={handleChange} required />
              {form.confirm.length > 0 && (
                <span className="match-icon">{form.password === form.confirm ? "✅" : "❌"}</span>
              )}
            </div>
          </div>

          <label className="terms">
            <input type="checkbox" required />
            <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
          </label>

          <button type="submit" className={`reg-btn ${loading ? "loading" : ""}`} disabled={loading}>
            {loading ? <span className="spinner" /> : "Create Account →"}
          </button>
        </form>

        <p className="login-prompt">Already have an account? <a href="/login">Sign in →</a></p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .reg-root{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a1a;font-family:'Sora',sans-serif;position:relative;overflow:hidden;padding:20px}
        .reg-bg{position:absolute;inset:0;pointer-events:none}
        .orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:0.2}
        .orb1{width:500px;height:500px;background:#6C63FF;top:-200px;right:-100px;animation:f1 8s ease-in-out infinite}
        .orb2{width:400px;height:400px;background:#3ECFCF;bottom:-100px;left:-100px;animation:f2 10s ease-in-out infinite}
        .orb3{width:300px;height:300px;background:#FF6B9D;top:40%;left:60%;animation:f3 12s ease-in-out infinite}
        .grid-overlay{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px);background-size:40px 40px}
        @keyframes f1{0%,100%{transform:translate(0,0)}50%{transform:translate(-30px,30px)}}
        @keyframes f2{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,-30px)}}
        @keyframes f3{0%,100%{transform:translate(0,0)}50%{transform:translate(-20px,20px)}}
        .reg-card{position:relative;width:100%;max-width:480px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:24px;padding:40px;backdrop-filter:blur(20px);box-shadow:0 40px 80px rgba(0,0,0,0.5);animation:slideUp 0.6s cubic-bezier(0.16,1,0.3,1)}
        @keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        .reg-brand{display:flex;align-items:center;gap:14px;margin-bottom:28px}
        .brand-icon svg{width:44px;height:44px}
        .brand-name{font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.5px}
        .brand-sub{font-size:12px;color:rgba(255,255,255,0.4);margin-top:2px}
        .reg-header{margin-bottom:24px}
        .reg-header h2{font-size:26px;font-weight:700;color:#fff;letter-spacing:-0.8px}
        .reg-header p{font-size:14px;color:rgba(255,255,255,0.4);margin-top:6px}
        .error-banner{background:rgba(255,80,80,0.15);border:1px solid rgba(255,80,80,0.3);color:#ff8080;padding:12px 16px;border-radius:10px;font-size:13px;margin-bottom:20px;display:flex;gap:8px;align-items:center}
        .reg-form{display:flex;flex-direction:column;gap:18px}
        .field label{display:block;font-size:13px;font-weight:500;color:rgba(255,255,255,0.6);margin-bottom:8px}
        .input-wrap{position:relative;display:flex;align-items:center}
        .input-icon{position:absolute;left:14px;font-size:15px;pointer-events:none}
        .input-wrap input{width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#fff;font-family:'Sora',sans-serif;font-size:14px;padding:13px 14px 13px 44px;border-radius:12px;outline:none;transition:border-color 0.2s,background 0.2s}
        .input-wrap input::placeholder{color:rgba(255,255,255,0.25)}
        .input-wrap input:focus{border-color:#6C63FF;background:rgba(108,99,255,0.08)}
        .match-icon{position:absolute;right:14px;font-size:14px}
        .strength-wrap{display:flex;align-items:center;gap:10px;margin-top:8px}
        .strength-bars{display:flex;gap:4px;flex:1}
        .strength-bar{height:4px;flex:1;border-radius:4px;transition:background 0.3s}
        .strength-wrap span{font-size:11px;font-weight:600;min-width:70px;text-align:right}
        .terms{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:rgba(255,255,255,0.45);cursor:pointer;line-height:1.5}
        .terms input{margin-top:3px;flex-shrink:0}
        .terms a{color:#6C63FF;text-decoration:none}
        .terms a:hover{text-decoration:underline}
        .reg-btn{width:100%;padding:15px;background:linear-gradient(135deg,#6C63FF,#3ECFCF);border:none;border-radius:12px;color:#fff;font-family:'Sora',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:opacity 0.2s,transform 0.1s;display:flex;align-items:center;justify-content:center;margin-top:4px}
        .reg-btn:hover:not(:disabled){opacity:0.9;transform:translateY(-1px)}
        .reg-btn:disabled{opacity:0.6;cursor:not-allowed}
        .spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .login-prompt{text-align:center;font-size:13px;color:rgba(255,255,255,0.4);margin-top:24px}
        .login-prompt a{color:#6C63FF;text-decoration:none;font-weight:500}
        .login-prompt a:hover{text-decoration:underline}
      `}</style>
    </div>
  );
}
