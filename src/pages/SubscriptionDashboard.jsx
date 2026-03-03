import { useNavigate } from "react-router-dom";

function SubscriptionDashboard() {
  const navigate = useNavigate();

  const handleSubscribe = (plan, price) => {
  navigate("/payment", {
    state: { plan, price },
  });
};


  return (
    <div className="subscription-page">
      {/* HEADER */}
      <div className="subscription-header">
        <span className="badge">Subscription Plans</span>
        <h1>Choose the Right Plan for Your Business</h1>
        <p>
          InoMail offers flexible subscription plans to support startups,
          growing teams, and enterprises with secure bulk email delivery.
        </p>
      </div>

      {/* PRICING GRID */}
      <div className="pricing-grid detailed">
        {/* BASIC */}
        <div className="pricing-card">
          <h3>Basic</h3>
          <p className="plan-desc">Ideal for individuals & startups</p>

          <div className="price">₹499 <span>/ month</span></div>

          <ul>
            <li>✔ 1,000 emails per month</li>
            <li>✔ CSV recipient upload</li>
            <li>✔ Basic email templates</li>
            <li>✔ Email support</li>
            <li>✖ Attachments</li>
            <li>✖ Reports & analytics</li>
          </ul>

          <button
  className="btn-primary full"
  onClick={() => handleSubscribe("Basic", 499)}
>
  Get Started
</button>

        </div>

        {/* STANDARD */}
        <div className="pricing-card highlight">
          <div className="popular">Most Popular</div>

          <h3>Standard</h3>
          <p className="plan-desc">Best for growing businesses</p>

          <div className="price">₹999 <span>/ month</span></div>

          <ul>
            <li>✔ 10,000 emails per month</li>
            <li>✔ CSV & Excel upload</li>
            <li>✔ File attachments</li>
            <li>✔ Delivery & open reports</li>
            <li>✔ SMTP authentication</li>
            <li>✔ Priority email support</li>
          </ul>

          <button
  className="btn-primary full"
  onClick={() => handleSubscribe("Standard", 999)}
>
  Get Started
</button>

        </div>

        {/* PREMIUM */}
        <div className="pricing-card">
          <h3>Premium</h3>
          <p className="plan-desc">Designed for enterprises</p>

          <div className="price">₹1999 <span>/ month</span></div>

          <ul>
            <li>✔ Unlimited email campaigns</li>
            <li>✔ Large attachments</li>
            <li>✔ Advanced analytics dashboard</li>
            <li>✔ Custom SMTP integration</li>
            <li>✔ Dedicated support</li>
            <li>✔ SLA & monitoring</li>
          </ul>

         <button
  className="btn-primary full"
  onClick={() => handleSubscribe("Premium", 1999)}
>
  Get Started
</button>

        </div>
      </div>
    </div>
  );
}

export default SubscriptionDashboard;
