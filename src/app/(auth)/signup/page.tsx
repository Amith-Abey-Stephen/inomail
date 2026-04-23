"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Loader2, ArrowRight, Check, Shield, Globe, User, Phone, Lock, Building, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PRICING_PLANS } from "@/lib/constants/pricing";
import { toast } from "sonner";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state in useEffect to avoid searchParams bailout during static gen if possible
  // Though Suspense should handle it.
  const provider = searchParams.get("provider");
  const initialStep = parseInt(searchParams.get("step") || "1");
  
  const [step, setStep] = useState(initialStep);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(provider === "google");
  const [otp, setOtp] = useState("");
  const [step1Focused, setStep1Focused] = useState(false);

  const [formData, setFormData] = useState({
    name: searchParams.get("name") || "",
    email: searchParams.get("email") || "",
    phone: "",
    password: "",
    confirmPassword: "",
    plan: "Starter",
    organizationName: "",
  });

  // Sync from URL params if they change (e.g. Google OAuth redirect)
  useEffect(() => {
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    if (name || email) {
      setFormData(prev => ({
        ...prev,
        name: name || prev.name,
        email: email || prev.email,
      }));
    }
    if (searchParams.get("provider") === "google") {
      setEmailVerified(true);
    }
  }, [searchParams]);

  // Password security checks
  const [passwordSecurity, setPasswordSecurity] = useState({
    length: false,
    number: false,
    special: false,
    uppercase: false,
  });

  useEffect(() => {
    const pass = formData.password;
    setPasswordSecurity({
      length: pass.length >= 8,
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
      uppercase: /[A-Z]/.test(pass),
    });
  }, [formData.password]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOTP = async () => {
    if (!formData.email) return setError("Please enter an email first");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      
      toast.success("Verification code sent to your email!");
      setOtpSent(true);
      setError("");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");
      
      toast.success("Email verified successfully!");
      setEmailVerified(true);
      setError("");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!emailVerified) return setError("Please verify your email first");
      if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");
      if (!Object.values(passwordSecurity).every(Boolean)) return setError("Please meet all password security requirements");
    }
    setError("");
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      
      toast.success("Welcome to InoMail! Your account is ready.");
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ 
        layout: { type: "spring", stiffness: 300, damping: 30 },
        duration: 0.4 
      }}
      className="w-full max-w-xl"
    >
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8 px-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              step >= s ? "bg-primary text-white" : "bg-white/10 text-gray-500"
            }`}>
              {step > s ? <Check className="w-5 h-5" /> : s}
            </div>
            {s < 3 && (
              <div className={`flex-1 h-0.5 mx-2 transition-colors ${
                step > s ? "bg-primary" : "bg-white/10"
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="glass-card px-8 py-8 md:px-10 md:py-10 rounded-[32px] border-white/10 shadow-2xl relative overflow-hidden transition-all duration-500">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Personal Details</h2>
                <p className="text-gray-400 text-sm">Let's start with your identity</p>
              </div>

              {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl">{error}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-all text-sm" placeholder="John Doe" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-all text-sm" placeholder="+91 9876543210" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 ml-1">Email Address</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      disabled={emailVerified} 
                      readOnly={provider === "google"}
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className={`w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-all text-sm disabled:opacity-50 ${provider === "google" ? "cursor-not-allowed" : ""}`} 
                      placeholder="john@company.com" 
                    />
                    {emailVerified && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <span className="text-[10px] text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded-full uppercase">Verified</span>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                    )}
                  </div>
                  {!emailVerified && (
                    <button onClick={sendOTP} disabled={loading} className="bg-primary/20 text-primary px-4 rounded-xl text-xs font-medium hover:bg-primary/30 transition-colors whitespace-nowrap">
                      {otpSent ? "Resend" : "Send OTP"}
                    </button>
                  )}
                </div>
              </div>

              {otpSent && !emailVerified && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 ml-1">Verification Code</label>
                  <div className="flex gap-2">
                    <input value={otp} onChange={(e) => setOtp(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all text-sm tracking-[5px] text-center" placeholder="000000" maxLength={6} />
                    <button onClick={verifyOTP} disabled={loading} className="bg-primary text-white px-6 rounded-xl text-xs font-medium hover:bg-primary/90">Verify</button>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password" 
                      value={formData.password} 
                      onChange={handleChange} 
                      onFocus={() => setStep1Focused(true)}
                      onBlur={() => setStep1Focused(false)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-white focus:outline-none focus:border-primary transition-all text-sm" 
                      placeholder="••••••••" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      name="confirmPassword" 
                      value={formData.confirmPassword} 
                      onChange={handleChange} 
                      className={`w-full bg-white/5 border rounded-xl pl-11 pr-11 py-3 text-white focus:outline-none transition-all text-sm ${formData.confirmPassword && formData.password !== formData.confirmPassword ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-primary"}`} 
                      placeholder="••••••••" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-red-500 ml-1 font-medium">Passwords do not match</motion.p>
                  )}
                </div>
              </div>

              {/* Password Security Checks */}
              <AnimatePresence>
                {(step1Focused && !Object.values(passwordSecurity).every(Boolean)) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="grid grid-cols-2 gap-2 mt-2 overflow-hidden"
                  >
                    <div className={`flex items-center gap-2 text-[10px] transition-colors duration-300 ${passwordSecurity.length ? "text-green-500" : "text-gray-500"}`}>
                      {passwordSecurity.length ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} 8+ Characters
                    </div>
                    <div className={`flex items-center gap-2 text-[10px] transition-colors duration-300 ${passwordSecurity.number ? "text-green-500" : "text-gray-500"}`}>
                      {passwordSecurity.number ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} One Number
                    </div>
                    <div className={`flex items-center gap-2 text-[10px] transition-colors duration-300 ${passwordSecurity.uppercase ? "text-green-500" : "text-gray-500"}`}>
                      {passwordSecurity.uppercase ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} One Uppercase
                    </div>
                    <div className={`flex items-center gap-2 text-[10px] transition-colors duration-300 ${passwordSecurity.special ? "text-green-500" : "text-gray-500"}`}>
                      {passwordSecurity.special ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} Special Char
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button onClick={nextStep} className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-4 group">
                Next: Choose Plan <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Pricing & Plans</h2>
                <p className="text-gray-400 text-sm">Choose a plan that fits your needs</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PRICING_PLANS.filter(p => p.name !== "Enterprise").map((plan) => (
                  <motion.div 
                    key={plan.name}
                    onClick={() => setFormData({...formData, plan: plan.name})}
                    animate={{ 
                      scale: formData.plan === plan.name ? 1.02 : 1,
                      borderColor: formData.plan === plan.name ? "var(--primary)" : "rgba(255,255,255,0.1)"
                    }}
                    className={`p-6 rounded-[32px] border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col h-full ${
                      formData.plan === plan.name 
                        ? "bg-primary/10 shadow-[0_20px_50px_rgba(99,102,241,0.2)]" 
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {formData.plan === plan.name && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 z-20"
                      >
                        <div className="bg-primary rounded-full p-1 shadow-lg">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </motion.div>
                    )}
                    
                    {plan.popular && formData.plan !== plan.name && (
                      <div className="absolute top-4 right-4 bg-primary/20 text-primary text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-primary/20">
                        Popular
                      </div>
                    )}
                    
                    <h3 className={`text-lg font-bold mb-1 transition-colors ${formData.plan === plan.name ? "text-primary" : "text-white"}`}>
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-3xl font-bold text-white">{plan.price}</span>
                      {plan.period && <span className="text-gray-500 text-xs">{plan.period}</span>}
                    </div>
                    
                    <ul className="space-y-3 flex-1">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] leading-tight text-gray-400">
                          <Check className={`w-3.5 h-3.5 shrink-0 transition-colors ${formData.plan === plan.name ? "text-primary" : "text-green-500/50"}`} /> 
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {formData.plan === plan.name && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-primary shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={prevStep} className="flex-1 bg-transparent border border-white/10 text-white font-semibold py-3.5 rounded-xl hover:bg-white/5 transition-all">
                  Back
                </button>
                <button onClick={nextStep} className="flex-[2] bg-primary text-white font-semibold py-3.5 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group">
                  Next: Organization <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Organization</h2>
                <p className="text-gray-400 text-sm">Tell us about your company</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 ml-1">Organization Name</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input name="organizationName" value={formData.organizationName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-all text-sm" placeholder="Inovus Labs IEDC" />
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Summary</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Plan</span>
                    <span className="text-white font-medium">{formData.plan}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Account</span>
                    <span className="text-white font-medium">{formData.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={prevStep} className="flex-1 bg-transparent border border-white/10 text-white font-semibold py-3.5 rounded-xl hover:bg-white/5 transition-all">Back</button>
                <button onClick={handleSubmit} disabled={loading} className="flex-[2] bg-primary text-white font-semibold py-3.5 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>Complete Setup <Check className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {step === 1 && (
          <div className="mt-8 pt-6 border-t border-white/5">
             <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-[#0a0a0b] px-2 text-gray-500">Or continue with</span></div>
              </div>
              <button
                onClick={() => window.location.href = "/api/auth/google"}
                className="w-full bg-white/5 border border-white/10 text-white font-medium py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-3 text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign up with Google
              </button>
          </div>
        )}

        <div className="mt-6 text-center text-xs text-gray-500">
          Already have an account? <Link href="/login" className="text-primary hover:underline font-medium">Log in</Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>}>
      <SignupContent />
    </Suspense>
  );
}
