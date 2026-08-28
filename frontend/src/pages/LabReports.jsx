import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function LabReports() {
  const navigate = useNavigate();

  const [labReports, setLabReports] = useState([]);
  const [labLoading, setLabLoading] = useState(true);

  useEffect(() => {
    const getLabReports = async () => {
      try {
        const response = await API.get("/lab/my-reports/");
        setLabReports(response.data);
      } catch (error) {
        console.log("Lab Reports Error:", error.response?.data);
      } finally {
        setLabLoading(false);
      }
    };

    getLabReports();
  }, []);

  return (
    <div className="patient-page">

      {/* Decorative Background */}
      <div className="patient-bg-circle patient-bg-one"></div>
      <div className="patient-bg-circle patient-bg-two"></div>
      <div className="patient-bg-circle patient-bg-three"></div>

      {/* HEADER */}
      <div className="patient-header">

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

        {/* LAB REPORTS */}
        <div className="patient-card">

          <div className="patient-card-header">

            <div className="patient-section-icon">🧪</div>

            <div style={{ flex: 1 }}>
              <h3>My Lab Reports</h3>
              <p>Your laboratory test reports</p>
            </div>

            <div
              className="patient-active-badge"
              style={{
                background: "rgba(99,102,241,0.1)",
                color: "#4338ca",
                border: "1px solid rgba(99,102,241,0.15)",
              }}
            >
              {labReports.length} Report
              {labReports.length !== 1 ? "s" : ""}
            </div>

          </div>

          {labLoading ? (

            <div className="patient-loading">
              <div className="patient-spinner"></div>
              <p>Loading your reports...</p>
            </div>

          ) : labReports.length === 0 ? (

            <div className="patient-empty">
              <div>🧪</div>
              <h3>No Lab Reports</h3>
              <p>You don't have any lab reports yet.</p>
            </div>

          ) : (

            <div className="patient-table-wrapper">

              <table className="patient-table">

                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Doctor</th>
                    <th>Test Date</th>
                    <th>Status</th>
                    <th>Result</th>
                  </tr>
                </thead>

                <tbody>
                  {labReports.map((report) => (
                    <tr key={report.id}>
                      <td style={{ fontWeight: 700 }}>
                        {report.test_name}
                      </td>
                      <td>{report.doctor_name}</td>
                      <td>{report.test_date}</td>
                      <td>
                        {report.status === "COMPLETED" ? (
                          <span className="status-badge completed">
                            Completed
                          </span>
                        ) : (
                          <span className="status-badge pending">
                            Pending
                          </span>
                        )}
                      </td>
                      <td>
                        {report.status === "COMPLETED"
                          ? report.result
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default LabReports;
