import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
  const navigate = useNavigate();

  const [orgName, setOrgName] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // EMPTY CHECKS
    if (
      orgName.trim() === "" ||
      creatorName.trim() === "" ||
      email.trim() === "" ||
      phone.trim() === "" ||
      password.trim() === ""
    ) {
      alert("All fields are required");
      return;
    }

    // EMAIL VALIDATION
    if (!email.endsWith("@gmail.com")) {
      alert("Registration allowed only with @gmail.com email");
      return;
    }

    // PHONE VALIDATION
    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert("Enter a valid 10-digit Indian phone number");
      return;
    }

    // PASSWORD VALIDATION
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    // SAVE USER (DEMO PURPOSE)
    localStorage.setItem("role", "user");
    localStorage.setItem("orgName", orgName);
    localStorage.setItem("creatorName", creatorName);
    localStorage.setItem("email", email);
    localStorage.setItem("phone", phone);

    // REDIRECT AFTER REGISTER
    navigate("/subscription");
  };

  return (
    <div className="auth-page">
      {/* LEFT BRAND */}
      <div className="auth-brand">
        <h1>InoMail</h1>
        <p>
          Enterprise-ready subscription-based bulk email and asset delivery
          platform for modern organizations.
        </p>

        <ul className="auth-features">
          <li>✔ Secure SMTP Authentication</li>
          <li>✔ Bulk Email Campaigns</li>
          <li>✔ Organization-based Management</li>
          <li>✔ Delivery Reports & Analytics</li>
        </ul>
      </div>

      {/* RIGHT FORM */}
      <div className="auth-card">
        <h2>Create Organization Account</h2>
        <p className="auth-subtitle">
          Register your organization to get started
        </p>

        <input
          type="text"
          placeholder="Organization Name"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Creator / Admin Name"
          value={creatorName}
          onChange={(e) => setCreatorName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button className="btn-primary full" onClick={handleRegister}>
          Create Account
        </button>

        <p className="auth-link">
          Already registered?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
