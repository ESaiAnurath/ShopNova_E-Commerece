import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"#08081a",color:"#6C63FF",fontFamily:"Sora,sans-serif",fontSize:"14px"}}>
        <div style={{textAlign:"center"}}>
          <div style={{width:"36px",height:"36px",border:"3px solid rgba(108,99,255,0.2)",borderTop:"3px solid #6C63FF",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 12px"}}/>
          Checking permissions...
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role !== "ADMIN") {
    return (
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"#08081a",fontFamily:"Sora,sans-serif",color:"#fff",flexDirection:"column",gap:"16px"}}>
        <div style={{fontSize:"48px"}}>🚫</div>
        <h2 style={{fontSize:"24px",fontWeight:"700"}}>Access Denied</h2>
        <p style={{color:"rgba(255,255,255,0.5)"}}>You need Admin privileges to access this page.</p>
        <a href="/home" style={{background:"linear-gradient(135deg,#6C63FF,#3ECFCF)",color:"#fff",padding:"10px 24px",borderRadius:"10px",textDecoration:"none",fontWeight:"600",fontSize:"14px"}}>Go to Home</a>
      </div>
    );
  }

  return children;
}