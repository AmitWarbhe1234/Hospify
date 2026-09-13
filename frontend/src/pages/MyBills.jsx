import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyBills,
  downloadBillPDF,
  createPaymentOrder,
  verifyPayment,
} from "../services/api";


function MyBills() {
  const navigate = useNavigate();

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyBills()
      .then((res) => setBills(res.data))
      .catch((err) => {
        console.error(err);
        setError("Bills load nahi ho payi.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (billId) => {
    try {
      const res = await downloadBillPDF(billId);

      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = `bill_${billId}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("PDF download nahi ho paya.");
    }
  };

  const handlePayment = async (bill) => {
    try {
      const orderData = await createPaymentOrder(bill.id);

      const options = {
        key: orderData.razorpay_key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Hospify",
        description: `Payment for ${bill.patient_name || "Patient"}`,
        order_id: orderData.order_id,

        handler: async function (response) {
          try {
            const result = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            alert(result.message);
            window.location.reload();
          } catch (error) {
            console.error(error);

            alert(
              error.response?.data?.error ||
                "Payment verification failed."
            );
          }
        },

        prefill: {
          name: bill.patient_name || "",
        },

        theme: {
          color: "#4F46E5",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("PAYMENT ERROR:", error);
      console.error("RESPONSE:", error.response);
      console.error("DATA:", error.response?.data);

      alert(
        error.response?.data?.error ||
          error.message ||
          "Unable to start payment."
      );
    }
  };

  return (
    <div className="patient-page">

      <div className="patient-bg-circle patient-bg-one"></div>
      <div className="patient-bg-circle patient-bg-two"></div>
      <div className="patient-bg-circle patient-bg-three"></div>

      {/* Header */}
      <div
        className="patient-header"
        style={{ position: "relative", zIndex: 10 }}
      >
        <div className="patient-brand">
          <div className="patient-logo">🏥</div>

          <div>
            <h2>Hospify</h2>
            <p>Healthcare Management System</p>
          </div>
        </div>

        <div className="patient-header-right">
          <button
            className="patient-logout"
            onClick={() => navigate("/patient-dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="patient-container">

        <div className="patient-welcome">
          <span className="patient-welcome-label">BILLING</span>
          <h1>My Bills 🧾</h1>
          <p>View and download your billing records.</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="patient-loading">
            <div className="patient-spinner"></div>
            <p>Loading your bills...</p>
          </div>
        )}

        {/* Error */}
        {error && <p className="bill-error">{error}</p>}

        {/* No Bills */}
        {!loading && bills.length === 0 && (
          <div className="patient-card no-bills-card">
            <div className="no-bills-icon">🧾</div>
            <h3>No Bills Available</h3>
            <p>No bill has been generated yet.</p>
          </div>
        )}

        {/* Bills */}
        {!loading && bills.length > 0 && (
          <div className="bills-list">
            {bills.map((bill) => (
              <div className="professional-bill-card" key={bill.id}>

                {/* Patient Details + Status */}
                <div className="bill-top-section">

                  <div className="bill-patient-info">

                    <div className="bill-patient-icon">
                      👤
                    </div>

                    <div>
                      <h3>
                        {bill.patient_name || "Patient"}
                      </h3>

                      <p className="patient-id-text">
                        Patient ID:{" "}
                        <strong>{bill.patient}</strong>
                      </p>

                      <p className="bill-date-text">
                        Bill Date:{" "}
                        {new Date(
                          bill.created_at
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                  </div>

                  <div className="bill-status-area">
                    <span className="status-label">STATUS</span>

                    {bill.status === "paid" ? (
                      <span className="professional-paid-badge">
                        <span className="paid-check">✓</span>
                        Paid
                      </span>
                    ) : (
                      <span className="professional-unpaid-badge">
                        Unpaid
                      </span>
                    )}
                  </div>

                </div>

                <div className="professional-divider"></div>

                {/* Amount + Actions */}
                <div className="bill-bottom-section">

                  <div className="bill-amount-area">
                    <span className="amount-label">
                      TOTAL AMOUNT
                    </span>

                    <strong>
                      ₹{Number(bill.total_amount).toFixed(2)}
                    </strong>
                  </div>

                  <div className="professional-bill-actions">

                    {bill.status === "unpaid" && (
                      <button
                        className="professional-pay-button"
                        onClick={() => handlePayment(bill)}
                      >
                        <span>💳</span>
                        Pay Now
                      </button>
                    )}

                    <button
                      className="professional-download-button"
                      onClick={() => handleDownload(bill.id)}
                    >
                      <span className="download-icon">↓</span>
                      Download PDF
                    </button>

                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default MyBills;
