import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authService.login(form.email, form.password);
      login(data.token, data.user);

      // ✅ Route based on ROLE
      if (data.user.role === "ADMIN") {
        navigate("/dashboard");   // Admin → Dashboard
      } else {
        navigate("/home");        // User → Shopping page (future)
      }
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-bg">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
        <div className="grid-overlay" />
      </div>

      <div className="login-card">
        <div className="login-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="12" fill="url(#grad)" />
              <path d="M10 20L18 28L30 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40">
                  <stop stopColor="#6C63FF" />
                  <stop offset="1" stopColor="#3ECFCF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className="brand-name">ShopNova</h1>
            <p className="brand-sub">E-Commerce Platform</p>
          </div>
        </div>

        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="error-banner">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field">
            <label>Email Address</label>
            <div className="input-wrap">
              <span className="input-icon">✉</span>
              <input
                type="email" name="email"
                placeholder="you@example.com"
                value={form.email} onChange={handleChange}
                required autoComplete="email"
              />
            </div>
          </div>

          <div className="field">
            <label>Password</label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input
                type="password" name="password"
                placeholder="••••••••"
                value={form.password} onChange={handleChange}
                required autoComplete="current-password"
              />
            </div>
          </div>

          <div className="form-footer">
            <label className="remember">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot">Forgot password?</a>
          </div>

          <button type="submit" className={`login-btn ${loading?"loading":""}`} disabled={loading}>
            {loading ? <span className="spinner" /> : "Sign In"}
          </button>
        </form>

        <p className="register-prompt">
          Don't have an account? <a href="/register">Create one →</a>
        </p>

        {/* Admin hint box */}
        <div className="demo-hint">
          <div className="hint-row">
            <span>👑 Admin</span>
            <code>admin@shopnova.com / admin123</code>
          </div>
        </div>
      </div>

       <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
 
        * { box-sizing: border-box; margin: 0; padding: 0; }
 
        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a1a;
          font-family: 'Sora', sans-serif;
          position: relative;
          overflow: hidden;
        }
 
        .login-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
 
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.25;
        }
 
        .orb1 {
          width: 500px; height: 500px;
          background: #6C63FF;
          top: -150px; left: -150px;
          animation: float1 8s ease-in-out infinite;
        }
 
        .orb2 {
          width: 400px; height: 400px;
          background: #3ECFCF;
          bottom: -100px; right: -100px;
          animation: float2 10s ease-in-out infinite;
        }
 
        .orb3 {
          width: 300px; height: 300px;
          background: #FF6B9D;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation: float3 12s ease-in-out infinite;
        }
 
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
 
        @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,30px)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,-40px)} }
        @keyframes float3 { 0%,100%{transform:translate(-50%,-50%)} 50%{transform:translate(-45%,-55%)} }
 
        .login-card {
          position: relative;
          width: 100%;
          max-width: 460px;
          margin: 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 40px;
          backdrop-filter: blur(20px);
          box-shadow: 0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05);
          animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1);
        }
 
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
 
        .login-brand {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 32px;
        }
 
        .brand-icon svg { width: 44px; height: 44px; }
 
        .brand-name {
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.5px;
        }
 
        .brand-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.5px;
          margin-top: 2px;
        }
 
        .login-header {
          margin-bottom: 28px;
        }
 
        .login-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.8px;
        }
 
        .login-header p {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          margin-top: 6px;
        }
 
        .error-banner {
          background: rgba(255,80,80,0.15);
          border: 1px solid rgba(255,80,80,0.3);
          color: #ff8080;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          margin-bottom: 20px;
          display: flex;
          gap: 8px;
          align-items: center;
        }
 
        .login-form { display: flex; flex-direction: column; gap: 20px; }
 
        .field label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.6);
          margin-bottom: 8px;
          letter-spacing: 0.3px;
        }
 
        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
 
        .input-icon {
          position: absolute;
          left: 14px;
          font-size: 16px;
          pointer-events: none;
          filter: grayscale(0.5);
        }
 
        .input-wrap input {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          padding: 14px 14px 14px 44px;
          border-radius: 12px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
 
        .input-wrap input::placeholder { color: rgba(255,255,255,0.25); }
 
        .input-wrap input:focus {
          border-color: #6C63FF;
          background: rgba(108,99,255,0.08);
        }
 
        .form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }
 
        .remember {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
        }
 
        .forgot {
          color: #6C63FF;
          text-decoration: none;
          font-weight: 500;
        }
 
        .forgot:hover { text-decoration: underline; }
 
        .login-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #6C63FF, #3ECFCF);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0.3px;
          margin-top: 4px;
        }
 
        .login-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .login-btn:active { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
 
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
 
        @keyframes spin { to { transform: rotate(360deg); } }
 
        .register-prompt {
          text-align: center;
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          margin-top: 24px;
        }
 
        .register-prompt a { color: #6C63FF; text-decoration: none; font-weight: 500; }
        .register-prompt a:hover { text-decoration: underline; }
 
        .demo-hint {
          margin-top: 16px;
          padding: 12px 16px;
          background: rgba(108,99,255,0.1);
          border: 1px solid rgba(108,99,255,0.2);
          border-radius: 10px;
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          font-family: 'JetBrains Mono', monospace;
          text-align: center;
        }
 
        .demo-hint strong { color: rgba(255,255,255,0.6); }
      `}</style>
    </div>
  );
}
 