import { useEffect, useRef, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import { toast } from "../utils/toast";

/* ── animated counter hook ── */
function useCounter(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ── discrete animated items (prevents top-level re-render loops) ── */
function AnimatedMetric({ target, duration, format }) {
  const count = useCounter(target, duration, true);
  return <>{format(count)}</>;
}
function AnimatedBar({ targetHeight, duration }) {
  const h = useCounter(targetHeight, duration, true);
  return <div className="w-full bg-gradient-to-t from-sky-500 to-green-400 rounded-t-sm transition-all duration-700 hover:opacity-100 opacity-80" style={{ height: `${h}%` }} />;
}

/* ── intersection observer hook ── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold: 0.2, ...options });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

/* ── typewriter hook ── */
function useTypewriter(words, speed = 90, pause = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    let timer;
    if (!deleting && charIdx < word.length) {
      timer = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === word.length) {
      timer = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timer = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx((w) => (w + 1) % words.length);
    }
    setDisplayed(word.slice(0, charIdx));
    return () => clearTimeout(timer);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return displayed;
}

/* ── tilt hook ── */
function useTilt() {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: "transform 0.1s ease-out",
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s ease-out",
    });
  };

  return { ref, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave, style };
}

/* ── stat item ── */
function StatItem({ intTarget, divisor = 1, decimals = 0, suffix, label, started }) {
  const raw = useCounter(intTarget, 1800, started);
  const display = (raw / divisor).toFixed(decimals);
  return (
    <div className="flex flex-col items-start gap-1">
      <span className="text-3xl md:text-4xl font-black dash-gradient leading-none">{display}{suffix}</span>
      <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function Home() {
  // const navigate = useNavigate();
  const [statsRef, statsInView] = useInView();
  const typed = useTypewriter(["Bulk Email Platform", "SMTP Automation", "Email Campaigns", "Delivery Analytics"]);

  const particles = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2
  })), []);

  const tiltProps = useTilt();

  return (
    
    <div className="bg-slate-900 min-h-screen pt-24 overflow-x-hidden">
      <Navbar />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-8" id="home">
        {/* Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: 'rgba(56, 189, 248, 0.4)',
              boxShadow: '0 0 10px rgba(56, 189, 248, 0.4)',
              animation: `pulse ${p.duration}s infinite alternate ${p.delay}s`
            }}
          />
        ))}

        {/* Blobs */}
        <div className="absolute top-0 -left-64 w-[500px] h-[500px] bg-sky-500/10 blur-[100px] rounded-full pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 -right-64 w-[500px] h-[500px] bg-green-500/10 blur-[100px] rounded-full pointer-events-none animate-pulse" style={{ animationDuration: '5s' }} />

        <div className="relative z-10 grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">

          {/* LEFT TEXT */}
          <div className="flex flex-col items-start text-left gap-6">
            <span className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 px-4 py-2 rounded-full text-sky-400 font-bold text-xs uppercase tracking-wider backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              Enterprise · Subscription SaaS
            </span>

            <h1 className="text-5xl md:text-6xl lg:text-6xl font-extrabold text-white leading-tight">
              Secure &amp; Scalable<br />
              <span className="dash-gradient">{typed}<span className="inline-block w-[3px] h-[1em] bg-white ml-1 animate-pulse align-middle"></span></span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed">
              InoMail empowers organizations to deliver high-volume,
              attachment-enabled emails using verified SMTP credentials —
              with real-time delivery tracking and analytics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
              <button className="btn-primary flex items-center justify-center gap-2" onClick={() => navigate("/register")}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                Start Free Trial
              </button>
              <button className="btn-outline" onClick={() => navigate("/login")}>
                Login to Dashboard
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-6 w-full pt-8 border-t border-slate-800" ref={statsRef}>
              <StatItem intTarget={999} divisor={10} decimals={1} suffix="%" label="Delivery Accuracy" started={statsInView} />
              <StatItem intTarget={50} suffix="K+" label="Emails / Day" started={statsInView} />
              <StatItem intTarget={500} suffix="+" label="Organizations" started={statsInView} />
            </div>
          </div>

          {/* RIGHT – MOCK DASHBOARD CARD */}
          <div className="relative w-full max-w-lg mx-auto lg:mr-0 z-20 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-500 to-green-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse" />

            <div
              className="relative glass-card bg-slate-800/80 border-slate-700 shadow-2xl p-0 overflow-hidden cursor-crosshair transform-gpu"
              {...tiltProps}
            >
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/50 border-b border-slate-700">
                <div className="w-3 h-3 rounded-full bg-red-500 hover:scale-125 transition-transform" />
                <div className="w-3 h-3 rounded-full bg-yellow-400 hover:scale-125 transition-transform" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs font-semibold text-slate-400">Campaign Console</span>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="bg-sky-500/10 rounded-xl p-2 sm:p-3 border border-sky-500/20 text-center hover:bg-sky-500/20 transition-colors flex flex-col justify-center">
                    <span className="block text-lg sm:text-2xl font-bold text-sky-400">
                      <AnimatedMetric target={12800} duration={2500} format={(c) => (c / 1000).toFixed(1)} />k
                    </span>
                    <span className="text-[8px] sm:text-xs text-sky-400 uppercase font-semibold">Sent</span>
                  </div>
                  <div className="bg-green-500/10 rounded-xl p-2 sm:p-3 border border-green-500/20 text-center hover:bg-green-500/20 transition-colors flex flex-col justify-center">
                    <span className="block text-lg sm:text-2xl font-bold text-green-400">
                      <AnimatedMetric target={99} duration={2000} format={(c) => c} />%
                    </span>
                    <span className="text-[8px] sm:text-xs text-green-400 uppercase font-semibold">Delivered</span>
                  </div>
                  <div className="bg-purple-500/10 rounded-xl p-2 sm:p-3 border border-purple-500/20 text-center hover:bg-purple-500/20 transition-colors flex flex-col justify-center">
                    <span className="block text-lg sm:text-2xl font-bold text-purple-400">
                      <AnimatedMetric target={47} duration={2000} format={(c) => c} />%
                    </span>
                    <span className="text-[8px] sm:text-xs text-purple-400 uppercase font-semibold">Opened</span>
                  </div>
                </div>

                <div className="flex items-end justify-between h-20 sm:h-24 gap-1 sm:gap-2 group/bars">
                  {[60, 80, 55, 90, 72, 95, 68, 85].map((h, i) => (
                    <AnimatedBar key={i} targetHeight={h} duration={1500 + i * 200} />
                  ))}
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="absolute -top-4 -right-1 md:-top-6 md:-right-6 scale-75 origin-top-right glass-card bg-slate-800/90 py-2 px-4 flex items-center gap-2 shadow-xl border-slate-700">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-bold text-slate-200 whitespace-nowrap">SMTP Verified</span>
            </div>
            <div className="absolute -bottom-4 -left-1 md:-bottom-6 md:-left-6 scale-75 origin-bottom-left glass-card bg-slate-800/90 py-2 px-4 flex items-center gap-2 shadow-xl border-slate-700">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span className="text-sm font-bold text-slate-200 whitespace-nowrap">Live Reports</span>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════ TRUSTED BY ═══════════════════ */}
      {/* <section className="py-12 border-y border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-8">Trusted by fast-growing teams</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition duration-500">
            {["Startup.io", "TechCorp", "AgencyPro", "CloudBase", "DevScale"].map((name) => (
              <span key={name} className="text-xl md:text-2xl font-black text-white">{name}</span>
            ))}
          </div>
        </div>
      </section> */}

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <section className="py-24 max-w-7xl mx-auto px-6" id="features">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-bold tracking-widest uppercase text-sm">Features</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 mb-4 text-white">Everything You Need to Scale</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Simple, powerful tools to send bulk emails with 99.9% accuracy</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Massive Bulk Sending", desc: "Send thousands of emails to your whole list in just one click.", color: "text-sky-400", borderHover: "hover:border-sky-500/40", shadowHover: "hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]", iconGlow: "group-hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]", titleHover: "group-hover:text-sky-100" },
            { title: "Verified SMTP Setup", desc: "Connect your own trusted email servers for better inbox delivery.", color: "text-green-400", borderHover: "hover:border-green-500/40", shadowHover: "hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]", iconGlow: "group-hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]", titleHover: "group-hover:text-green-100" },
            { title: "Real-Time Tracking", desc: "See instantly who received, opened, and read your emails.", color: "text-purple-400", borderHover: "hover:border-purple-500/40", shadowHover: "hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]", iconGlow: "group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]", titleHover: "group-hover:text-purple-100" },
            { title: "Instant CSV Upload", desc: "Import thousands of contacts from an Excel sheet in seconds.", color: "text-pink-400", borderHover: "hover:border-pink-500/40", shadowHover: "hover:shadow-[0_0_30px_rgba(236,72,153,0.2)]", iconGlow: "group-hover:shadow-[0_0_15px_rgba(236,72,153,0.4)]", titleHover: "group-hover:text-pink-100" },
            { title: "Smart Campaign Reports", desc: "Clear summaries of your delivery stats and success rates.", color: "text-yellow-400", borderHover: "hover:border-yellow-500/40", shadowHover: "hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]", iconGlow: "group-hover:shadow-[0_0_15px_rgba(234,179,8,0.4)]", titleHover: "group-hover:text-yellow-100" },
            { title: "Enterprise Security", desc: "Bank-grade encryption and strict privacy protocols for your data.", color: "text-sky-400", borderHover: "hover:border-sky-500/40", shadowHover: "hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]", iconGlow: "group-hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]", titleHover: "group-hover:text-sky-100" },
          ].map((f, i) => (
            <div 
              key={i} 
              className={`glass-card bg-[#151a25]/90 border-slate-700/50 hover:-translate-y-2 hover:bg-[#1e2330] ${f.borderHover} ${f.shadowHover} transition-all duration-300 group`}
            >
              <div className={`w-12 h-12 rounded-xl bg-slate-900/80 flex items-center justify-center mb-6 shadow-md border border-slate-700/50 ${f.color} ${f.iconGlow} transition-all duration-300`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <h3 className={`text-xl font-bold text-white mb-3 transition-colors duration-300 ${f.titleHover}`}>{f.title}</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="py-24 bg-slate-800/30 border-y border-slate-800" id="how">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-green-500 font-bold tracking-widest uppercase text-sm">Process</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-4 text-white">How It Works</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Get your campaigns running in minutes — not days</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Create Account", desc: "Sign up and choose a plan that fits your sending volume." },
              { num: "02", title: "Configure SMTP", desc: "Add your verified SMTP credentials securely." },
              { num: "03", title: "Upload Recipients", desc: "Import your email list via CSV or paste directly." },
              { num: "04", title: "Launch & Track", desc: "Send your campaign and monitor delivery in real-time." },
            ].map((step, i) => (
              <div key={i} className="relative text-center md:text-left">
                <div className="text-6xl font-black text-slate-800 mb-4">{step.num}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400">{step.desc}</p>
                {i < 3 && <div className="hidden md:block absolute top-8 left-full w-full h-[2px] bg-slate-800 -z-10" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PRICING ═══════════════════ */}
      <section className="py-24 max-w-7xl mx-auto px-6" id="pricing">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-bold tracking-widest uppercase text-sm">Pricing</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 mb-4 text-white">Simple, Transparent Pricing</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Plans designed for every stage of your business growth</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center">
          {[
            { name: "Starter", pop: false, price: "₹499", list: ["1,000 Emails / Month", "CSV Upload", "Basic Analytics"] },
            { name: "Enterprise", pop: true, price: "₹999", list: ["10,000 Emails / Month", "Secure Attachments", "Delivery Reports", "SMTP Authentication", "Priority Support"] },
            { name: "Ultimate", pop: false, price: "₹1,999", list: ["Unlimited Emails", "Advanced Analytics", "Dedicated Support", "Multiple SMTP", "SLA Guarantee"] },
          ].map((plan, i) => (
            <div 
              key={i} 
              className={`glass-card relative flex flex-col transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl ${
                plan.pop 
                  ? 'md:scale-105 border-sky-500/50 bg-slate-800/80 z-10 shadow-[0_0_40px_rgba(56,189,248,0.2)] hover:shadow-[0_20px_50px_rgba(56,189,248,0.3)]' 
                  : 'bg-slate-900/50 border-slate-700 hover:bg-slate-800/80 hover:border-slate-500 shadow-lg'
              }`}
            >
              {plan.pop && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-400 to-green-500 text-white font-bold px-4 py-1 rounded-full text-[10px] uppercase tracking-widest shadow-lg shadow-sky-500/40">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 text-center mt-4 transition-colors group-hover:text-blue-200">{plan.name}</h3>
              <div className="text-center my-6 transition-transform duration-500 hover:scale-105">
                <span className="text-4xl lg:text-5xl font-black text-white">{plan.price}</span>
                <span className="text-slate-400 text-sm"> /month</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1 mt-4">
                {plan.list.map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-slate-300 text-sm md:text-base transition-colors hover:text-white">
                    <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {item}
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full font-bold py-3 px-6 rounded-xl transition duration-300 ${
                  plan.pop 
                    ? "btn-primary hover:shadow-cyan-500/40" 
                    : "bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 hover:border-slate-600 hover:-translate-y-1 hover:shadow-lg"
                }`}
                onClick={() => navigate("/register")}
              >
                Select {plan.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ CONTACT ═══════════════════ */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative" id="contact">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="text-center mb-16 relative z-10">
          <span className="text-sky-400 font-bold tracking-widest uppercase text-sm">Get in Touch</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 mb-4 text-white">Contact Our Team</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Have questions about Enterprise plans or custom integrations? We're here to help.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 relative z-10 items-center">
          {/* Left: Contact Info */}
          <div className="space-y-6">
            <div className="glass-card bg-slate-800/50 border-slate-700/50 p-6 flex items-center gap-6 group hover:border-sky-500/30 transition-colors hover:-translate-y-1 cursor-default">
              <div className="w-14 h-14 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h4 className="text-white font-bold text-lg group-hover:text-sky-100 transition-colors">Email Support</h4>
                <p className="text-slate-400 group-hover:text-slate-300">support@inomail.com</p>
              </div>
            </div>
            
            <div className="glass-card bg-slate-800/50 border-slate-700/50 p-6 flex items-center gap-6 group hover:border-green-500/30 transition-colors hover:-translate-y-1 cursor-default">
              <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 group-hover:bg-green-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h4 className="text-white font-bold text-lg group-hover:text-green-100 transition-colors">Live Chat Engine</h4>
                <p className="text-slate-400 group-hover:text-slate-300">Available 24/7 for Enterprise</p>
              </div>
            </div>
            
            <div className="glass-card bg-slate-800/50 border-slate-700/50 p-6 flex items-center gap-6 group hover:border-purple-500/30 transition-colors hover:-translate-y-1 cursor-default">
              <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <div>
                <h4 className="text-white font-bold text-lg group-hover:text-purple-100 transition-colors">Direct Phone</h4>
                <p className="text-slate-400 group-hover:text-slate-300">+1 (800) 555-0198</p>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <form className="glass-card bg-slate-900/80 border-slate-700 p-8 flex flex-col gap-6 shadow-2xl" onSubmit={(e) => { e.preventDefault(); toast.success("Thanks for reaching out! Form simulated."); }}>
            <h3 className="text-2xl font-bold text-white mb-2">Send us a message</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">First Name</label>
                <input type="text" className="w-full bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 transition-colors placeholder:text-slate-500" placeholder="John" required />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">Last Name</label>
                <input type="text" className="w-full bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 transition-colors placeholder:text-slate-500" placeholder="Doe" required />
              </div>
            </div>
            
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">Email Address</label>
              <input type="email" className="w-full bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 transition-colors placeholder:text-slate-500" placeholder="john@company.com" required />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">Message</label>
              <textarea rows="4" className="w-full bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 transition-colors resize-none placeholder:text-slate-500" placeholder="How can we help you?" required></textarea>
            </div>

            <button type="submit" className="btn-primary w-full shadow-sky-500/20 shadow-lg mt-2 py-4">Send Message</button>
          </form>
        </div>
      </section>

      {/* ═══════════════════ CTA BANNER ═══════════════════ */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <div className="glass-card bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 text-center py-16 px-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sky-500/20 blur-[100px] rounded-full pointer-events-none" />
          <h2 className="text-4xl font-black text-white mb-6 relative z-10">Ready to Scale Your Email Operations?</h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto relative z-10">Join 500+ organizations using InoMail to deliver millions of emails reliably.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <button className="btn-primary" onClick={() => navigate("/register")}>Start Free Trial</button>
            <button className="btn-outline" onClick={() => navigate("/login")}>View Dashboard</button>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-slate-800 bg-slate-900 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="text-2xl font-black dash-gradient mb-4">InoMail</div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">Professional Bulk Email SaaS Platform for secure and scalable email automation at enterprise scale.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <div className="flex flex-col gap-3 text-sm text-slate-400">
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#pricing" className="hover:text-white transition">Pricing</a>
              <a href="#how" className="hover:text-white transition">How It Works</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <div className="flex flex-col gap-3 text-sm text-slate-400">
              <a href="/login" className="hover:text-white transition">Login</a>
              <a href="/register" className="hover:text-white transition">Sign Up</a>
              <a href="#contact" className="hover:text-white transition">Contact</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <div className="flex flex-col gap-3 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} InoMail. All rights reserved.</p>
          <p className="mt-4 md:mt-0 px-4 py-1 rounded-full bg-slate-800 text-slate-400">Built with ❤️ <a href="https://inovuslabs.org">Inovus Labs IEDC</a></p>
        </div>
      </footer>

    </div>
  );
}

export default Home;