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

  // Patient search (FindPatient jaisa hi)
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setError("");

    try {
      const response = await API.get("/patients/search/", {
        params: { q: query },
      });
      setResults(response.data);
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
      const response = await API.post(
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

      // Reset form
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

      <div className="appointment-header">
        <div className="appointment-brand">
          <div className="appointment-logo">🏥</div>
          <div>
            <h2>Hospify</h2>
            <p>Healthcare Management System</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="button"
            className="back-to-dashboard-button"
            onClick={() => navigate("/receptionist-dashboard")}
          >
            <span>←</span> Back to Dashboard
          </button>
          <button
            type="button"
            className="patient-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="appointment-title">
        <h1>Book Appointment for Patient</h1>
        <p>Search a registered patient and schedule their appointment.</p>
      </div>

      {error && <div className="appointment-error"><span>⚠️</span><span>{error}</span></div>}
      {message && <div className="appointment-success"><span>✓</span><span>{message}</span></div>}

      {/* ---- STEP 1: PATIENT SEARCH ---- */}
      <div className="appointment-card">
        <h2>Step 1 — Select Patient</h2>

        {selectedPatient ? (
          <div className="appointment-note">
            Selected: <strong>{selectedPatient.full_name}</strong>{" "}
            ({selectedPatient.patient_id})
            <button
              type="button"
              onClick={() => setSelectedPatient(null)}
              style={{ marginLeft: "12px" }}
            >
              Change
            </button>
          </div>
        ) : (
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by patient ID, name, or email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
            <button type="submit" disabled={searching}>
              {searching ? "Searching..." : "Search"}
            </button>
          </form>
        )}

        {results.length > 0 && (
          <table style={{ width: "100%", marginTop: "12px" }}>
            <tbody>
              {results.map((p) => (
                <tr
                  key={p.id}
                  style={{ cursor: "pointer", borderBottom: "1px solid #eee" }}
                  onClick={() => selectPatient(p)}
                >
                  <td style={{ padding: "8px" }}>{p.patient_id}</td>
                  <td style={{ padding: "8px" }}>{p.full_name}</td>
                  <td style={{ padding: "8px" }}>{p.mobile}</td>
                  <td style={{ padding: "8px", textAlign: "right" }}>Select →</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ---- STEP 2: APPOINTMENT DETAILS ---- */}
      {selectedPatient && (
        <div className="appointment-card">
          <h2>Step 2 — Appointment Details</h2>

          <form onSubmit={handleSubmit}>
            <div className="appointment-form-grid">

              <div className="appointment-field full-width">
                <label>🏥 Department</label>
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
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div className="appointment-field full-width">
                <label>👨‍⚕️ Doctor</label>
                <select
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  required
                  disabled={!department}
                >
                  <option value="">Select doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      Dr. {doc.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="appointment-field">
                <label>📅 Date</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                />
              </div>

              <div className="appointment-field">
                <label>🕐 Time</label>
                <input
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  required
                />
              </div>

              <div className="appointment-field full-width">
                <label>📝 Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="4"
                  required
                />
              </div>

            </div>

            <button type="submit" disabled={loading} className="appointment-submit">
              {loading ? "Booking..." : "📅 Book Appointment"}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}

export default Appointments;