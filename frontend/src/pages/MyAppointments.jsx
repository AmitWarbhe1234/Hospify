import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function MyAppointments() {

  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {

    try {

      const response = await API.get(
        "/appointments/my-appointments/"
      );

      setAppointments(response.data);

    } catch (error) {

      console.log(
        "Appointments Error:",
        error.response?.data
      );

    } finally {

      setLoading(false);

    }
  };


  const handleLogout = () => {

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    navigate("/login");

  };


  const handleCancelAppointment = async () => {

    if (!selectedAppointment) {
      return;
    }

    const appointmentId = selectedAppointment.id;

    setCancellingId(appointmentId);

    try {

      const response = await API.patch(
        `/appointments/cancel/${appointmentId}/`
      );

      console.log(
        "Cancel Response:",
        response.data
      );

      setSelectedAppointment(null);

      await fetchAppointments();

    } catch (error) {

      console.log(
        "Cancel Appointment Error:",
        error.response?.data
      );

      alert(
        error.response?.data?.detail ||
        "Failed to cancel appointment."
      );

    } finally {

      setCancellingId(null);

    }

  };


  const getStatusClass = (status) => {

    switch (status) {

      case "CONFIRMED":
        return "appointment-status confirmed";

      case "PENDING":
        return "appointment-status pending";

      case "COMPLETED":
        return "appointment-status completed";

      case "CANCELLED":
        return "appointment-status cancelled";

      case "REJECTED":
        return "appointment-status rejected";

      default:
        return "appointment-status";

    }

  };


  const getStatusIcon = (status) => {

    switch (status) {

      case "CONFIRMED":
        return "✓";

      case "PENDING":
        return "⏳";

      case "COMPLETED":
        return "✓";

      case "CANCELLED":
        return "✕";

      case "REJECTED":
        return "✕";

      default:
        return "•";

    }

  };


  const formatTime = (timeString) => {

    if (!timeString) {
      return "";
    }

    const [hourStr, minuteStr] = timeString.split(":");

    let hour = parseInt(hourStr, 10);
    const minute = minuteStr;

    const period = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;

    if (hour === 0) {
      hour = 12;
    }

    return `${hour}:${minute} ${period}`;

  };


  if (loading) {

    return (

      <div className="appointments-page">

        <div className="appointments-loading">

          <div className="appointments-spinner"></div>

          <p>
            Loading your appointments...
          </p>

        </div>

      </div>

    );

  }


  return (

    <div className="appointments-page">

      {/* Background Decorations */}

      <div className="appointments-bg-circle appointments-bg-one"></div>
      <div className="appointments-bg-circle appointments-bg-two"></div>
      <div className="appointments-bg-circle appointments-bg-three"></div>


      <div className="appointments-container">

        {/* HEADER */}

        <div className="appointments-header">

          <div className="appointments-brand">

            <div className="appointments-logo">
              🏥
            </div>

            <div>

              <h2>
                Hospify
              </h2>

              <p>
                Healthcare Management System
              </p>

            </div>

          </div>


          <div className="appointments-header-actions">

            <button
              className="appointments-back-button"
              onClick={() => navigate("/patient-dashboard")}
            >
              ← Back to Dashboard
            </button>

            <button
              className="appointments-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </div>


        {/* PAGE HERO */}

        <div className="appointments-hero">

          <span className="appointments-eyebrow">
            PATIENT SERVICES
          </span>

          <h1>
            My Appointments
          </h1>

          <p>
            View and manage all your upcoming and previous appointments.
          </p>

        </div>


        {/* SUMMARY */}

        <div className="appointments-summary">

          <div className="appointment-summary-card">

            <div className="appointment-summary-icon">
              📅
            </div>

            <div>

              <span>
                Total Appointments
              </span>

              <strong>
                {appointments.length}
              </strong>

            </div>

          </div>


          <div className="appointment-summary-card">

            <div className="appointment-summary-icon pending-icon">
              ⏳
            </div>

            <div>

              <span>
                Pending
              </span>

              <strong>
                {
                  appointments.filter(
                    (item) => item.status === "PENDING"
                  ).length
                }
              </strong>

            </div>

          </div>


          <div className="appointment-summary-card">

            <div className="appointment-summary-icon confirmed-icon">
              ✓
            </div>

            <div>

              <span>
                Confirmed
              </span>

              <strong>
                {
                  appointments.filter(
                    (item) => item.status === "CONFIRMED"
                  ).length
                }
              </strong>

            </div>

          </div>

        </div>


        {/* APPOINTMENTS */}

        <div className="appointments-card">

          <div className="appointments-card-header">

            <div className="appointments-section-icon">
              📋
            </div>

            <div>

              <h2>
                Appointment History
              </h2>

              <p>
                Your complete appointment records
              </p>

            </div>

            <div className="appointments-count">

              {appointments.length} Appointment
              {appointments.length !== 1 ? "s" : ""}

            </div>

          </div>


          {appointments.length === 0 ? (

            <div className="appointments-empty">

              <div className="appointments-empty-icon">
                📅
              </div>

              <h3>
                No Appointments Yet
              </h3>

              <p>
                You haven't booked any appointments yet.
              </p>

              <button
                onClick={() => navigate("/book-appointment")}
              >
                📅 Book an Appointment
              </button>

            </div>

          ) : (

            <div className="appointments-list">

              {appointments.map((appointment) => (

                <div
                  className="appointment-item"
                  key={appointment.id}
                >

                  {/* LEFT */}

                  <div className="appointment-main">

                    <div className="appointment-doctor-icon">
                      👨‍⚕️
                    </div>

                    <div className="appointment-doctor-info">

                      <span className="appointment-label">
                        DOCTOR
                      </span>

                      <h3>
                        Dr. {appointment.doctor_name}
                      </h3>

                      <p>
                        Appointment #{appointment.id}
                      </p>

                    </div>

                  </div>


                  {/* DETAILS */}

                  <div className="appointment-details">

                    <div className="appointment-detail">

                      <span>
                        📅 Date
                      </span>

                      <strong>
                        {appointment.appointment_date}
                      </strong>

                    </div>


                    <div className="appointment-detail">

                      <span>
                        🕐 Time
                      </span>

                      <strong>
                        {formatTime(appointment.appointment_time)}
                      </strong>

                    </div>


                    <div className="appointment-detail reason-detail">

                      <span>
                        📝 Reason
                      </span>

                      <strong>
                        {appointment.reason || "Not specified"}
                      </strong>

                    </div>

                  </div>


                  {/* STATUS + ACTION */}

                  <div className="appointment-actions">

                    <span
                      className={getStatusClass(
                        appointment.status
                      )}
                    >

                      {getStatusIcon(
                        appointment.status
                      )}

                      {appointment.status}

                    </span>


                    {(appointment.status === "PENDING" ||
                      appointment.status === "CONFIRMED") && (

                      <button
                        className="cancel-appointment-button"
                        onClick={() =>
                          setSelectedAppointment(
                            appointment
                          )
                        }
                        disabled={
                          cancellingId === appointment.id
                        }
                      >

                        ✕ Cancel Appointment

                      </button>

                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* FOOTER */}

        <div className="appointments-footer">

          <span>
            🏥 Hospify Healthcare
          </span>

          <span>
            •
          </span>

          <span>
            Quality care, simplified.
          </span>

        </div>

      </div>


      {/* CONFIRMATION MODAL */}

      {selectedAppointment && (

        <div className="cancel-modal-overlay">

          <div className="cancel-modal">

            <div className="cancel-modal-icon">
              ⚠️
            </div>

            <h2>
              Cancel Appointment?
            </h2>

            <p>
              Are you sure you want to cancel this appointment?
            </p>


            <div className="cancel-modal-details">

              <div>

                <span>
                  Doctor
                </span>

                <strong>
                  Dr. {selectedAppointment.doctor_name}
                </strong>

              </div>

              <div>

                <span>
                  Date
                </span>

                <strong>
                  {selectedAppointment.appointment_date}
                </strong>

              </div>

              <div>

                <span>
                  Time
                </span>

                <strong>
                  {formatTime(selectedAppointment.appointment_time)}
                </strong>

              </div>

            </div>


            <div className="cancel-modal-actions">

              <button
                className="keep-appointment-button"
                onClick={() =>
                  setSelectedAppointment(null)
                }
              >
                Keep Appointment
              </button>


              <button
                className="confirm-cancel-button"
                onClick={handleCancelAppointment}
                disabled={cancellingId === selectedAppointment.id}
              >

                {cancellingId === selectedAppointment.id
                  ? "Cancelling..."
                  : "Yes, Cancel"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default MyAppointments;
