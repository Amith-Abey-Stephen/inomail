"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    organizationName: "",
    plan: "Starter"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Ambient background */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group inline-flex mx-auto w-full">
          <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-colors">
            <Mail className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">InoMail</span>
        </Link>

        <div className="glass-card p-8 rounded-3xl border-white/10 shadow-2xl">
          <h2 className="text-2xl font-bold mb-2 text-white">Create your account</h2>
          <p className="text-gray-400 text-sm mb-8">Start sending smarter bulk emails today.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Full Name</label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="john@company.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <input
                required
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Organization Name</label>
              <input
                required
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="Acme Inc."
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Plan</label>
              <select
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
              >
                <option value="Starter">Starter (Free)</option>
                <option value="Pro">Pro ($29/mo)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-medium py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-lg mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
