import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBills, downloadBillPDF, createPaymentOrder, verifyPayment } from "../services/api";

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
      const url = window.URL.createObjectURL(new Blob([res.data]));
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
    // 1. Django se Razorpay Order create karna
    const orderData = await createPaymentOrder(bill.id);

    // 2. Razorpay Checkout options
    const options = {
      key: orderData.razorpay_key_id,

      amount: orderData.amount,

      currency: orderData.currency,

      name: "Hospify",

      description: `Payment for Bill #${bill.id}`,

      order_id: orderData.order_id,

      handler: async function (response) {
        try {
          // 3. Payment details Django ko bhejna
          const result = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          alert(result.message);

          // Bills dobara load karna
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

    // 4. Razorpay Checkout open
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

          <div className="patient-header" style={{ position: "relative", zIndex: 10 }}>

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

      <div className="patient-container">

        <div className="patient-welcome">
          <span className="patient-welcome-label">BILLING</span>
          <h1>My Bills 🧾</h1>
          <p>View and download your billing records.</p>
        </div>

        {loading && (
          <div className="patient-loading">
            <div className="patient-spinner"></div>
            <p>Loading your bills...</p>
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && bills.length === 0 && (
          <div className="patient-card">
            <p>No bill has been generated yet.</p>
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
          {bills.map((bill) => (
            <div className="patient-card" style={{ width: "400px" }} key={bill.id}>

              <div className="patient-card-header">
                <div className="patient-section-icon">🧾</div>
                <div>
                  <h3>Bill #{bill.id}</h3>
                  <p>{new Date(bill.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="patient-info-grid">

                <div className="patient-info-item">
                  <span>Total Amount</span>
                  <strong>₹{bill.total_amount}</strong>
                </div>

                <div className="patient-info-item">
                  <span>Status</span>
                  <strong
                    style={{
                      color: bill.status === "paid" ? "green" : "#b8860b",
                      textTransform: "capitalize",
                    }}
                  >
                    {bill.status}
                  </strong>
                </div>

              </div>

              <div className="bill-actions">

  {bill.status === "unpaid" ? (
    <button
      className="bill-pay-button"
      onClick={() => handlePayment(bill)}
    >
      💳 Pay Now
    </button>
  ) : (
    <span className="bill-paid-badge">
      ✓ Paid
    </span>
  )}

  <button
    className="bill-download-button"
    onClick={() => handleDownload(bill.id)}
  >
    ⬇ Download PDF
  </button>

</div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

export default MyBills;