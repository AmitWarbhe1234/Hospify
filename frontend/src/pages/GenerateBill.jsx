import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {createBill,getPatientsForBilling,downloadBillPDF} from "../services/api";


function GenerateBill() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [registrationFee, setRegistrationFee] = useState(200);
  const [consultationFee, setConsultationFee] = useState(500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bill, setBill] = useState(null);

  useEffect(() => {
    getPatientsForBilling()
      .then((res) => setPatients(res.data))
      .catch((err) => {
        console.error(err);
        setError("Unable to load the patient list.");
      });
  }, []);

  const totalAmount =
    Number(registrationFee || 0) +
    Number(consultationFee || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!patientId) {
      setError("Please select a patient.");
      return;
    }

    setLoading(true);

    try {
      const res = await createBill({
        patient: patientId,
        registration_fee: registrationFee,
        consultation_fee: consultationFee,
      });

      setBill(res.data);
    } catch (err) {
      console.error(err);
      setError("Unable to create the bill. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const res = await downloadBillPDF(bill.id);

      const url = window.URL.createObjectURL(
        new Blob([res.data], {
          type: "application/pdf",
        })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = `bill_${bill.id}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Unable to download the PDF.");
    }
  };

  return (
    <div className="billing-page">

      <div className="billing-background billing-bg-one"></div>
      <div className="billing-background billing-bg-two"></div>

      <div className="billing-container">

        {/* Header */}
        <div className="billing-header">

          <div>
            <button
              className="billing-back-button"
              onClick={() => navigate("/receptionist-dashboard")}
            >
              ← Back to Dashboard
            </button>

            <div className="billing-title-row">
              <div className="billing-title-icon">
                ₹
              </div>

              <div>
                <h1>Generate Bill</h1>
                <p>
                  Create and manage patient billing records
                </p>
              </div>
            </div>
          </div>

          <div className="billing-header-badge">
            <span>●</span>
            Billing
          </div>

        </div>

        {!bill ? (

          /* =========================
             BILL FORM
          ========================= */

          <div className="billing-card">

            <div className="billing-card-header">
              <div className="billing-section-icon">
                🧾
              </div>

              <div>
                <h2>Billing Information</h2>
                <p>
                  Enter the patient and billing details below.
                </p>
              </div>
            </div>

            {error && (
              <div className="billing-error">
                <span>⚠</span>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Patient */}
              <div className="billing-form-section">

                <div className="billing-section-heading">
                  <div className="billing-mini-icon">
                    👤
                  </div>

                  <div>
                    <h3>Patient Details</h3>
                    <p>Select the patient for this bill</p>
                  </div>
                </div>

                <div className="billing-field">
                  <label>
                    Patient <span>*</span>
                  </label>

                  <select
                    value={patientId}
                    onChange={(e) =>
                      setPatientId(e.target.value)
                    }
                    required
                  >
                    <option value="">
                      Select a patient
                    </option>

                    {patients.map((p) => (
                      <option
                        key={p.id}
                        value={p.id}
                      >
                        {p.patient_id} - {p.full_name}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Charges */}
              <div className="billing-form-section">

                <div className="billing-section-heading">
                  <div className="billing-mini-icon">
                    ₹
                  </div>

                  <div>
                    <h3>Service Charges</h3>
                    <p>Enter applicable hospital charges</p>
                  </div>
                </div>

                <div className="billing-fee-grid">

                  <div className="billing-field">

                    <label>
                      Registration Fee
                    </label>

                    <div className="billing-input-wrapper">
                      <span>₹</span>

                      <input
                        type="number"
                        min="0"
                        value={registrationFee}
                        onChange={(e) =>
                          setRegistrationFee(e.target.value)
                        }
                      />
                    </div>

                  </div>

                  <div className="billing-field">

                    <label>
                      Consultation Fee
                    </label>

                    <div className="billing-input-wrapper">
                      <span>₹</span>

                      <input
                        type="number"
                        min="0"
                        value={consultationFee}
                        onChange={(e) =>
                          setConsultationFee(e.target.value)
                        }
                      />
                    </div>

                  </div>

                </div>

              </div>

              {/* Summary */}
              <div className="billing-summary">

                <div className="billing-summary-header">
                  <span>Bill Summary</span>
                  <small>Amount in INR</small>
                </div>

                <div className="billing-summary-row">
                  <span>Registration Fee</span>
                  <strong>
                    ₹{Number(registrationFee || 0).toFixed(2)}
                  </strong>
                </div>

                <div className="billing-summary-row">
                  <span>Consultation Fee</span>
                  <strong>
                    ₹{Number(consultationFee || 0).toFixed(2)}
                  </strong>
                </div>

                <div className="billing-total-row">
                  <span>Total Amount</span>

                  <strong>
                    ₹{totalAmount.toFixed(2)}
                  </strong>
                </div>

              </div>

              {/* Footer */}
              <div className="billing-form-footer">

                <p>
                  Please verify all details before generating
                  the bill.
                </p>

                <button
                  type="submit"
                  className="billing-generate-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="billing-spinner"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Bill
                      <span>→</span>
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

        ) : (

          /* =========================
             BILL GENERATED
          ========================= */

          <div className="billing-success-card">

            <div className="billing-success-icon">
              ✓
            </div>

            <h2>Bill Generated Successfully</h2>

            <p className="billing-success-subtitle">
              The billing record has been created successfully.
            </p>

            <div className="billing-details">

              <div className="billing-detail-item">
                <span>Bill ID</span>
                <strong>#{bill.id}</strong>
              </div>

              <div className="billing-detail-item">
                <span>Patient</span>
                <strong>{bill.patient_name}</strong>
              </div>

              <div className="billing-detail-item">
                <span>Total Amount</span>
                <strong className="billing-amount">
                  ₹{Number(bill.total_amount).toFixed(2)}
                </strong>
              </div>

              <div className="billing-detail-item">
                <span>Status</span>

                <span
                  className={`billing-status ${
                    bill.status === "paid"
                      ? "paid"
                      : "unpaid"
                  }`}
                >
                  {bill.status}
                </span>
              </div>

            </div>

            <div className="billing-success-actions">

              <button
                className="billing-secondary-button"
                onClick={() => setBill(null)}
              >
                Create Another Bill
              </button>


            </div>

            <button
              className="billing-dashboard-button"
              onClick={() =>
                navigate("/receptionist-dashboard")
              }
            >
              ← Back to Dashboard
            </button>

          </div>

        )}

      </div>
    </div>
  );
}

export default GenerateBill;