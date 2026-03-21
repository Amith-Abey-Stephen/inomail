import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { toast } from "../utils/toast";
import { setSessionExpiry } from "../utils/session";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const decodeJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

function RegisterContent() {
  const navigate = useNavigate();

  const [orgName, setOrgName] = useState("");
  const [creatorName, setCreatorName] = useState(localStorage.getItem("creatorName") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [phone, setPhone] = useState(localStorage.getItem("phone") || "");
  const [password, setPassword] = useState("");
  const [showPasswordConditions, setShowPasswordConditions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
  const passwordValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

  const handleRegister = () => {
    if (!orgName.trim() || !creatorName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      toast.warn("All fields are required");
      return;
    }
    if (!email.endsWith("@gmail.com")) {
      toast.error("Registration allowed only with @gmail.com email");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Enter a valid 10-digit Indian phone number");
      return;
    }
    if (!passwordValid) {
      toast.warn("Please ensure your password meets all security conditions");
      return;
    }

    localStorage.setItem("role", "user");
    localStorage.setItem("orgName", orgName);
    localStorage.setItem("creatorName", creatorName);
    localStorage.setItem("email", email);
    localStorage.setItem("phone", phone);
    setSessionExpiry();
    navigate("/subscription");
  };

  const handleGoogleSuccess = (userData) => {
    if (userData.email) setEmail(userData.email);
    if (userData.name) setCreatorName(userData.name);
    
    toast.success("Google info synced! Please complete the remaining fields.");
  };

  return (
    <>
      <Navbar />
    <div className="min-h-screen lg:h-screen w-full relative flex flex-col justify-center items-center px-4 overflow-x-hidden overflow-y-hidden  bg-slate-900 mt-24 pb-12 lg:mt-20 lg:pb-0">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-32 w-[600px] h-[600px] bg-sky-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-green-500/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-5xl flex flex-col lg:flex-row glass-card relative z-10 p-0 shadow-2xl scale-[0.85] sm:scale-95 lg:scale-100 transform-gpu origin-center">
        
        {/* INFO PANEL */}
        <div className="w-full lg:w-5/12 p-8 lg:p-10 xl:p-12 bg-gradient-to-br from-slate-800 to-slate-900 border-b lg:border-b-0 lg:border-r border-slate-700/50 flex flex-col justify-center">
          <h2 className="text-2xl lg:text-3xl font-black text-white mb-3 lg:mb-4 leading-tight">Grow Your Business Speed</h2>
          <p className="text-sm lg:text-base text-slate-400 mb-6 lg:mb-8 leading-relaxed">
            Join thousands of organizations using InoMail to deliver high-volume emails with enterprise-grade security.
          </p>
          
          <ul className="space-y-3 lg:space-y-4">
            {[
              "Secure SMTP Authentication",
              "Bulk Email Campaigns",
              "Organization-based Management",
              "Delivery Reports & Analytics"
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm lg:text-base text-slate-300 font-medium">
                <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* FORM PANEL */}
        <div className="w-full lg:w-7/12 p-8 lg:p-10 xl:p-12 bg-slate-900/50 backdrop-blur-xl flex flex-col justify-center">
          <h2 className="text-2xl lg:text-3xl font-black text-white mb-1 lg:mb-2">Create Account</h2>
          <p className="text-slate-400 mb-6 lg:mb-8 text-xs lg:text-sm">Register your organization to get started</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mb-3 lg:mb-4">
            <input
              type="text"
              placeholder="Organization Name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-sm lg:text-base text-white rounded-xl px-4 py-2.5 lg:py-3 focus:outline-none focus:border-sky-500 transition-colors"
            />
            <input
              type="text"
              placeholder="Creator / Admin Name"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-sm lg:text-base text-white rounded-xl px-4 py-2.5 lg:py-3 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <div className="space-y-3 lg:space-y-4 mb-5 lg:mb-6">
            <input
              type="email"
              placeholder="Email Address (@gmail.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-sm lg:text-base text-white rounded-xl px-4 py-2.5 lg:py-3 focus:outline-none focus:border-sky-500 transition-colors"
            />

            <div className="relative">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Secure Password"
                  value={password}
                  onFocus={() => setShowPasswordConditions(true)}
                  onBlur={() => setShowPasswordConditions(false)}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-sm lg:text-base text-white rounded-xl px-4 py-2.5 lg:py-3 pr-12 focus:outline-none focus:border-sky-500 transition-colors"
                />
                <button
                  type="button"
                  tabIndex="-1"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m-1.414 1.414l15-15"/></svg>
                  )}
                </button>
              </div>
              {showPasswordConditions && (
                <div className="absolute z-50 inset-x-0 mt-2 text-xs space-y-1.5 p-3.5 bg-slate-800/95 backdrop-blur-3xl rounded-xl border border-slate-700/80 shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-fade-in-up">
                  <p className={`flex items-center gap-2 transition-colors ${hasMinLength ? "text-green-400" : "text-amber-400"}`}>
                    <span>{hasMinLength ? "✔" : "○"}</span> Minimum 8 characters
                  </p>
                  <p className={`flex items-center gap-2 transition-colors ${hasUpper ? "text-green-400" : "text-amber-400"}`}>
                    <span>{hasUpper ? "✔" : "○"}</span> At least one uppercase letter (A-Z)
                  </p>
                  <p className={`flex items-center gap-2 transition-colors ${hasLower ? "text-green-400" : "text-amber-400"}`}>
                    <span>{hasLower ? "✔" : "○"}</span> At least one lowercase letter (a-z)
                  </p>
                  <p className={`flex items-center gap-2 transition-colors ${hasNumber ? "text-green-400" : "text-amber-400"}`}>
                    <span>{hasNumber ? "✔" : "○"}</span> At least one number (0-9)
                  </p>
                  <p className={`flex items-center gap-2 transition-colors ${hasSpecial ? "text-green-400" : "text-amber-400"}`}>
                    <span>{hasSpecial ? "✔" : "○"}</span> At least one special symbol (!@#$%)
                  </p>
                </div>
              )}
            </div>

            <input
              type="text"
              placeholder="Phone Number (10-digit Indian)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-sm lg:text-base text-white rounded-xl px-4 py-2.5 lg:py-3 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <button className="btn-primary w-full py-3 mb-4 text-sm lg:text-base" onClick={handleRegister}>
            Create Organization
          </button>

          <div className="flex justify-center mb-5 w-full overflow-hidden rounded-xl">
            <div className="w-full flex justify-center [&>div]:w-full">
              <GoogleLogin 
                onSuccess={(credentialResponse) => {
                  const userData = decodeJwt(credentialResponse.credential);
                  if (userData) handleGoogleSuccess(userData);
                  else toast.error("Failed to parse Google register data.");
                }}
                onError={() => toast.error("Google Registration Cancelled")}
                useOneTap
                theme="outline"
                shape="rectangular"
                size="large"
                width="100%"
                text="continue_with"
              />
            </div>
          </div>

          <p className="text-center text-xs lg:text-sm text-slate-400">
            Already registered?{" "}
            <span className="text-sky-400 hover:text-sky-300 cursor-pointer font-semibold transition-colors" onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}

function Register() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "734346760523-tflisnjksqkquh7523fjkldfgdsd.apps.googleusercontent.com"}>
      <RegisterContent />
    </GoogleOAuthProvider>
  );
}

export default Register;
