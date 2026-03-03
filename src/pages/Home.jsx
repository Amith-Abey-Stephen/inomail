import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="hero-premium" id="home">
        <div className="hero-overlay" />

        <div className="hero-inner">
          <div className="hero-text">
            <span className="badge-premium">
              Enterprise Subscription-based SaaS
            </span>

            <h1 className="hero-title">
              Secure & Scalable <br />
              <span>Bulk Email Platform</span>
            </h1>

            <p className="hero-description">
              InoMail empowers organizations to deliver high-volume,
              attachment-enabled emails using verified SMTP credentials
              with real-time delivery tracking and analytics.
            </p>

            <div className="hero-actions">
              <button
                className="btn-primary"
                onClick={() => navigate("/register")}
              >
                Start Free Trial
              </button>

              <button
                className="btn-secondary"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>

            <div className="hero-stats">
              <div>
                <h3>99.9%</h3>
                <p>Delivery Accuracy</p>
              </div>
              <div>
                <h3>50K+</h3>
                <p>Emails / Day</p>
              </div>
              <div>
                <h3>500+</h3>
                <p>Organizations</p>
              </div>
            </div>
          </div>

          <div className="hero-preview">
            <div className="preview-glass">
              <h4>Email Campaign Console</h4>
              <p>SMTP Verification • Campaign Logs • Delivery Reports</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="section premium-section" id="features">
        <h2 className="section-title">Why Choose InoMail?</h2>
        <p className="section-subtitle">
          Built for reliability, performance, and enterprise security
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>🚀 High-Volume Delivery</h3>
            <p>
              Execute large-scale email campaigns with lightning-fast delivery
              and optimized SMTP infrastructure.
            </p>
          </div>

          <div className="feature-card">
            <h3>🔐 Secure Attachments</h3>
            <p>
              Send PDFs, reports, and documents safely with encrypted and
              optimized attachment delivery.
            </p>
          </div>

          <div className="feature-card">
            <h3>📊 Real-Time Analytics</h3>
            <p>
              Monitor campaign performance, delivery rates, and logs in a
              professional dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* ================= ABOUT (NEW – PROFESSIONAL) ================= */}
      <section className="section about-section" id="about">
        <h2 className="section-title">About InoMail</h2>
        <p className="section-subtitle">
          A modern SaaS bulk email solution built for scalability and security
        </p>

        <div className="about-container">
          <div className="about-card">
            <h3>💼 Enterprise Ready</h3>
            <p>
              InoMail is designed for startups, agencies, and enterprises who
              need reliable bulk email automation with full SMTP control.
            </p>
          </div>

          <div className="about-card">
            <h3>⚡ Smart Automation</h3>
            <p>
              Automate campaigns, schedule emails, and manage high-volume
              delivery without performance issues.
            </p>
          </div>

          <div className="about-card">
            <h3>🛡️ Secure Infrastructure</h3>
            <p>
              Built with security-first architecture ensuring safe email
              transmission and authenticated SMTP usage.
            </p>
          </div>
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section className="section pricing-premium" id="pricing">
        <h2 className="section-title">Simple Pricing</h2>
        <p className="section-subtitle">
          Transparent plans designed for every business stage
        </p>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Basic</h3>
            <p className="plan-desc">Startups & Individuals</p>
            <div className="price">₹499</div>
            <ul>
              <li>✔ 1,000 Emails / Month</li>
              <li>✔ CSV Upload</li>
              <li>✔ Email Support</li>
            </ul>
            <button
              className="btn-primary full"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>
          </div>

          <div className="pricing-card highlight">
            <span className="popular">Most Popular</span>
            <h3>Standard</h3>
            <p className="plan-desc">Growing Teams</p>
            <div className="price">₹999</div>
            <ul>
              <li>✔ 10,000 Emails / Month</li>
              <li>✔ Attachments</li>
              <li>✔ Delivery Reports</li>
              <li>✔ SMTP Authentication</li>
            </ul>
            <button
              className="btn-primary full"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>
          </div>

          <div className="pricing-card">
            <h3>Premium</h3>
            <p className="plan-desc">Enterprises</p>
            <div className="price">₹1999</div>
            <ul>
              <li>✔ Unlimited Emails</li>
              <li>✔ Advanced Analytics</li>
              <li>✔ Dedicated Support</li>
            </ul>
            <button
              className="btn-primary full"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section className="section contact-premium" id="contact">
        <h2 className="section-title">Contact Us</h2>
        <p className="section-subtitle">
          Need help with setup or enterprise onboarding?
        </p>

        <div className="contact-grid">
          <div className="contact-card">
            <h3>📧 Email</h3>
            <p>support@inomail.com</p>
          </div>

          <div className="contact-card">
            <h3>📞 Phone</h3>
            <p>+91 98765 43210</p>
          </div>

          <div className="contact-card">
            <h3>📍 Location</h3>
            <p>India</p>
          </div>
        </div>
      </section>

      {/* ================= FOOTER (NEW – PREMIUM) ================= */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h2>InoMail</h2>
            <p>
              Professional Bulk Email SaaS Platform for secure and scalable
              email automation.
            </p>
          </div>

          <div className="footer-links">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#about">About</a>
          </div>

          <div className="footer-links">
            <h4>Company</h4>
            <a href="#contact">Contact</a>
            <a href="/login">Login</a>
            <a href="/register">Sign Up</a>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} InoMail. All rights reserved.
        </div>
      </footer>
    </>
  );
}

export default Home;