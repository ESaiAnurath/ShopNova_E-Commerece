import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", background: "#08081a",
        color: "#6C63FF", fontFamily: "Sora, sans-serif", fontSize: "14px"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "36px", height: "36px",
            border: "3px solid rgba(108,99,255,0.2)",
            borderTop: "3px solid #6C63FF",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 12px"
          }} />
          Loading...
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
