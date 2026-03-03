import { useNavigate, useLocation } from "react-router-dom";

function PaymentDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get plan data from navigation
  const { plan, price } = location.state || {};

  // ✅ UPDATED PAYMENT HANDLER
  const handlePayment = () => {
    // simulate successful payment
    localStorage.setItem("isSubscribed", "true");
    localStorage.setItem("plan", plan);

    // 👉 GO TO PAYMENT SUCCESS PAGE (NOT DASHBOARD)
    navigate("/payment-success", {
      state: { plan, price },
    });
  };

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h2>Complete Your Subscription</h2>
        <p className="payment-subtitle">
          Review your plan and proceed with payment
        </p>

        <div className="payment-summary">
          <div>
            <span>Selected Plan</span>
            <strong>{plan}</strong>
          </div>

          <div>
            <span>Billing Amount</span>
            <strong>₹{price} / month</strong>
          </div>

          <div>
            <span>Payment Method</span>
            <strong>UPI / Card / Net Banking</strong>
          </div>
        </div>

        <button className="btn-primary full" onClick={handlePayment}>
          Proceed to Pay
        </button>

        <p className="payment-note">
          * This is a demo payment screen for academic purposes.
        </p>
      </div>
    </div>
  );
}

export default PaymentDetails;
