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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authService.login(form.email, form.password);
      login(data.token, data.user);
      if (data.user.role === "ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-shell">
        <div className="brand-row">
          <span className="brand-mark">S</span>
          <div>
            <div className="brand-name">ShopNova</div>
            <div className="brand-sub">Sign in to continue</div>
          </div>
        </div>

        <div className="login-card">
          <h2>Sign in</h2>
          <p>Use your ShopNova account to access your orders, wishlist, and cart.</p>

          {error && <div className="error-banner">⚠ {error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <label>
              Email or mobile phone number
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </label>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing in..." : "Continue"}
            </button>
          </form>

          <div className="login-footer">
            <a href="#">Need help?</a>
            <span>New to ShopNova? <a href="/register">Create your account</a></span>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .login-root{min-height:100vh;background:#f3f3f3;display:flex;align-items:center;justify-content:center;font-family:'Roboto',Arial,sans-serif;padding:20px}
        .login-shell{max-width:420px;width:100%;}
        .brand-row{display:flex;align-items:center;gap:16px;margin-bottom:24px}
        .brand-mark{width:44px;height:44px;border-radius:12px;background:#FF9900;color:#111;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:22px}
        .brand-name{font-size:24px;font-weight:800;color:#111}
        .brand-sub{font-size:14px;color:#4B5563;}
        .login-card{background:#fff;border:1px solid #dcdcdc;border-radius:12px;padding:28px;box-shadow:0 18px 60px rgba(0,0,0,0.08);}
        .login-card h2{font-size:24px;font-weight:700;color:#111;margin-bottom:6px}
        .login-card p{font-size:14px;color:#4B5563;margin-bottom:24px;line-height:1.6}
        .error-banner{background:#fee2e2;border:1px solid #fecaca;color:#b91c1c;padding:12px 14px;border-radius:8px;margin-bottom:18px}
        .login-form{display:flex;flex-direction:column;gap:16px}
        .login-form label{display:flex;flex-direction:column;gap:8px;font-size:14px;color:#111;font-weight:500}
        .login-form input{padding:14px 16px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;color:#111;outline:none}
        .login-form input:focus{border-color:#ff9900;box-shadow:0 0 0 4px rgba(255,153,0,0.16)}
        .login-btn{width:100%;padding:14px 16px;border:none;border-radius:8px;background:#FF9900;color:#111;font-size:15px;font-weight:700;cursor:pointer;transition:opacity 0.2s;}
        .login-btn:disabled{opacity:0.7;cursor:not-allowed}
        .login-footer{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:18px;font-size:13px;color:#4B5563;}
        .login-footer a{color:#007185;text-decoration:none}
        .login-footer a:hover{text-decoration:underline}
      `}</style>
    </div>
  );
}
