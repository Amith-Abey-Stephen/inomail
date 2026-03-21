import { useEffect, useState } from "react";

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const { message, type } = e.detail;
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      
      setTimeout(() => {
        setToasts((prev) => prev.filter(t => t.id !== id));
      }, 5000);
    };

    window.addEventListener('custom-toast', handleToast);
    return () => window.removeEventListener('custom-toast', handleToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => {
        let colors = "bg-slate-800 border-slate-700 text-white shadow-slate-900/50";
        let icon = "ℹ️";
        
        if (toast.type === "success") {
          colors = "bg-green-500/10 border-green-500/50 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.15)] backdrop-blur-xl";
          icon = "✅";
        } else if (toast.type === "error") {
          colors = "bg-rose-500/10 border-rose-500/50 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.15)] backdrop-blur-xl";
          icon = "❌";
        } else if (toast.type === "warning") {
          colors = "bg-orange-500/10 border-orange-500/50 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.15)] backdrop-blur-xl";
          icon = "⚠️";
        }

        return (
          <div 
            key={toast.id} 
            className={`flex items-center gap-3 px-6 py-4 border rounded-xl shadow-2xl transition-all duration-300 pointer-events-auto transform translate-x-0 opacity-100 ${colors}`}
            style={{ animation: 'toastSlideIn 0.4s ease-out forwards' }}
          >
            <span className="text-xl shrink-0">{icon}</span>
            <span className="font-semibold text-sm lg:text-base">{toast.message}</span>
            <button 
              className="ml-4 text-slate-400 hover:text-white transition-colors p-1"
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
