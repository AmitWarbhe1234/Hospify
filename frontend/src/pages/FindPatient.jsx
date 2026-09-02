import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function FindPatient() {

  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await API.get("/patients/search/", {
        params: { q: query },
      });

      setResults(response.data);
      setSearched(true);
    } catch (err) {
      console.log("Find Patient Error:", err.response?.data);

      const errorMessage =
        err.response?.data?.detail ||
        "Could not search patients. Please try again.";

      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const openPatient = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

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
          onClick={() => navigate("/receptionist-dashboard")}
        >
          <span>←</span>
          Back to Dashboard
        </button>

        <div className="registration-title">
          <div>
            <h1>Find Patient</h1>
            <p>Search by patient ID, name, or email.</p>
          </div>
          <div className="registration-badge">🔍 Search</div>
        </div>

        {error && (
          <div className="registration-error">
            <span>⚠️</span>
            <div>{error}</div>
          </div>
        )}

        <div className="registration-card">

          <form onSubmit={handleSearch}>
            <div className="form-section">
              <div className="registration-grid">
                <div className="registration-field full-width">
                  <label>Search</label>
                  <input
                    type="text"
                    placeholder="Enter patient ID, name, or email"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="registration-footer">
                <div></div>
                <button
                  type="submit"
                  className="registration-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="registration-spinner"></span>
                      Searching...
                    </>
                  ) : (
                    <>
                      Search
                      <span className="button-arrow">→</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {searched && !loading && (
            <div className="form-section">

              {results.length === 0 ? (
                <p>No patients found.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ textAlign: "left", borderBottom: "2px solid #eee" }}>
                      <th style={{ padding: "10px" }}>Patient ID</th>
                      <th style={{ padding: "10px" }}>Name</th>
                      <th style={{ padding: "10px" }}>Email</th>
                      <th style={{ padding: "10px" }}>Mobile</th>
                      <th style={{ padding: "10px" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((patient) => (
                      <tr
                        key={patient.id}
                        style={{
                          borderBottom: "1px solid #f0f0f0",
                          cursor: "pointer",
                        }}
                        onClick={() => openPatient(patient.patient_id)}
                      >
                        <td style={{ padding: "10px" }}>{patient.patient_id}</td>
                        <td style={{ padding: "10px" }}>{patient.full_name}</td>
                        <td style={{ padding: "10px" }}>{patient.email}</td>
                        <td style={{ padding: "10px" }}>{patient.mobile}</td>
                        <td style={{ padding: "10px", textAlign: "right" }}>
                          View →
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default FindPatient;
