import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { toast } from "../utils/toast";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const decodeJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

function LoginContent() {
  const navigate = useNavigate();

  /* ================= STATES ================= */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      toast.warn("Email and password are required");
      return;
    }
    if (email.toLowerCase() === "super@inomail.com" && password === "super123") {
      localStorage.setItem("role", "superadmin");
      localStorage.setItem("email", email);
      navigate("/superadmin");
      return;
    }
    if (email.toLowerCase() === "admin@inomail.com" && password === "admin123") {
      localStorage.setItem("role", "admin");
      localStorage.setItem("email", email);
      navigate("/admin-dashboard");
      return;
    }
    if (!email.endsWith("@gmail.com")) {
      toast.error("Please login using a valid Gmail address");
      return;
    }
    localStorage.setItem("role", "user");
    localStorage.setItem("email", email);
    navigate("/SubscriptionDashboard");
  };

  const sendOtp = () => {
    if (!email) { toast.warn("Enter registered email"); return; }
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otpCode);
    setOtpSent(true);
    toast.success("Demo OTP: " + otpCode);
  };

  const resetPassword = () => {
    if (!otp || !newPassword || !confirmPassword) { toast.warn("All fields required"); return; }
    if (otp !== generatedOtp) { toast.error("Invalid OTP"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
    toast.success("Password updated successfully (Demo)");
    setForgotMode(false);
    setOtpSent(false);
  };

  const handleGoogleSuccess = (userData) => {
    localStorage.setItem("role", "user");
    localStorage.setItem("email", userData.email || "googleuser@gmail.com");
    toast.success(`Welcome back, ${userData.name || userData.email || 'User'}!`);
    navigate("/SubscriptionDashboard");
  };

  return (
    <>
      <Navbar />
    <div className="min-h-screen lg:h-screen w-full relative flex flex-col justify-center items-center px-4 overflow-x-hidden overflow-y-auto lg:overflow-hidden bg-slate-900 pt-24 pb-12 lg:pt-20 lg:pb-0">

      {/* Background Blobs */}
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-sky-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-green-500/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-5xl flex flex-col-reverse lg:flex-row glass-card relative z-10 p-0 shadow-2xl scale-[0.85] sm:scale-95 lg:scale-100 transform-gpu origin-center">
        
        {/* INFO PANEL */}
        <div className="w-full lg:w-1/2 p-10 lg:p-14 bg-gradient-to-br from-slate-800 to-slate-900 border-t lg:border-t-0 lg:border-r border-slate-700/50 flex flex-col justify-center">
          <h2 className="text-3xl font-black text-white mb-4 leading-tight">Secure Your Bulk Emailing</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Login to manage your campaigns, track delivery stats, and connect with your audience effortlessly.
          </p>
          
          <ul className="space-y-5">
            {[
              "99.9% Delivery Guarantee",
              "Enterprise SMTP Support",
              "Real-time Asset Tracking"
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* FORM PANEL */}
        <div className="w-full lg:w-1/2 p-10 lg:p-14 bg-slate-900/50 backdrop-blur-xl flex flex-col justify-center">
          {!forgotMode ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-slate-400 mb-8 text-sm">Login to your dashboard</p>

              <div className="space-y-4 mb-6">
                <input
                  type="email"
                  placeholder="Email address (@gmail.com)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-sky-500 transition-colors"
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                  <button
                    type="button"
                    tabIndex="-1"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m-1.414 1.414l15-15"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <button className="btn-primary w-full py-3.5 mb-4" onClick={handleLogin}>
                Sign In
              </button>

              <div className="flex justify-center mb-6 w-full overflow-hidden rounded-xl">
                <div className="w-full flex justify-center [&>div]:w-full">
                  <GoogleLogin 
                    onSuccess={(credentialResponse) => {
                      const userData = decodeJwt(credentialResponse.credential);
                      if (userData) handleGoogleSuccess(userData);
                      else toast.error("Failed to parse Google login data.");
                    }}
                    onError={() => toast.error("Google Login Cancelled")}
                    useOneTap
                    theme="outline"
                    shape="rectangular"
                    size="large"
                    width="100%"
                    text="continue_with"
                  />
                </div>
              </div>

              <p className="text-center text-sm mb-4">
                <span className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors" onClick={() => setForgotMode(true)}>
                  Forgot password?
                </span>
              </p>

              <p className="text-center text-sm text-slate-400">
                New to InoMail?{" "}
                <span className="text-sky-400 hover:text-sky-300 cursor-pointer font-semibold transition-colors" onClick={() => navigate("/register")}>
                  Create Account
                </span>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
              <p className="text-slate-400 mb-8 text-sm">Verify OTP to restore access</p>

              <div className="space-y-4 mb-6">
                <input
                  type="email"
                  placeholder="Registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-sky-500 transition-colors"
                />

                {!otpSent ? (
                  <button className="btn-primary w-full py-3.5" onClick={sendOtp}>
                    Send Reset OTP
                  </button>
                ) : (
                  <>
                    <input
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-sky-500 transition-colors"
                    />
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:border-sky-500 transition-colors"
                      />
                      <button
                        type="button"
                        tabIndex="-1"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition-colors"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m-1.414 1.414l15-15"/></svg>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:border-sky-500 transition-colors"
                      />
                    </div>
                    <button className="btn-primary w-full py-3.5" onClick={resetPassword}>
                      Reset My Password
                    </button>
                  </>
                )}
              </div>

              <p className="text-center text-sm mt-4">
                <span className="text-slate-400 hover:text-white cursor-pointer transition-colors" onClick={() => setForgotMode(false)}>
                  Back to Login
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

function Login() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "734346760523-tflisnjksqkquh7523fjkldfgdsd.apps.googleusercontent.com"}>
      <LoginContent />
    </GoogleOAuthProvider>
  );
}

export default Login;
