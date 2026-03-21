import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Toast from "./components/Toast";
import { toast } from "./utils/toast";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import SubscriptionDashboard from "./pages/SubscriptionDashboard";
import PaymentDetails from "./pages/PaymentDetails";
import PaymentSuccess from "./pages/PaymentSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const expiry = localStorage.getItem("sessionExpiry");
    if (expiry && Date.now() > parseInt(expiry)) {
      localStorage.clear();
      toast.warn("Your session has expired (1 hour). Please login again.");
      navigate("/login");
    }
  }, [location.pathname, navigate]);

  return (
    <>             
      <Toast />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* SUBSCRIPTION FLOW */}
        <Route path="/subscription" element={<SubscriptionDashboard />} />
        <Route path="/SubscriptionDashboard" element={<SubscriptionDashboard />} />
        <Route path="/payment" element={<PaymentDetails />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* MAIN DASHBOARD */}
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
<Route path="/superadmin" element={<SuperAdminDashboard />} />

      </Routes>

    </>
  );
}

export default App;
