import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
  return (
    <>
      <Navbar />
              

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* SUBSCRIPTION FLOW */}
        <Route path="/subscription" element={<SubscriptionDashboard />} />
        <Route path="/payment" element={<PaymentDetails />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* MAIN DASHBOARD */}
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
<Route path="/superadmin" element={<SuperAdminDashboard />} />

      </Routes>

      <Footer />
    </>
  );
}

export default App;
