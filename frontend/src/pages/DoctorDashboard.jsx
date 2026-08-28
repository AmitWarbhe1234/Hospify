import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [testName, setTestName] = useState("");
  const [labMessage, setLabMessage] = useState("");
  const [labLoading, setLabLoading] = useState(false);

  const [doctorLabReports, setDoctorLabReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [viewingReport, setViewingReport] = useState(null);


  const handleLogout = () => {

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");

    navigate("/login");
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await API.get(
          "/appointments/doctor-appointments/"
        );

        setAppointments(response.data);
      } catch (error) {
        console.log(
          "Doctor Appointments Error:",
          error.response?.data
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchLabReports = async () => {
      try {
        const response = await API.get(
          "/lab/doctor-reports/"
        );

        setDoctorLabReports(response.data);
      } catch (error) {
        console.log(
          "Doctor Lab Reports Error:",
          error.response?.data
        );
      } finally {
        setReportsLoading(false);
      }
    };

    fetchLabReports();
  }, []);

  const handleUpdateStatus = async (appointmentId, newStatus) => {

    try {

      const response = await API.patch(
        `/appointments/update-status/${appointmentId}/`,
        {
          status: newStatus,
        }
      );

      console.log("Status Updated:", response.data);

      // Local state mein bhi update kar do, taaki turant UI badal jaye
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );

    } catch (error) {

      console.log(
        "Status Update Error:",
        error.response?.data
      );

      alert(
        error.response?.data?.detail ||
          "Failed to update appointment status."
      );

    }
  };


  const handleLabRequest = async () => {
    setLabMessage("");

    if (!selectedPatient || !testName) {
      setLabMessage(
        "Please select a patient and enter test name."
      );
      return;
    }

    try {
      setLabLoading(true);

      const response = await API.post(
        "/lab/request/",
        {
          patient: selectedPatient,
          test_name: testName,
        }
      );

      console.log(
        "Lab Test Request:",
        response.data
      );

      setLabMessage(
        "Lab test requested successfully."
      );

      setSelectedPatient("");
      setTestName("");
    } catch (error) {
      console.log(
        "Lab Test Error:",
        error.response?.data
      );

      setLabMessage(
        error.response?.data?.detail ||
          "Failed to request lab test."
      );
    } finally {
      setLabLoading(false);
    }
  };

  const totalAppointments = appointments.length;

  const pendingAppointments = appointments.filter(
    (appointment) =>
      appointment.status?.toLowerCase() === "pending"
  ).length;

  const completedAppointments = appointments.filter(
    (appointment) =>
      appointment.status?.toLowerCase() === "completed"
  ).length;

  return (
    <div className="doctor-page">

      {/* Decorative Background */}
      <div className="doctor-bg-circle doctor-bg-one"></div>
      <div className="doctor-bg-circle doctor-bg-two"></div>
      <div className="doctor-bg-circle doctor-bg-three"></div>

      <div className="doctor-container">

        {/* HEADER */}

        <div className="doctor-header">

          <div className="doctor-brand">

            <div className="doctor-logo">
              🏥
            </div>

            <div>
              <h2>Hospify</h2>
              <p>Healthcare Management System</p>
            </div>

          </div>

          <div className="doctor-user">

          <div className="doctor-avatar">
            👨‍⚕️
          </div>

          <div>
            <strong>Doctor</strong>
            <span>Healthcare Professional</span>
          </div>

          <button
            className="doctor-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

        </div>


        {/* HERO */}

        <div className="doctor-hero">

          <div>

            <span className="doctor-label">
              DOCTOR PORTAL
            </span>

            <h1>
              Doctor Dashboard 👋
            </h1>

            <p>
              Manage your appointments and request
              laboratory tests for your patients.
            </p>

          </div>

          <div className="doctor-hero-icon">
            🩺
          </div>

        </div>


        {/* STATISTICS */}

        <div className="doctor-stats">

          <div className="doctor-stat-card">

            <div className="doctor-stat-icon blue">
              📅
            </div>

            <div>
              <span>Total Appointments</span>
              <strong>{totalAppointments}</strong>
              <small>All appointments</small>
            </div>

          </div>


          <div className="doctor-stat-card">

            <div className="doctor-stat-icon purple">
              ⏳
            </div>

            <div>
              <span>Pending</span>
              <strong>{pendingAppointments}</strong>
              <small>Needs attention</small>
            </div>

          </div>


          <div className="doctor-stat-card">

            <div className="doctor-stat-icon green">
              ✓
            </div>

            <div>
              <span>Completed</span>
              <strong>{completedAppointments}</strong>
              <small>Completed visits</small>
            </div>

          </div>


          <div className="doctor-stat-card">

            <div className="doctor-stat-icon orange">
              👥
            </div>

            <div>
              <span>Patients</span>
              <strong>
                {new Set(
                  appointments.map(
                    (appointment) =>
                      appointment.patient
                  )
                ).size}
              </strong>
              <small>Unique patients</small>
            </div>

          </div>

        </div>


        {/* APPOINTMENTS */}

        <div className="doctor-card">

          <div className="doctor-card-header">

            <div className="doctor-section-icon blue-bg">
              📅
            </div>

            <div>

              <h2>My Appointments</h2>

              <p>
                View and manage your scheduled
                patient appointments.
              </p>

            </div>

            <div className="doctor-count">
              {appointments.length} Appointments
            </div>

          </div>


          {loading ? (

            <div className="doctor-loading">

              <div className="doctor-spinner"></div>

              <p>
                Loading appointments...
              </p>

            </div>

          ) : appointments.length === 0 ? (

            <div className="doctor-empty">

              <div>📅</div>

              <h3>
                No appointments found
              </h3>

              <p>
                You don't have any scheduled
                appointments yet.
              </p>

            </div>

          ) : (

            <div className="doctor-table-wrapper">

              <table className="doctor-table">

                <thead>

                  <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {appointments.map(
                    (appointment) => (

                    <tr key={appointment.id}>

                      <td>

                        <div className="doctor-patient">

                          <div className="patient-avatar">
                            👤
                          </div>

                          <div>
                            <strong>
                              {appointment.patient}
                            </strong>

                            <span>
                              Patient ID
                            </span>
                          </div>

                        </div>

                      </td>

                      <td>
                        <span className="doctor-date">
                          📅{" "}
                          {appointment.appointment_date}
                        </span>
                      </td>

                      <td>
                        <span className="doctor-time">
                          🕐{" "}
                          {appointment.appointment_time}
                        </span>
                      </td>

                      <td>
                        {appointment.reason || "General consultation"}
                      </td>

                      <td>

                        <span
                          className={`status-badge ${
                            appointment.status
                              ?.toLowerCase()
                              .replace(/\s+/g, "-")
                          }`}
                        >
                          {appointment.status}
                        </span>

                      </td>

                      <td>

                        {appointment.status === "PENDING" && (

                          <div className="appointment-action-buttons">

                            <button
                              className="action-btn accept-btn"
                              onClick={() =>
                                handleUpdateStatus(appointment.id, "CONFIRMED")
                              }
                            >
                              ✅ Accept
                            </button>

                            <button
                              className="action-btn reject-btn"
                              onClick={() =>
                                handleUpdateStatus(appointment.id, "REJECTED")
                              }
                            >
                              ❌ Reject
                            </button>

                          </div>

                        )}

                        {appointment.status === "CONFIRMED" && (

                          <button
                            className="action-btn complete-btn"
                            onClick={() =>
                              handleUpdateStatus(appointment.id, "COMPLETED")
                            }
                          >
                            ✔️ Complete
                          </button>

                        )}

                        {(appointment.status === "REJECTED" ||
                          appointment.status === "COMPLETED") && (

                          <span className="action-disabled">
                            No actions available
                          </span>

                        )}

                      </td>

                    </tr>

                  ))}
                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* PATIENT LAB REPORTS */}

        <div className="doctor-card">

          <div className="doctor-card-header">

            <div className="doctor-section-icon green-bg">
              🧪
            </div>

            <div>

              <h2>Patient Lab Reports</h2>

              <p>
                View lab test reports for your requested
                tests.
              </p>

            </div>

            <div className="doctor-count">
              {doctorLabReports.length} Reports
            </div>

          </div>


          {reportsLoading ? (

            <div className="doctor-loading">

              <div className="doctor-spinner"></div>

              <p>
                Loading lab reports...
              </p>

            </div>

          ) : doctorLabReports.length === 0 ? (

            <div className="doctor-empty">

              <div>🧪</div>

              <h3>
                No lab reports found
              </h3>

              <p>
                You haven't requested any lab tests yet.
              </p>

            </div>

          ) : (

            <div className="doctor-table-wrapper">

              <table className="doctor-table">

                <thead>

                  <tr>
                    <th>Patient</th>
                    <th>Test</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Result</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {doctorLabReports.map(
                    (report) => (

                    <tr key={report.id}>

                      <td>

                        <div className="doctor-patient">

                          <div className="patient-avatar">
                            👤
                          </div>

                          <div>
                            <strong>
                              {report.patient_name}
                            </strong>

                            <span>
                              {report.patient_id}
                            </span>
                          </div>

                        </div>

                      </td>

                      <td>
                        {report.test_name}
                      </td>

                      <td>
                        {report.test_date}
                      </td>

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
                          ? "Available"
                          : "—"}
                      </td>

                      <td>

                        {report.status === "COMPLETED" ? (

                          <button
                            className="action-btn accept-btn"
                            onClick={() =>
                              setViewingReport(report)
                            }
                          >
                            👁️ View Report
                          </button>

                        ) : (

                          <span className="action-disabled">
                            Awaiting result
                          </span>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* LAB TEST SECTION */}

        <div className="doctor-card lab-request-card">

          <div className="doctor-card-header">

            <div className="doctor-section-icon green-bg">
              🧪
            </div>

            <div>

              <h2>Request Lab Test</h2>

              <p>
                Create a laboratory test request
                for your patient.
              </p>

            </div>

          </div>


          <div className="lab-form">

            <div className="lab-field">

              <label>
                Select Patient
              </label>

              <div className="doctor-input-wrapper">

                <span>👤</span>

                <select
                  value={selectedPatient}
                  onChange={(e) =>
                    setSelectedPatient(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Patient
                  </option>

                  {appointments.map(
                    (appointment) => (

                    <option
                      key={appointment.id}
                      value={appointment.patient}
                    >
                      Patient ID:{" "}
                      {appointment.patient}
                    </option>

                  ))}

                </select>

              </div>

            </div>


            <div className="lab-field">

              <label>
                Laboratory Test
              </label>

              <div className="doctor-input-wrapper">

                <span>🧪</span>

                <input
                  type="text"
                  placeholder="Enter test name"
                  value={testName}
                  onChange={(e) =>
                    setTestName(e.target.value)
                  }
                />

              </div>

            </div>


            <button
              className="lab-request-button"
              onClick={handleLabRequest}
              disabled={labLoading}
            >

              {labLoading ? (
                <>
                  <span className="doctor-button-spinner"></span>
                  Requesting...
                </>
              ) : (
                <>
                  + Request Lab Test
                </>
              )}

            </button>

          </div>


          {labMessage && (

            <div
              className={`lab-message ${
                labMessage.includes(
                  "successfully"
                )
                  ? "success"
                  : "error"
              }`}
            >

              <span>
                {labMessage.includes(
                  "successfully"
                )
                  ? "✓"
                  : "⚠"}
              </span>

              {labMessage}

            </div>

          )}

        </div>


        {/* VIEW REPORT MODAL */}

        {viewingReport && (

          <div
            className="admin-modal-overlay"
            onClick={() => setViewingReport(null)}
          >

            <div
              className="admin-modal-box"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="admin-modal-icon">
                🧪
              </div>

              <h2>Lab Report</h2>

              <p className="admin-modal-message">
                {viewingReport.test_name}
              </p>

              <div className="admin-modal-staff">

                <div className="admin-modal-avatar">
                  👤
                </div>

                <div className="admin-modal-staff-info">

                  <strong>
                    {viewingReport.patient_name}
                  </strong>

                  <span>
                    {viewingReport.patient_id}
                  </span>

                </div>

              </div>

              <div style={{ textAlign: "left", marginTop: "20px" }}>

                <p style={{ fontSize: "12px", color: "#8a94aa", marginBottom: "6px" }}>
                  Test Date: {viewingReport.test_date}
                </p>

                <p style={{ fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "8px" }}>
                  Result:
                </p>

                <div
                  style={{
                    background: "#f8faff",
                    border: "1px solid #dbe3ef",
                    borderRadius: "12px",
                    padding: "15px",
                    fontSize: "13px",
                    color: "#172033",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {viewingReport.result}
                </div>

              </div>

              <div className="admin-modal-actions">

                <button
                  onClick={() => setViewingReport(null)}
                  className="admin-modal-confirm"
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}


        {/* FOOTER */}

        <div className="doctor-footer">

          <span>
            🏥 Hospify Healthcare Management System
          </span>

          <span>
            Secure • Reliable • Professional
          </span>

        </div>

      </div>

    </div>
  );
}

export default DoctorDashboard;
