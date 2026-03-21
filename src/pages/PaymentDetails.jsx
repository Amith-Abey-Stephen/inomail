import { useNavigate, useLocation } from "react-router-dom";

function PaymentDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan, price } = location.state || { plan: "Starter", price: 499 };

  const handlePayment = () => {
    localStorage.setItem("isSubscribed", "true");
    localStorage.setItem("plan", plan);
    navigate("/payment-success", { state: { plan, price } });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 blur-[120px] rounded-full point-events-none" />
      
      <div className="glass-card bg-slate-900/80 border-slate-700 w-full max-w-md p-8 md:p-10 relative z-10 shadow-2xl">
        <h2 className="text-3xl font-black dash-gradient mb-2 text-center">Secure Checkout</h2>
        <p className="text-slate-400 mb-8 text-center text-sm md:text-base">Complete your subscription to {plan} plan</p>

        <div className="bg-black/20 p-6 rounded-2xl mb-8 border border-white/5 shadow-inner">
          <div className="flex justify-between mb-4 pb-4 border-b border-white/10">
            <span className="text-slate-400 font-medium">Selected Plan</span>
            <strong className="text-white font-bold">{plan}</strong>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-slate-400 font-medium">Billing Cycle</span>
            <span className="text-white font-medium">Monthly</span>
          </div>
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
            <span className="text-white font-bold text-lg">Total Amount</span>
            <span className="text-2xl font-black text-green-400">₹{price}</span>
          </div>
        </div>

        <button className="btn-primary w-full py-4 text-lg mb-6 shadow-sky-500/20" onClick={handlePayment}>
          Confirm & Pay Securely
        </button>

        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-medium mb-6">
          <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          256-bit SSL Secure Transaction
        </div>

        <p className="text-center text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
          By proceeding, you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default PaymentDetails;
