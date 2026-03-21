import { useNavigate, useLocation } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan, price } = location.state || { plan: "Starter", price: 499 };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 blur-[120px] rounded-full point-events-none" />
      
      <div className="glass-card bg-slate-900/80 border-slate-700 w-full max-w-md p-8 md:p-10 relative z-10 shadow-2xl text-center">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
        </div>

        <h2 className="text-3xl font-black text-green-400 mb-2">Payment Successful!</h2>
        <p className="text-slate-400 mb-8">Your subscription is now active.</p>

        <div className="bg-black/20 p-6 rounded-2xl mb-8 text-left border border-white/5 shadow-inner">
          <div className="flex justify-between mb-3 border-b border-white/5 pb-3">
            <span className="text-slate-400 font-medium">Plan</span>
            <strong className="text-white font-bold">{plan}</strong>
          </div>
          <div className="flex justify-between mb-3 border-b border-white/5 pb-3">
            <span className="text-slate-400 font-medium">Amount</span>
            <strong className="text-white font-bold">₹{price}</strong>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-slate-400 font-medium">Transaction ID</span>
            <span className="text-sky-400 text-sm font-semibold tracking-wide">TXN-{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
        </div>

        <button className="btn-primary w-full py-4 text-lg mb-6 shadow-green-500/20" onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </button>

        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          A confirmation email has been sent to your registered address.
        </p>
      </div>
    </div>
  );
}

export default PaymentSuccess;
