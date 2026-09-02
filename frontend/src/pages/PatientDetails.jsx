import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function PatientDetails() {

  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await API.get(`/patients/${patientId}/`);
        setPatient(response.data);
      } catch (err) {
        console.log("Patient Details Error:", err.response?.data);

        const errorMessage =
          err.response?.data?.detail ||
          "Could not load patient details.";

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  return (
    <div className="registration-page">

      <div className="registration-circle registration-circle-one"></div>
      <div className="registration-circle registration-circle-two"></div>
      <div className="registration-circle registration-circle-three"></div>

      <div className="registration-wrapper">

        <div className="registration-header">
          <div className="registration-logo">🏥</div>
          <div>
            <div className="registration-brand">Hospify</div>
            <p>Healthcare Management System</p>
          </div>
        </div>

        <button
          type="button"
          className="back-to-dashboard-button"
          onClick={() => navigate("/find-patient")}
        >
          <span>←</span>
          Back to Search
        </button>

        <div className="registration-title">
          <div>
            <h1>Patient Details</h1>
            <p>{patientId}</p>
          </div>
          <div className="registration-badge">👤 Profile</div>
        </div>

        {error && (
          <div className="registration-error">
            <span>⚠️</span>
            <div>{error}</div>
          </div>
        )}

        {loading && <p>Loading...</p>}

        {!loading && patient && (
          <div className="registration-card">

            <div className="form-section">
              <div className="form-section-heading">
                <div className="section-icon">👤</div>
                <div>
                  <h3>Personal Information</h3>
                  <p>Basic information about the patient</p>
                </div>
              </div>

              <div className="registration-grid">
                <div className="registration-field">
                  <label>Patient ID</label>
                  <input type="text" value={patient.patient_id} disabled />
                </div>

                <div className="registration-field">
                  <label>Full Name</label>
                  <input type="text" value={patient.full_name} disabled />
                </div>

                <div className="registration-field">
                  <label>Date of Birth</label>
                  <input type="text" value={patient.date_of_birth || "-"} disabled />
                </div>

                <div className="registration-field">
                  <label>Gender</label>
                  <input type="text" value={patient.gender || "-"} disabled />
                </div>

                <div className="registration-field">
                  <label>Blood Group</label>
                  <input type="text" value={patient.blood_group || "-"} disabled />
                </div>

                <div className="registration-field">
                  <label>Mobile Number</label>
                  <input type="text" value={patient.mobile || "-"} disabled />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-heading">
                <div className="section-icon">🔐</div>
                <div>
                  <h3>Account Information</h3>
                  <p>Login credentials for the patient</p>
                </div>
              </div>

              <div className="registration-grid">
                <div className="registration-field">
                  <label>Email Address</label>
                  <input type="text" value={patient.email} disabled />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-heading">
                <div className="section-icon">🚨</div>
                <div>
                  <h3>Contact Information</h3>
                  <p>Emergency and address details</p>
                </div>
              </div>

              <div className="registration-grid">
                <div className="registration-field">
                  <label>Emergency Contact</label>
                  <input
                    type="text"
                    value={patient.emergency_contact || "-"}
                    disabled
                  />
                </div>

                <div className="registration-field full-width">
                  <label>Address</label>
                  <textarea rows="4" value={patient.address || "-"} disabled />
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default PatientDetails;
