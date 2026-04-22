"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { 
  ArrowRight, Zap, Database, Lock, Layers, 
  Check, Users, Lightbulb, Rocket,
  Mail, MessageSquare, MapPin, Shield
} from "lucide-react";

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const plans = [
    {
      name: "Starter",
      price: "Free",
      desc: "Perfect for testing the platform.",
      features: [
        "1 Organization",
        "Up to 100 emails/month",
        "Basic AI Templates",
        "Community Support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "₹29",
      period: "/month",
      desc: "For growing organizations.",
      features: [
        "Unlimited Organizations",
        "Up to 10,000 emails/month",
        "Advanced AI Generation",
        "Priority Queue Processing",
        "3 Asset Groups per Campaign",
        "Email Support",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "For massive scale.",
      features: [
        "Unlimited Everything",
        "Dedicated Queue Worker",
        "Custom Rate Limiting",
        "24/7 Phone Support",
        "SLA Guarantee",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setSubmitted(true);
      setFormState({ firstName: "", lastName: "", email: "", message: "" });
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mouse Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-purple-500/5 blur-[80px] rounded-full"></div>
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-blue-500/5 blur-[60px] rounded-full"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-32 md:pb-32 px-4 md:px-6">
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col items-center"
          >
            <motion.div 
              variants={fadeIn} 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8 backdrop-blur-md cursor-default"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary/50"></span>
              Introducing InoMail 1.0
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Start Sending <span className="text-gradient">Smarter Emails</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-10">
              The AI-powered bulk email platform designed for organizations. Personalize using Excel data, avoid spam filters, and track your success with ease.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/signup"
                  className="group relative inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl overflow-hidden w-full sm:w-auto"
                >
                  <span className="relative z-10">Get Started for Free</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-colors backdrop-blur-md w-full sm:w-auto"
                >
                  View Pricing
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Abstract Dashboard Mockup */}
        <div 
          className="container mx-auto max-w-5xl mt-20 relative px-4"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: 1000 }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ 
              opacity: 1, 
              y: [0, -15, 0],
            }}
            transition={{ 
              opacity: { duration: 1, delay: 0.4 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{ 
              rotateX, 
              rotateY,
              transformStyle: "preserve-3d"
            }}
            className="relative"
          >
            {/* Floating Elements */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              style={{ translateZ: 100 }}
              className="absolute -top-12 -left-12 z-30 glass p-5 rounded-2xl shadow-2xl hidden lg:block border border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Check className="text-green-500 w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Global Status</p>
                  <p className="text-base font-bold text-white">All Campaigns Sent</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              style={{ translateZ: 120 }}
              className="absolute -bottom-12 -right-12 z-30 glass p-5 rounded-2xl shadow-2xl hidden lg:block border border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Users className="text-primary w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Total Audience</p>
                  <p className="text-base font-bold text-white">12,480 Verified</p>
                </div>
              </div>
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 h-full w-full bottom-0 top-1/2 pointer-events-none"></div>
            <div className="glass-card rounded-2xl md:rounded-[2rem] border border-white/10 p-4 md:p-8 aspect-[16/10] relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              
              <div className="h-full w-full flex flex-col gap-6 relative z-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/40 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/40 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/40 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                  </div>
                  <div className="h-8 px-4 bg-white/5 rounded-full border border-white/10 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Nodes Active</span>
                  </div>
                </div>
                <div className="flex gap-8 h-full">
                  <div className="w-56 h-full rounded-2xl bg-white/[0.03] border border-white/5 hidden md:flex flex-col p-6 gap-6">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 opacity-50">Menu</div>
                    {["Dashboard", "Campaigns", "Templates", "Audience", "Settings"].map((item, i) => (
                      <div key={i} className={`h-10 w-full rounded-xl flex items-center px-4 gap-4 transition-all ${i === 1 ? "bg-primary/20 text-white border border-primary/20 shadow-lg shadow-primary/10" : "text-gray-400 hover:text-gray-200"}`}>
                        <div className={`w-2 h-2 rounded-full ${i === 1 ? "bg-primary" : "bg-white/10"}`}></div>
                        <span className="text-xs font-bold tracking-wide">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 h-full flex flex-col gap-6">
                    <div className="h-32 w-full rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-transparent border border-white/10 p-6 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Live Campaign</p>
                        <h4 className="text-xl font-bold text-white mb-1">Inovus Product Launch</h4>
                        <p className="text-xs text-gray-400">Broadcasting to segment <span className="text-white font-medium">IEDC Core</span></p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">84%</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Progress</p>
                        </div>
                        <div className="relative w-16 h-16">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle className="text-white/10" strokeWidth="4" stroke="currentColor" fill="transparent" r="28" cx="32" cy="32"/>
                            <circle className="text-primary" strokeWidth="4" strokeDasharray={28 * 2 * Math.PI} strokeDashoffset={28 * 2 * Math.PI * (1 - 0.84)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="28" cx="32" cy="32"/>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 w-full rounded-2xl bg-white/[0.03] border border-white/5 p-6">
                      <div className="flex justify-between items-center mb-8">
                        <h5 className="text-sm font-bold text-white tracking-wide">Recent Campaign History</h5>
                        <div className="h-8 px-4 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg flex items-center cursor-pointer transition-colors">
                          <span className="text-[10px] text-primary font-black uppercase tracking-widest">Download Audit</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {[
                          { name: "Summer Sale Blast", reach: "2,480", status: "Finished", color: "bg-green-400" },
                          { name: "Weekly Dev Update", reach: "1,240", status: "Running", color: "bg-primary" },
                          { name: "Welcome Series v2", reach: "940", status: "Paused", color: "bg-yellow-400" }
                        ].map((camp, i) => (
                          <div key={i} className="h-14 w-full rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between px-6 hover:bg-white/[0.04] transition-colors cursor-default">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                                <Mail className="w-5 h-5 text-gray-400" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-100">{camp.name}</p>
                                <p className="text-[10px] text-gray-500 font-medium">{camp.reach} recipients • 12m ago</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                              <div className={`w-1.5 h-1.5 rounded-full ${camp.color} shadow-[0_0_8px_currentColor]`}></div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{camp.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section (Logo Cloud) */}
      <section className="py-12 border-y border-white/5 bg-black/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-8">Trusted by teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            {["Inovus", "IEDC", "KJS", "Startup Mission", "Google Cloud"].map((logo) => (
              <span key={logo} className="text-xl md:text-2xl font-bold text-white tracking-tighter">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose InoMail?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to send bulk emails without the headache. Built for scale, designed for simplicity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-yellow-400" />,
                title: "AI Email Generation",
                desc: "Describe your campaign, and our Gemini AI integration writes the perfect HTML email for you. Live preview and edit capability."
              },
              {
                icon: <Database className="w-8 h-8 text-blue-400" />,
                title: "Excel Data Import",
                desc: "Upload Excel files with structured data to instantly personalize emails for thousands of recipients."
              },
              {
                icon: <Layers className="w-8 h-8 text-purple-400" />,
                title: "Smart Queue & Delivery",
                desc: "Prevent spam blocks with intelligent BullMQ-backed rate limiting. Schedule sends or dispatch immediately."
              },
              {
                icon: <Lock className="w-8 h-8 text-green-400" />,
                title: "Multi-Tenant Workspaces",
                desc: "Create and switch between multiple organizations. Assign roles and isolate templates, assets, and history."
              },
              {
                icon: <Rocket className="w-8 h-8 text-indigo-400" />,
                title: "Advanced Analytics",
                desc: "Track open rates via tracking pixels, monitor link clicks, and detect bounces with real-time reporting."
              },
              {
                icon: <Shield className="w-8 h-8 text-red-400" />,
                title: "Enterprise Security",
                desc: "Encrypted credentials, role-based access, and full anti-spam compliance built into the core."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="glass-card p-8 rounded-3xl transition-colors group hover:bg-white/[0.07] hover:border-primary/30"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative bg-white/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Choose the plan that fits your organization's needs. Scale seamlessly as you grow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`glass-card p-8 rounded-3xl relative transition-all ${
                  plan.popular ? "border-primary/50 shadow-[0_0_30px_rgba(99,102,241,0.15)] md:-translate-y-4" : "border-white/5"
                }`}
              >
                {plan.popular && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full"
                  >
                    MOST POPULAR
                  </motion.div>
                )}
                
                <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.desc}</p>
                
                <div className="mb-8">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-400 text-sm">{plan.period}</span>}
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <motion.li 
                      key={j} 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + (j * 0.05) }}
                      className="flex items-start gap-3"
                    >
                      <Check className="w-5 h-5 text-green-400 shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={plan.name === "Enterprise" ? "#contact" : "/signup"}
                    className={`block w-full text-center py-3 rounded-full font-medium transition-colors ${
                      plan.popular
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-6xl font-bold mb-6 tracking-tight">Our <span className="text-gradient">Mission</span></h2>
            <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
              InoMail was born out of a simple necessity: sending personalized, bulk emails shouldn't be complicated, and it shouldn't land you in the spam folder.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {[
              { icon: <Users className="text-primary w-8 h-8" />, title: "Student Driven", desc: "A project initiated and driven by passionate student developers.", bg: "bg-primary/20", border: "border-primary/20" },
              { icon: <Lightbulb className="text-yellow-400 w-8 h-8" />, title: "Innovation First", desc: "Leveraging cutting-edge AI and robust queueing technologies.", bg: "bg-yellow-400/20", border: "border-yellow-400/20" },
              { icon: <Rocket className="text-green-400 w-8 h-8" />, title: "Built for Scale", desc: "Designed to handle millions of emails seamlessly and efficiently.", bg: "bg-green-400/20", border: "border-green-400/20" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`glass-card p-8 rounded-[2.5rem] text-center border ${item.border} hover:bg-white/[0.05] transition-all duration-500`}
              >
                <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-black/20`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass p-12 rounded-[3rem] relative overflow-hidden group border border-white/5 shadow-2xl"
          >
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none group-hover:bg-primary/30 transition-all duration-1000"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-8 text-white leading-tight">Built with ❤️ by <br/><span className="text-gradient">Inovus Labs IEDC</span></h2>
                <div className="space-y-6">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Inovus Labs IEDC is an innovation ecosystem that empowers students to build production-level solutions. 
                  </p>
                  <p className="text-gray-400 leading-relaxed">
                    InoMail is a testament to what student developers can achieve when given the right environment, mentorship, and vision.
                  </p>
                  <div className="pt-4">
                    <Link href="https://inovuslabs.org" target="_blank" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                      Learn more about Inovus <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="relative aspect-video rounded-2xl overflow-hidden glass border border-white/10 group-hover:border-white/20 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                   <Rocket className="w-16 h-16 text-white/20" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Trusted by Industry <br/> <span className="text-gradient">Visionaries</span></h2>
              <p className="text-gray-400 text-lg mb-8">
                InoMail isn't just a tool; it's a competitive advantage for organizations that value clear, personalized communication at scale.
              </p>
              <div className="flex gap-4">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-background bg-white/10"></div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">500+ Organizations</span>
                  <span className="text-sm text-gray-500">already switched to InoMail</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {[
                { name: "Sarah Chen", role: "Marketing Director", quote: "The AI generation is a game changer. We've reduced our campaign creation time by 80%." },
                { name: "Marcus Thorne", role: "Ops Lead", quote: "Finally a bulk email tool that handles Excel data correctly without breaking formatting." }
              ].map((t, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="glass p-8 rounded-3xl relative"
                >
                  <div className="absolute top-8 right-8 text-white/5">
                    <Mail className="w-16 h-16" />
                  </div>
                  <p className="text-lg text-gray-300 italic mb-6">"{t.quote}"</p>
                  <div>
                    <p className="font-bold text-white">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>      {/* Contact Section */}
      <section id="contact" className="py-32 relative bg-black/40">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Get in <span className="text-gradient">Touch</span></h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Our team typically responds within 2 hours.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3 glass p-1 md:p-2 rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden"
            >
              <div className="bg-black/40 rounded-[2.2rem] p-8 md:p-8">
                {submitted ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-[400px] flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-green-500/10">
                      <Check className="w-12 h-12 text-green-500" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-white">Message Received!</h3>
                    <p className="text-gray-400 text-lg max-w-sm">Thank you for reaching out. A specialist will get back to you shortly.</p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="mt-10 px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-medium"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">First Name</label>
                        <input 
                          type="text" 
                          required
                          value={formState.firstName}
                          onChange={(e) => setFormState({ ...formState, firstName: e.target.value })}
                          className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary focus:bg-white/[0.05] transition-all placeholder:text-gray-600 shadow-inner" 
                          placeholder="John" 
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Last Name</label>
                        <input 
                          type="text" 
                          value={formState.lastName}
                          onChange={(e) => setFormState({ ...formState, lastName: e.target.value })}
                          className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary focus:bg-white/[0.05] transition-all placeholder:text-gray-600 shadow-inner" 
                          placeholder="Doe" 
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Work Email</label>
                      <input 
                        type="email" 
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary focus:bg-white/[0.05] transition-all placeholder:text-gray-600 shadow-inner" 
                        placeholder="john@company.com" 
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">How can we help?</label>
                      <textarea 
                        rows={5} 
                        required
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary focus:bg-white/[0.05] transition-all resize-none placeholder:text-gray-600 shadow-inner" 
                        placeholder="Tell us about your needs..."
                      ></textarea>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <motion.button 
                      whileHover={{ scale: 1.01, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting}
                      className="bg-primary text-white font-bold py-2 rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? "Sending Dispatch..." : (
                        <>
                          Send Message
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 flex flex-col gap-10 justify-center"
            >
              {[
                { icon: <Mail className="w-6 h-6" />, title: "Direct Support", desc: "For technical queries and account help.", info: "support@inovuslabs.org", link: "mailto:support@inovuslabs.org", color: "text-blue-400", bg: "bg-blue-400/10" },
                { icon: <MessageSquare className="w-6 h-6" />, title: "Sales & Partnerships", desc: "For custom enterprise solutions.", info: "sales@inovuslabs.org", link: "mailto:sales@inovuslabs.org", color: "text-purple-400", bg: "bg-purple-400/10" },
                { icon: <MapPin className="w-6 h-6" />, title: "Our Office", desc: "Inovus Labs IEDC Innovation Hub.", info: "Kerala, India", color: "text-green-400", bg: "bg-green-400/10" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group flex items-start gap-6 p-6 rounded-3xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all duration-300"
                >
                  <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-500`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-white">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-2">{item.desc}</p>
                    {item.link ? (
                      <a href={item.link} className="text-primary font-bold hover:text-primary/80 transition-colors text-sm">
                        {item.info}
                      </a>
                    ) : (
                      <span className="text-gray-300 font-medium text-sm">{item.info}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
}
