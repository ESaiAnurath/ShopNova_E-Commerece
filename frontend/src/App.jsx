import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth
import Login    from "./pages/Login";
import Register from "./pages/Register";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import Products  from "./pages/admin/Products";
import Orders    from "./pages/admin/Orders";
import Users     from "./pages/admin/Users";
import Analytics from "./pages/admin/Analytics";
import Settings  from "./pages/admin/Settings";

// User pages
import Home      from "./pages/user/Home";
import Shop      from "./pages/user/Shop";
import Cart      from "./pages/user/Cart";
import MyOrders  from "./pages/user/MyOrders";
import Profile   from "./pages/user/Profile";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin only */}
          <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/products"  element={<AdminRoute><Products /></AdminRoute>} />
          <Route path="/orders"    element={<AdminRoute><Orders /></AdminRoute>} />
          <Route path="/users"     element={<AdminRoute><Users /></AdminRoute>} />
          <Route path="/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
          <Route path="/settings"  element={<AdminRoute><Settings /></AdminRoute>} />

          {/* User pages */}
          <Route path="/home"      element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/shop"      element={<ProtectedRoute><Shop /></ProtectedRoute>} />
          <Route path="/cart"      element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}