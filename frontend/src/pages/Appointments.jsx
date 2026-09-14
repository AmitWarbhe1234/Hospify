import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Appointments() {

  const navigate = useNavigate();

  // ---- Patient Search ----
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searched, setSearched] = useState(false);

  // ---- Appointment Form ----
  const [department, setDepartment] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const departments = [
    { value: "ORTHOPEDICS", label: "Orthopedics" },
    { value: "NEUROLOGY", label: "Neurology" },
    { value: "CARDIOLOGY", label: "Cardiology" },
    { value: "OPHTHALMOLOGY", label: "Ophthalmology" },
    { value: "GENERAL_MEDICINE", label: "General Medicine" },
    { value: "PEDIATRICS", label: "Pediatrics" },
    { value: "PULMONOLOGY", label: "Pulmonology" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Patient search (FindPatient.jsx jaisa hi endpoint)
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setError("");

    try {
      const response = await API.get("/patients/search/", {
        params: { q: query },
      });
      setResults(response.data);
      setSearched(true);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Could not search patients."
      );
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setResults([]);
    setQuery("");
    setSearched(false);
  };

  const changePatient = () => {
    setSelectedPatient(null);
    setMessage("");
    setError("");
  };

  // Department badalte hi doctors fetch karo
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!department) {
        setDoctors([]);
        return;
      }
      try {
        const response = await API.get(
          `/appointments/doctors/?department=${department}`
        );
        setDoctors(response.data);
      } catch (err) {
        setDoctors([]);
      }
    };
    fetchDoctors();
  }, [department]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!selectedPatient) {
      setError("Please search and select a patient first.");
      return;
    }

    setLoading(true);

    try {
      await API.post(
        "/appointments/receptionist-book/",
        {
          patient_id: selectedPatient.patient_id,
          doctor: doctor,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          reason: reason,
        }
      );

      setMessage("Appointment booked successfully!");

      // Reset form (patient selection ko intentionally reset karte hain — naya booking easy ho)
      setSelectedPatient(null);
      setDepartment("");
      setDoctor("");
      setAppointmentDate("");
      setAppointmentTime("");
      setReason("");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to book appointment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appointment-page">

      {/* Background Decorations */}
      <div className="appointment-circle appointment-circle-one"></div>
      <div className="appointment-circle appointment-circle-two"></div>

      <div className="appointment-container">

        {/* HEADER */}
        <div className="appointment-header">

          <div className="appointment-brand">
            <div className="appointment-logo">🏥</div>
            <div>
              <h2>Hospify</h2>
              <p>Healthcare Management System</p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "nowrap",
              flexShrink: 0,
              height: "100%",
            }}
          >
            <button
              type="button"
              className="back-to-dashboard-button"
              onClick={() => navigate("/receptionist-dashboard")}
              style={{ whiteSpace: "nowrap", margin: 0, alignSelf: "center" }}
            >
              <span>←</span>
              Back to Dashboard
            </button>

            <button
              type="button"
              className="patient-logout"
              onClick={handleLogout}
              style={{ whiteSpace: "nowrap", margin: 0, alignSelf: "center" }}
            >
              Logout
            </button>
          </div>

        </div>


        {/* PAGE TITLE */}
        <div className="appointment-title">
          <span className="appointment-eyebrow">RECEPTION DESK</span>
          <h1>Book Appointment for Patient</h1>
          <p>Search a registered patient and schedule their appointment with a doctor.</p>
        </div>


        {/* GLOBAL MESSAGES */}
        {error && (
          <div className="appointment-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="appointment-success">
            <span>✓</span>
            <span>{message}</span>
          </div>
        )}


        {/* ================= STEP 1: PATIENT SEARCH ================= */}
        <div className="appointment-card">

          <div className="appointment-card-header">
            <div className="appointment-card-icon">🔎</div>
            <div>
              <h2>Step 1 — Select Patient</h2>
              <p>Find an already registered patient by ID, name, or email.</p>
            </div>
          </div>

          {selectedPatient ? (

            <div className="appointment-note" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>
                👤 Selected patient: <strong>{selectedPatient.full_name}</strong>{" "}
                (ID: {selectedPatient.patient_id})
              </span>

              <button
                type="button"
                onClick={changePatient}
                className="back-to-dashboard-button"
                style={{ margin: 0 }}
              >
                Change Patient
              </button>
            </div>

          ) : (

            <>
              <form onSubmit={handleSearch}>

                <div className="appointment-form-grid">

                  <div className="appointment-field full-width">
                    <label>👤 Search Patient</label>

                    <input
                      type="text"
                      placeholder="Enter patient ID, name, or email"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      required
                    />
                  </div>

                </div>

                <div className="appointment-button-wrapper">
                  <button
                    type="submit"
                    className="appointment-submit"
                    disabled={searching}
                  >
                    {searching ? (
                      <>
                        <span className="appointment-spinner"></span>
                        Searching...
                      </>
                    ) : (
                      <>
                        🔎 Search Patient
                        <span className="appointment-arrow">→</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

              {searched && results.length === 0 && (
                <div className="doctor-empty">
                  <div>🔎</div>
                  <h3>No patients found</h3>
                  <p>Try searching with a different ID, name, or email.</p>
                </div>
              )}

              {results.length > 0 && (

                <div className="doctor-table-wrapper" style={{ marginTop: "20px" }}>

                  <table className="doctor-table">

                    <thead>
                      <tr>
                        <th>Patient ID</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {results.map((p) => (
                        <tr key={p.id}>
                          <td>{p.patient_id}</td>

                          <td>
                            <div className="doctor-patient">
                              <div className="patient-avatar">👤</div>
                              <div>
                                <strong>{p.full_name}</strong>
                                <span>{p.email}</span>
                              </div>
                            </div>
                          </td>

                          <td>{p.mobile}</td>

                          <td>
                            <button
                              className="action-btn accept-btn"
                              onClick={() => selectPatient(p)}
                            >
                              ✓ Select
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>

                </div>

              )}
            </>

          )}

        </div>


        {/* ================= STEP 2: APPOINTMENT DETAILS ================= */}
        {selectedPatient && (

          <div className="appointment-card">

            <div className="appointment-card-header">
              <div className="appointment-card-icon">📅</div>
              <div>
                <h2>Step 2 — Appointment Details</h2>
                <p>Choose a department, doctor, and preferred time.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="appointment-form-grid">

                <div className="appointment-field full-width">
                  <label>🏥 Select Department</label>

                  <select
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      setDoctor("");
                    }}
                    required
                  >
                    <option value="">Select department</option>
                    {departments.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="appointment-field full-width">
                  <label>👨‍⚕️ Select Doctor</label>

                  <select
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    required
                    disabled={!department}
                  >
                    <option value="">
                      {department ? "Select a doctor" : "Select department first"}
                    </option>
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        Dr. {doc.first_name} {doc.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="appointment-field">
                  <label>📅 Appointment Date</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                  />
                </div>

                <div className="appointment-field">
                  <label>🕐 Appointment Time</label>
                  <input
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    required
                  />
                </div>

                <div className="appointment-field full-width">
                  <label>📝 Reason for Visit</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Briefly describe the reason for this appointment..."
                    rows="5"
                    required
                  />
                </div>

              </div>

              <div className="appointment-button-wrapper">
                <button
                  type="submit"
                  className="appointment-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="appointment-spinner"></span>
                      Booking Appointment...
                    </>
                  ) : (
                    <>
                      📅 Book Appointment
                      <span className="appointment-arrow">→</span>
                    </>
                  )}
                </button>
              </div>

            </form>

            <div className="appointment-note">
              🔒 This appointment will be created on behalf of the selected patient.
            </div>

          </div>

        )}


        {/* FOOTER */}
        <div className="appointment-footer">
          <span>🏥 Hospify Healthcare</span>
          <span>•</span>
          <span>Quality care, simplified.</span>
        </div>

      </div>

    </div>
  );
}

export default Appointments;
