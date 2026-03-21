import { useNavigate } from "react-router-dom";

function SubscriptionDashboard() {
  const navigate = useNavigate();

  const handleSubscribe = (plan, price) => {
    navigate("/payment", {
      state: { plan, price },
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-32 pb-24 px-6 overflow-hidden relative">
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-sky-500/15 blur-[120px] rounded-full point-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-green-500/15 blur-[120px] rounded-full point-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 text-center mb-16">
        <span className="inline-block bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4.5 shadow-sm">
          Subscription Plans
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-5xl font-black dash-gradient mb-6 leading-tight">Choose the Right Plan for Your Business</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          InoMail offers flexible subscription plans to support startups,
          growing teams, and enterprises with secure bulk email delivery.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 items-center relative z-10">
        
        {/* BASIC */}
        <div className="glass-card bg-slate-900 border-slate-700 flex flex-col items-center">
          <div className="w-full text-center p-8 flex-1 flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
            <p className="text-slate-400 text-sm mb-6 pb-6 border-b border-slate-700">Ideal for individuals & small startups</p>
            <div className="text-4xl font-black text-white mb-8">₹499 <span className="text-lg font-normal text-slate-400">/ month</span></div>

            <ul className="text-left space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-slate-300 font-medium"><svg className="shrink-0 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg> 1,000 emails per month</li>
              <li className="flex items-center gap-3 text-slate-300 font-medium"><svg className="shrink-0 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg> CSV recipient upload</li>
              <li className="flex items-center gap-3 text-slate-300 font-medium"><svg className="shrink-0 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg> Basic templates</li>
              <li className="flex items-center gap-3 text-slate-300 font-medium"><svg className="shrink-0 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg> Email support</li>
              <li className="flex items-center gap-3 text-slate-600 font-medium"><svg className="shrink-0 w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg> Attachments</li>
              <li className="flex items-center gap-3 text-slate-600 font-medium"><svg className="shrink-0 w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg> Analytics</li>
            </ul>

            <button className="btn-outline w-full" onClick={() => handleSubscribe("Basic", 499)}>
              Select Starter
            </button>
          </div>
        </div>

        {/* STANDARD - HIGHLIGHT */}
        <div className="glass-card bg-slate-800 border-sky-500/30 flex flex-col items-center relative transform md:scale-105 shadow-2xl shadow-sky-500/10 z-20">
          <div className="absolute -top-4 bg-sky-500 text-white font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest shadow-lg shadow-sky-500/20">MOST POPULAR</div>
          <div className="w-full text-center p-8 flex-1 flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-2 pt-2">Enterprise</h3>
            <p className="text-sky-300 text-sm mb-6 pb-6 border-b border-slate-700">Best for growing businesses</p>
            <div className="text-4xl font-black text-white mb-8">₹999 <span className="text-lg font-normal text-slate-400">/ month</span></div>

            <ul className="text-left space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-slate-200 font-medium"><svg className="shrink-0 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg> 10,000 emails per month</li>
              <li className="flex items-center gap-3 text-slate-200 font-medium"><svg className="shrink-0 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg> CSV & Excel upload</li>
              <li className="flex items-center gap-3 text-slate-200 font-medium"><svg className="shrink-0 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg> File attachments</li>
              <li className="flex items-center gap-3 text-slate-200 font-medium"><svg className="shrink-0 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg> Delivery reports</li>
              <li className="flex items-center gap-3 text-slate-200 font-medium"><svg className="shrink-0 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg> SMTP authentication</li>
              <li className="flex items-center gap-3 text-slate-200 font-medium"><svg className="shrink-0 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg> Priority support</li>
            </ul>

            <button className="btn-primary w-full" onClick={() => handleSubscribe("Standard", 999)}>
              Select Enterprise
            </button>
          </div>
        </div>

        {/* PREMIUM */}
        <div className="glass-card bg-slate-900 border-slate-700 flex flex-col items-center">
          <div className="w-full text-center p-8 flex-1 flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-2">Ultimate</h3>
            <p className="text-slate-400 text-sm mb-6 pb-6 border-b border-slate-700">Designed for heavy enterprises</p>
            <div className="text-4xl font-black text-white mb-8">₹1999 <span className="text-lg font-normal text-slate-400">/ month</span></div>

            <ul className="text-left space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-slate-300 font-medium"><svg className="shrink-0 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg> Unlimited campaigns</li>
              <li className="flex items-center gap-3 text-slate-300 font-medium"><svg className="shrink-0 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg> Large attachments</li>
              <li className="flex items-center gap-3 text-slate-300 font-medium"><svg className="shrink-0 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg> Advanced Analytics</li>
              <li className="flex items-center gap-3 text-slate-300 font-medium"><svg className="shrink-0 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg> Custom SMTP</li>
              <li className="flex items-center gap-3 text-slate-300 font-medium"><svg className="shrink-0 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg> Dedicated Support</li>
              <li className="flex items-center gap-3 text-slate-300 font-medium"><svg className="shrink-0 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg> SLA Guaranteed</li>
            </ul>

            <button className="btn-outline w-full" onClick={() => handleSubscribe("Premium", 1999)}>
              Select Ultimate
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SubscriptionDashboard;
