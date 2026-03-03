import { useNavigate, useLocation } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const { plan, price } = location.state || {};

  return (
    <div className="payment-page">
      <div className="payment-card">

        {/* SUCCESS ICON / MESSAGE */}
        <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
          ✅ Payment Successful
        </h1>

        <p className="payment-subtitle">
          Your subscription is now active. You can start using InoMail features.
        </p>

        {/* PAYMENT DETAILS */}
        <div className="payment-summary">
          <div>
            <span>Selected Plan</span>
            <strong>{plan || "—"}</strong>
          </div>

          <div>
            <span>Amount Paid</span>
            <strong>₹{price || "—"}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>Success</strong>
          </div>

          <div>
            <span>Transaction ID</span>
            <strong>TXN{Math.floor(Math.random() * 1000000)}</strong>
          </div>
        </div>

        {/* NEXT BUTTON */}
        <button
          className="btn-primary full"
          style={{ marginTop: "30px" }}
          onClick={() => navigate("/dashboard")}
        >
          Next → Go to Dashboard
        </button>

        <p className="payment-note">
          * This is a demo payment confirmation screen for academic purposes.
        </p>
      </div>
    </div>
  );
}

export default PaymentSuccess;
