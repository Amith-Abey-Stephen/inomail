"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
      price: "$29",
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* ... Hero, Features, Pricing, About sections stay the same ... */}
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 md:px-6 overflow-hidden">
        {/* ... (keep existing hero content) ... */}
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col items-center"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              Introducing InoMail 1.0
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Start Sending <span className="text-gradient">Smarter Emails</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-10">
              The AI-powered bulk email platform designed for organizations. Personalize using Excel data, avoid spam filters, and track your success with ease.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/signup"
                className="group relative inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(255,255,255,0.5)] overflow-hidden"
              >
                <span className="relative z-10">Get Started for Free</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-colors backdrop-blur-md"
              >
                View Pricing
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Abstract Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="container mx-auto max-w-6xl mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 h-full w-full bottom-0 top-1/2"></div>
          <div className="glass-card rounded-2xl md:rounded-t-[2rem] border-b-0 p-4 md:p-8 aspect-video relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            <div className="h-full w-full flex flex-col gap-4 relative z-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex gap-6 h-full">
                <div className="w-1/4 h-full rounded-xl bg-white/5 border border-white/5 hidden md:flex flex-col p-4 gap-4">
                  <div className="h-8 w-2/3 bg-white/10 rounded-md"></div>
                  <div className="h-4 w-1/2 bg-white/5 rounded-md mt-4"></div>
                  <div className="h-4 w-3/4 bg-white/5 rounded-md"></div>
                  <div className="h-4 w-2/3 bg-white/5 rounded-md"></div>
                </div>
                <div className="flex-1 h-full flex flex-col gap-4">
                  <div className="h-24 w-full rounded-xl bg-gradient-to-r from-primary/20 to-purple-500/20 border border-white/10 p-6 flex flex-col justify-center">
                    <div className="h-4 w-1/4 bg-white/20 rounded-md mb-2"></div>
                    <div className="h-8 w-1/3 bg-white/30 rounded-md"></div>
                  </div>
                  <div className="flex-1 w-full rounded-xl bg-white/5 border border-white/5 p-6">
                    <div className="flex justify-between mb-6">
                      <div className="h-6 w-1/4 bg-white/10 rounded-md"></div>
                      <div className="h-8 w-24 bg-primary/40 rounded-full"></div>
                    </div>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 w-full rounded-lg bg-white/5 mb-3 flex items-center px-4">
                        <div className="h-3 w-1/3 bg-white/10 rounded-md"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose InoMail?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to send bulk emails without the headache. Built for scale, designed for simplicity.
            </p>
          </div>

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
              <div key={i} className="glass-card p-8 rounded-3xl hover:bg-white/5 transition-all group hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative bg-white/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Choose the plan that fits your organization's needs. Scale seamlessly as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card p-8 rounded-3xl relative ${
                  plan.popular ? "border-primary/50 shadow-[0_0_30px_rgba(99,102,241,0.15)] md:-translate-y-4" : "border-white/5"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                
                <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.desc}</p>
                
                <div className="mb-8">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-400 text-sm">{plan.period}</span>}
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
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
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">About InoMail</h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              InoMail was born out of a simple necessity: sending personalized, bulk emails shouldn't be complicated, and it shouldn't land you in the spam folder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="glass-card p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Student Driven</h3>
              <p className="text-sm text-gray-400">
                A project initiated and driven by passionate student developers.
              </p>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="text-yellow-500 w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Innovation First</h3>
              <p className="text-sm text-gray-400">
                Leveraging cutting-edge AI and robust queueing technologies.
              </p>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="text-green-500 w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Built for Scale</h3>
              <p className="text-sm text-gray-400">
                Designed to handle millions of emails seamlessly and efficiently.
              </p>
            </div>
          </div>

          <div className="glass p-10 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
            <h2 className="text-3xl font-bold mb-6 text-gradient">Built with ❤️ by Inovus Labs IEDC</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Inovus Labs IEDC is an innovation ecosystem that empowers students to build production-level solutions. InoMail is a testament to what student developers can achieve when given the right environment, mentorship, and vision.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Our mission is to simplify communication for organizations worldwide while pushing the boundaries of what's possible with modern web development.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative bg-white/5">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-3xl"
            >
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-gray-400">Thank you for reaching out. We'll get back to you shortly.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-primary hover:underline font-medium"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-300">First Name</label>
                      <input 
                        type="text" 
                        required
                        value={formState.firstName}
                        onChange={(e) => setFormState({ ...formState, firstName: e.target.value })}
                        className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" 
                        placeholder="John" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-300">Last Name</label>
                      <input 
                        type="text" 
                        value={formState.lastName}
                        onChange={(e) => setFormState({ ...formState, lastName: e.target.value })}
                        className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" 
                        placeholder="Doe" 
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" 
                      placeholder="john@company.com" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">Message</label>
                    <textarea 
                      rows={5} 
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none" 
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button 
                    disabled={isSubmitting}
                    className="bg-primary text-white font-medium py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-8 justify-center"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 text-white">Email Support</h3>
                  <p className="text-gray-400 mb-2">Our team is ready to help with any technical issues or inquiries.</p>
                  <a href="mailto:support@inovuslabs.org" className="text-primary hover:underline">support@inovuslabs.org</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 text-white">Sales Inquiry</h3>
                  <p className="text-gray-400 mb-2">Interested in our Enterprise plan? Let's discuss your scale.</p>
                  <a href="mailto:sales@inovuslabs.org" className="text-purple-400 hover:underline">sales@inovuslabs.org</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 text-white">Headquarters</h3>
                  <p className="text-gray-400">
                    Inovus Labs IEDC<br />
                    Kristu Jyoti College of Management and Technology<br />
                    Changanassery, Kerala
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
