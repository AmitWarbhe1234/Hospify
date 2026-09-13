import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ReceptionistAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/appointments/receptionist-appointments/"
      );

      setAppointments(response.data);
    } catch (err) {
      console.error("Appointment fetch error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const searchText = search.toLowerCase();

    return (
      String(appointment.id || "")
        .toLowerCase()
        .includes(searchText) ||
      String(appointment.doctor_name || "")
        .toLowerCase()
        .includes(searchText) ||
      String(appointment.patient_name || "")
        .toLowerCase()
        .includes(searchText) ||
      String(appointment.status || "")
        .toLowerCase()
        .includes(searchText) ||
      String(appointment.appointment_date || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "confirmed";

      case "COMPLETED":
        return "completed";

      case "REJECTED":
        return "rejected";

      case "CANCELLED":
        return "cancelled";

      default:
        return "pending";
    }
  };

  return (
    <div className="receptionist-appointments-page">

      {/* Background Decorations */}
      <div className="receptionist-bg-circle receptionist-bg-one"></div>
      <div className="receptionist-bg-circle receptionist-bg-two"></div>
      <div className="receptionist-bg-circle receptionist-bg-three"></div>

      <div className="receptionist-appointments-container">

        {/* ================= HEADER ================= */}

        <header className="receptionist-header">

          <div className="receptionist-brand">

            <div className="receptionist-logo">
              🏥
            </div>

            <div>
              <h2>Hospify</h2>

              <p>
                Healthcare Management System
              </p>
            </div>

          </div>

          <div className="receptionist-user">

            <div className="receptionist-avatar">
              👩‍💼
            </div>

            <div className="receptionist-user-info">

              <strong>
                Receptionist
              </strong>

              <span>
                Front Desk Professional
              </span>

            </div>

            <button
              className="receptionist-logout"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </header>


        {/* ================= PAGE HEADER ================= */}

        <section className="receptionist-appointments-hero">

          <div>

            <span className="receptionist-label">
              APPOINTMENT MANAGEMENT
            </span>

            <h1>
              Patient Appointments 📅
            </h1>

            <p>
              View and manage all patient appointments
              from the reception desk.
            </p>

          </div>

          <div className="receptionist-appointments-hero-icon">
            📅
          </div>

        </section>


        {/* ================= SUMMARY ================= */}

        <section className="appointment-summary">

          <div className="appointment-summary-card">

            <div className="summary-icon blue">
              📋
            </div>

            <div>
              <span>Total Appointments</span>

              <strong>
                {appointments.length}
              </strong>
            </div>

          </div>


          <div className="appointment-summary-card">

            <div className="summary-icon green">
              ✅
            </div>

            <div>
              <span>Confirmed</span>

              <strong>
                {
                  appointments.filter(
                    (item) => item.status === "CONFIRMED"
                  ).length
                }
              </strong>
            </div>

          </div>


          <div className="appointment-summary-card">

            <div className="summary-icon purple">
              ✔️
            </div>

            <div>
              <span>Completed</span>

              <strong>
                {
                  appointments.filter(
                    (item) => item.status === "COMPLETED"
                  ).length
                }
              </strong>
            </div>

          </div>


          <div className="appointment-summary-card">

            <div className="summary-icon orange">
              ⏳
            </div>

            <div>
              <span>Pending</span>

              <strong>
                {
                  appointments.filter(
                    (item) =>
                      ![
                        "CONFIRMED",
                        "COMPLETED",
                        "REJECTED",
                        "CANCELLED",
                      ].includes(item.status)
                  ).length
                }
              </strong>
            </div>

          </div>

        </section>


        {/* ================= MAIN CARD ================= */}

        <section className="appointments-main-card">

          <div className="appointments-card-header">

            <div>

              <h2>
                All Appointments
              </h2>

              <p>
                Search and view patient appointment details.
              </p>

            </div>

            <button
              className="appointments-refresh-button"
              onClick={fetchAppointments}
            >
              🔄 Refresh
            </button>

          </div>


          {/* ================= SEARCH ================= */}

          <div className="appointments-search">

            <span>
              🔎
            </span>

            <input
              type="text"
              placeholder="Search by doctor, patient, date or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>


          {/* ================= CONTENT ================= */}

          {loading ? (

            <div className="appointments-loading">
              <div className="loading-spinner"></div>

              <p>
                Loading appointments...
              </p>
            </div>

          ) : error ? (

            <div className="appointments-error">

              <div>
                ⚠️
              </div>

              <h3>
                Unable to Load Appointments
              </h3>

              <p>
                {error}
              </p>

              <button
                onClick={fetchAppointments}
                className="appointments-retry-button"
              >
                Try Again
              </button>

            </div>

          ) : filteredAppointments.length === 0 ? (

            <div className="appointments-empty">

              <div className="empty-icon">
                📅
              </div>

              <h3>
                No Appointments Found
              </h3>

              <p>
                {search
                  ? "No appointments match your search."
                  : "There are currently no appointments."}
              </p>

            </div>

          ) : (

            <div className="appointments-table-wrapper">

              <table className="appointments-table">

                <thead>

                  <tr>

                    <th>
                      ID
                    </th>

                    <th>
                      Patient
                    </th>

                    <th>
                      Doctor
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Time
                    </th>

                    <th>
                      Reason
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredAppointments.map(
                    (appointment) => (

                      <tr key={appointment.id}>

                        <td>
                          <strong>
                            #{appointment.id}
                          </strong>
                        </td>

                        <td>
                          <div className="appointment-patient">

                            <div className="patient-avatar">
                              👤
                            </div>

                            <span>
                              {appointment.patient_name ||
                                appointment.patient?.name ||
                                "Patient"}
                            </span>

                          </div>
                        </td>

                        <td>
                          <div className="appointment-doctor">

                            <span>
                              👨‍⚕️
                            </span>

                            {appointment.doctor_name ||
                              appointment.doctor?.name ||
                              "Doctor"}

                          </div>
                        </td>

                        <td>
                          {appointment.appointment_date || "-"}
                        </td>

                        <td>
                          {appointment.appointment_time || "-"}
                        </td>

                        <td>
                          <span className="appointment-reason">
                            {appointment.reason || "-"}
                          </span>
                        </td>

                        <td>

                          <span
                            className={`appointment-status ${getStatusClass(
                              appointment.status
                            )}`}
                          >
                            {appointment.status || "PENDING"}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>


        {/* ================= BACK BUTTON ================= */}

        <div className="appointments-back-section">

          <button
            className="appointments-back-button"
            onClick={() =>
              navigate("/receptionist-dashboard")
            }
          >
            ← Back to Receptionist Dashboard
          </button>

        </div>


        {/* ================= FOOTER ================= */}

        <footer className="receptionist-footer">

          <span>
            © 2026 Hospify
          </span>

          <span>
            Healthcare Management System
          </span>

        </footer>

      </div>

    </div>
  );
}

export default ReceptionistAppointments;