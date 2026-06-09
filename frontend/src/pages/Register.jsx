import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";

export default function Register() {
  const [form, setForm] = useState({ 
    name: "",
    email: "", 
     reenteremail: "",
    phone: "",
    password: "", 
    otp: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [step, setStep] = useState(1);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleVerifyEmail = async () => {
    setError("");
    setSuccess("");
    if (!form.email) {
      setError("Please enter your email address");
      return;
    }
    
    setVerifyingEmail(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || "Failed to send OTP");
        return;
      }
      
      setSuccess("OTP sent to your email!");
      setOtpSent(true);
      setStep(2);
    } catch (err) {
      setError("Failed to send OTP: " + err.message);
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError("");
    setSuccess("");
    if (!form.otp) {
      setError("Please enter the OTP");
      return;
    }
    setVerifyingEmail(true);
    try {
      if (form.otp.length !== 6) {
        setError("OTP must be 6 digits");
        setVerifyingEmail(false);
        return;
      }
      
      const response = await fetch("http://localhost:8080/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp: form.otp })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || "Invalid OTP");
        return;
      }
      
      setSuccess("Email verified successfully!");
      setEmailVerified(true);
      setStep(3);
    } catch (err) {
      setError("Verification failed: " + err.message);
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!emailVerified) {
      setError("Please verify your email first");
      return;
    }
    if (!form.password) {
      setError("Please enter a password");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!form.phone || form.phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          name: form.name,
          phone: form.phone,
          otp: form.otp
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }
      
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    window.location.href = "https://accounts.google.com/o/oauth2/auth";
  };

  return (
    <div className="amazon-reg-container">
      <div className="amazon-reg-wrapper">
        {/* Header */}
        <div className="amazon-header">
          <h1 className="amazon-logo">ShopNova</h1>
        </div>

        {/* Main Form */}
        <div className="amazon-form-container">
          <h2 className="form-title">Create Account</h2>

          {error && <div className="amazon-alert error">{error}</div>}
          {success && <div className="amazon-alert success">{success}</div>}

          {step === 1 && (
            <div className="amazon-form-section">
              <div className="form-field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={emailVerified}
                  className="amazon-input"
                />
              </div>
              <button
                type="button"
                onClick={handleVerifyEmail}
                disabled={verifyingEmail || !form.email || emailVerified}
                className="amazon-verify-btn"
              >
                {verifyingEmail ? "Sending OTP..." : emailVerified ? "✓ Verified" : "Send OTP"}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="amazon-form-section">
              <div className="form-field">
                <label>Enter OTP</label>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  value={form.otp}
                  onChange={handleChange}
                  maxLength="6"
                  className="amazon-input"
                />
                <small className="resend-text">Didn't receive? <button
  type="button"
  onClick={handleVerifyEmail}
>
  Resend OTP
</button></small>
              </div>
              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={verifyingEmail || form.otp.length !== 6}
                className="amazon-verify-btn"
              >
                {verifyingEmail ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="amazon-form-section">
              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="amazon-input disabled"
                />
              </div>

              <div className="form-field">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  className="amazon-input"
                />
              </div>

              <div className="form-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your 10-digit phone number"
                  value={form.phone}
                  onChange={handleChange}
                  className="amazon-input"
                />
              </div>

              <div className="form-field">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  className="amazon-input"
                />
              </div>

              <button
                type="submit"
                disabled={
  loading ||
  !form.name ||
  !form.phone ||
  !form.password
}disabled={loading || !form.password || !form.mobile}
                className="amazon-submit-btn"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}

          {step === 1 && (
            <>
              <div className="divider">or</div>

              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="google-btn"
              >
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="amazon-footer">
          <p>Already have an account? <a href="/login">Sign in</a></p>
        </div>
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }

        .amazon-reg-container {
          min-height: 100vh;
          background-color: #f5f5f5;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .amazon-reg-wrapper {
          width: 100%;
          max-width: 400px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 40px;
        }

        .amazon-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e7e7e7;
        }

        .amazon-logo {
          font-size: 32px;
          font-weight: 700;
          color: #FF9900;
          letter-spacing: -1px;
          margin: 0;
        }

        .form-title {
          font-size: 28px;
          font-weight: 700;
          color: #0a0a0a;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .amazon-alert {
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 20px;
          font-size: 14px;
          line-height: 1.5;
        }

        .amazon-alert.error {
          background-color: #fee;
          color: #c41;
          border: 1px solid #e7b5b5;
        }

        .amazon-alert.success {
          background-color: #efe;
          color: #2b7000;
          border: 1px solid #b7e7b5;
        }

        .amazon-form-container {
          display: flex;
          flex-direction: column;
        }

        .amazon-form-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-field label {
          font-size: 13px;
          font-weight: 600;
          color: #0a0a0a;
        }

        .amazon-input {
          padding: 10px 12px;
          font-size: 14px;
          border: 1px solid #bbb;
          border-radius: 4px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .amazon-input:focus {
          border-color: #FF9900;
          box-shadow: 0 0 0 2px rgba(255, 153, 0, 0.15);
        }

        .amazon-input.disabled {
          background-color: #f9f9f9;
          color: #999;
          cursor: not-allowed;
        }

        .amazon-verify-btn {
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 600;
          background-color: #FF9900;
          color: white;
          border: 1px solid #FF9900;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s, border-color 0.2s;
          width: 100%;
        }

        .amazon-verify-btn:hover:not(:disabled) {
          background-color: #e68a00;
          border-color: #e68a00;
        }

        .amazon-verify-btn:disabled {
          background-color: #ccc;
          border-color: #ccc;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .amazon-submit-btn {
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 600;
          background-color: #FF9900;
          color: white;
          border: 1px solid #FF9900;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s, border-color 0.2s, box-shadow 0.2s;
          width: 100%;
          margin-top: 10px;
        }

        .amazon-submit-btn:hover:not(:disabled) {
          background-color: #e68a00;
          border-color: #e68a00;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
        }

        .amazon-submit-btn:disabled {
          background-color: #ccc;
          border-color: #ccc;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .resend-text {
          font-size: 12px;
          color: #666;
          margin-top: 6px;
        }

        .resend-text a {
          color: #0066c0;
          text-decoration: none;
          cursor: pointer;
        }

        .resend-text a:hover {
          color: #c45911;
        }

        .divider {
          text-align: center;
          margin: 20px 0;
          font-size: 12px;
          color: #666;
          position: relative;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #ddd;
          z-index: 0;
        }

        .divider {
          position: relative;
          z-index: 1;
          background: white;
          padding: 0 10px;
          display: inline-block;
          width: 100%;
        }

        .google-btn {
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 600;
          background-color: white;
          color: #222;
          border: 1px solid #bbb;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background-color 0.2s, border-color 0.2s;
          width: 100%;
        }

        .google-btn:hover {
          background-color: #f8f8f8;
          border-color: #999;
        }

        .google-icon {
          width: 18px;
          height: 18px;
        }

        .amazon-footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e7e7e7;
          text-align: center;
          font-size: 13px;
          color: #666;
        }

        .amazon-footer a {
          color: #0066c0;
          text-decoration: none;
        }

        .amazon-footer a:hover {
          color: #c45911;
          text-decoration: underline;
        }

        @media (max-width: 600px) {
          .amazon-reg-wrapper {
            padding: 20px;
          }

          .form-title {
            font-size: 24px;
          }

          .amazon-logo {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
}
