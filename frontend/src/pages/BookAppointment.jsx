import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function BookAppointment() {

  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  const departments = [
  {
    value: "ORTHOPEDICS",
    label: "Orthopedics",
  },
  {
    value: "NEUROLOGY",
    label: "Neurology",
  },
  {
    value: "CARDIOLOGY",
    label: "Cardiology",
  },
  {
    value: "OPHTHALMOLOGY",
    label: "Ophthalmology",
  },
  {
    value: "GENERAL_MEDICINE",
    label: "General Medicine",
  },
  {
    value: "PEDIATRICS",
    label: "Pediatrics",
  },
  {
    value: "PULMONOLOGY",
    label: "Pulmonology",
  },
];

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

      console.log(
        "Doctors:",
        response.data
      );

      setDoctors(response.data);

    } catch (error) {

      console.log(
        "Doctors Error:",
        error.response?.data
      );

      setDoctors([]);

    }
  };

  fetchDoctors();

}, [department]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    navigate("/");
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {

      const response = await API.post(
        "/appointments/book/",
        {
          doctor: doctor,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          reason: reason,
        }
      );

      console.log(
        "Appointment Response:",
        response.data
      );

      setMessage(
        "Appointment booked successfully!"
      );

      // Clear form
      setDoctor("");
      setAppointmentDate("");
      setAppointmentTime("");
      setReason("");

    } catch (error) {

      console.log(
        "Appointment Error:",
        error.response?.data
      );

      setError(
        error.response?.data?.detail ||
        "Failed to book appointment."
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

            <div className="appointment-logo">
              🏥
            </div>

            <div>
              <h2>Hospify</h2>

              <p>
                Healthcare Management System
              </p>
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
              onClick={() => navigate("/patient-dashboard")}
              style={{
                whiteSpace: "nowrap",
                margin: 0,
                alignSelf: "center",
              }}
            >
              <span>←</span>
              Back to Dashboard
            </button>

            <button
              type="button"
              className="patient-logout"
              onClick={handleLogout}
            style={{
              whiteSpace: "nowrap",
              margin: 0,
              alignSelf: "center",
            }}
                        >
              Logout
            </button>

          </div>

        </div>


        {/* PAGE TITLE */}

        <div className="appointment-title">

          <span className="appointment-eyebrow">
            PATIENT SERVICES
          </span>

          <h1>
            Book an Appointment
          </h1>

          <p>
            Schedule a consultation with one of our
            healthcare professionals.
          </p>

        </div>


        {/* MAIN CARD */}

        <div className="appointment-card">

          <div className="appointment-card-header">

            <div className="appointment-card-icon">
              📅
            </div>

            <div>

              <h2>
                Appointment Details
              </h2>

              <p>
                Please provide the details for your appointment.
              </p>

            </div>

          </div>


          {/* SUCCESS MESSAGE */}

          {message && (

            <div className="appointment-success">

              <span>✓</span>

              <span>
                {message}
              </span>

            </div>

          )}


          {/* ERROR MESSAGE */}

          {error && (

            <div className="appointment-error">

              <span>⚠️</span>

              <span>
                {error}
              </span>

            </div>

          )}


          <form onSubmit={handleSubmit}>

            <div className="appointment-form-grid">

            <div className="appointment-field full-width">

              <label>
                🏥 Select Department
              </label>

              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setDoctor("");
                }}
                required
              >

                <option value="">
                  {department
                    ? "Select a doctor"
                    : "Select department first"}
                </option>

                {departments.map((item) => (

                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>

                ))}

              </select>

            </div>
              {/* DOCTOR */}

              <div className="appointment-field full-width">

                <label>
                  👨‍⚕️ Select Doctor
                </label>

                <select
                value={doctor}
                onChange={(e) =>
                  setDoctor(e.target.value)
                }
                required
                disabled={!department}
              >

                  <option value="">
                    Select a doctor
                  </option>

                  {doctors.map((doc) => (

                    <option
                      key={doc.id}
                      value={doc.id}
                    >
                      Dr. {doc.email}
                    </option>

                  ))}

                </select>

              </div>


              {/* DATE */}

              <div className="appointment-field">

                <label>
                  📅 Appointment Date
                </label>

                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) =>
                    setAppointmentDate(e.target.value)
                  }
                  required
                />

              </div>


              {/* TIME */}

              <div className="appointment-field">

                <label>
                  🕐 Appointment Time
                </label>

                <input
                  type="time"
                  value={appointmentTime}
                  onChange={(e) =>
                    setAppointmentTime(e.target.value)
                  }
                  required
                />

              </div>


              {/* REASON */}

              <div className="appointment-field full-width">

                <label>
                  📝 Reason for Visit
                </label>

                <textarea
                  value={reason}
                  onChange={(e) =>
                    setReason(e.target.value)
                  }
                  placeholder="Briefly describe the reason for your appointment..."
                  rows="5"
                  required
                />

              </div>

            </div>


            {/* BUTTON */}

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
                    <span className="appointment-arrow">
                      →
                    </span>
                  </>

                )}

              </button>

            </div>

          </form>


          {/* SECURITY NOTE */}

          <div className="appointment-note">

            🔒 Your appointment information is securely
            handled by Hospify.

          </div>

        </div>


        {/* FOOTER */}

        <div className="appointment-footer">

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

    </div>

  );
}

export default BookAppointment;
