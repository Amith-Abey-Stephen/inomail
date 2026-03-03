import { useNavigate } from "react-router-dom";
import { useState } from "react";
import googleLogo from "../assets/google.png"; // add google logo image

function Login() {
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

  /* ================= LOGIN ================= */
  const handleLogin = () => {
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    // ✅ SUPER ADMIN
    if (email.toLowerCase() === "super@inomail.com" && password === "super123") {
      localStorage.setItem("role", "superadmin");
      localStorage.setItem("email", email);
      navigate("/superadmin");
      return;
    }

    // ✅ ADMIN
    if (email.toLowerCase() === "admin@inomail.com" && password === "admin123") {
      localStorage.setItem("role", "admin");
      localStorage.setItem("email", email);
      navigate("/admin-dashboard");
      return;
    }

    // ✅ USER
    if (!email.endsWith("@gmail.com")) {
      alert("Please login using a valid Gmail address");
      return;
    }

    localStorage.setItem("role", "user");
    localStorage.setItem("email", email);
    navigate("/SubscriptionDashboard");
  };

  /* ================= OTP ================= */
  const sendOtp = () => {
    if (!email) {
      alert("Enter registered email");
      return;
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otpCode);
    setOtpSent(true);

    alert("Demo OTP: " + otpCode);
  };

  const resetPassword = () => {
    if (!otp || !newPassword || !confirmPassword) {
      alert("All fields required");
      return;
    }

    if (otp !== generatedOtp) {
      alert("Invalid OTP");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    alert("Password updated successfully (Demo)");
    setForgotMode(false);
    setOtpSent(false);
  };

  /* ================= GOOGLE LOGIN (DEMO) ================= */
  const loginWithGoogle = () => {
    alert("Google Login Demo");
    localStorage.setItem("role", "user");
    localStorage.setItem("email", "googleuser@gmail.com");
    navigate("/SubscriptionDashboard");
  };

  return (
    <div className="auth-page">

      {/* ===== BRAND SIDE ===== */}
      <div className="auth-brand">
        <h1>InoMail</h1>
        <p>Secure bulk email platform for modern organizations.</p>
      </div>

      {/* ===== AUTH CARD ===== */}
      <div className="auth-card">

        {!forgotMode ? (
          <>
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Login to your account</p>

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn-primary full" onClick={handleLogin}>
              Login
            </button>

            {/* ===== GOOGLE LOGIN ===== */}
            <button className="google-btn" onClick={loginWithGoogle}>
              <img src={googleLogo} alt="Google" />
              Continue with Google
            </button>

            {/* ===== LINKS ===== */}
            <p className="auth-link">
              <span onClick={() => setForgotMode(true)}>
                Forgot password?
              </span>
            </p>

            <p className="auth-link">
              Don’t have an account?{" "}
              <span onClick={() => navigate("/register")}>
                Register
              </span>
            </p>
          </>
        ) : (
          <>
            <h2>Reset Password</h2>
            <p>Verify OTP & create new password</p>

            <input
              type="email"
              placeholder="Registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {!otpSent ? (
              <button className="btn-primary full" onClick={sendOtp}>
                Send OTP
              </button>
            ) : (
              <>
                <input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button className="btn-primary full" onClick={resetPassword}>
                  Create New Password
                </button>
              </>
            )}

            <p className="auth-link">
              <span onClick={() => setForgotMode(false)}>
                Back to login
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
