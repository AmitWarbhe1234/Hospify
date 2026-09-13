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
    <div className="patient-page lab-reports-page">

      {/* Decorative Background */}
      <div className="patient-bg-circle patient-bg-one"></div>
      <div className="patient-bg-circle patient-bg-two"></div>
      <div className="patient-bg-circle patient-bg-three"></div>

      {/* HEADER */}
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

      {/* MAIN CONTENT */}
      <div className="patient-container">

        <div className="patient-card lab-reports-card">

          {/* REPORT HEADER */}
          <div className="lab-reports-header">

            <div className="lab-title-section">

              <div className="lab-report-icon">
                🧪
              </div>

              <div>
                <h1>My Lab Reports</h1>
                <p>
                  View your laboratory test reports and results
                </p>
              </div>

            </div>

            <div className="lab-report-count">
              {labReports.length}{" "}
              {labReports.length === 1 ? "Report" : "Reports"}
            </div>

          </div>

          {/* LOADING */}
          {labLoading && (
            <div className="patient-loading lab-loading">
              <div className="patient-spinner"></div>
              <p>Loading your reports...</p>
            </div>
          )}

          {/* EMPTY */}
          {!labLoading && labReports.length === 0 && (
            <div className="patient-empty lab-empty">

              <div className="lab-empty-icon">
                🧪
              </div>

              <h3>No Lab Reports</h3>

              <p>
                You don't have any laboratory reports yet.
              </p>

            </div>
          )}

          {/* REPORTS */}
          {!labLoading && labReports.length > 0 && (
            <div className="lab-table-container">

              <table className="lab-reports-table">

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

                      {/* TEST NAME */}
                      <td>
                        <div className="lab-test-name">

                          <div className="lab-test-icon">
                            🧪
                          </div>

                          <div>
                            <strong>
                              {report.test_name}
                            </strong>

                            <span>
                              Laboratory Test
                            </span>
                          </div>

                        </div>
                      </td>

                      {/* DOCTOR */}
                      <td>
                        <div className="lab-doctor">
                          <span className="lab-cell-label">
                            Doctor
                          </span>

                          <strong>
                            {report.doctor_name || "—"}
                          </strong>
                        </div>
                      </td>

                      {/* DATE */}
                      <td>
                        <div className="lab-date">
                          <span className="lab-cell-label">
                            Test Date
                          </span>

                          <strong>
                            {report.test_date}
                          </strong>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td>

                        {report.status === "COMPLETED" ? (
                          <span className="status-badge completed">
                            <span className="status-dot"></span>
                            Completed
                          </span>
                        ) : (
                          <span className="status-badge pending">
                            <span className="status-dot"></span>
                            Pending
                          </span>
                        )}

                      </td>

                      {/* RESULT */}
                      <td>
                        <div className="lab-result">

                          <span className="lab-cell-label">
                            Result
                          </span>

                          <strong>
                            {report.status === "COMPLETED"
                              ? report.result || "No result"
                              : "Awaiting result"}
                          </strong>

                        </div>
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