import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function PatientDashboard() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await API.get("/auth/profile/");
        setPatient(response.data);
      } catch (error) {
        console.log(
          "Profile Error:",
          error.response?.data
        );
      }
    };

    getProfile();
  }, []);

  return (
    <div className="patient-page">

      <div className="patient-bg-circle patient-bg-one"></div>
      <div className="patient-bg-circle patient-bg-two"></div>
      <div className="patient-bg-circle patient-bg-three"></div>

      <div className="patient-header">

        <div className="patient-brand">

          <div className="patient-logo">
            🏥
          </div>

          <div>
            <h2>Hospify</h2>
            <p>Healthcare Management System</p>
          </div>

        </div>

        <div className="patient-header-right">

          <button
            className="patient-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>


      <div className="patient-container">

        {patient ? (
          <>

            <div className="patient-welcome">

              <span className="patient-welcome-label">
                PATIENT PORTAL
              </span>

              <h1>
                Welcome, {patient.first_name}{" "}
                {patient.last_name} 👋
              </h1>

              <p>
                Manage your appointments, profile and
                medical reports from one place.
              </p>

            </div>


            <div className="patient-id-card">

              <div>
                <span>Patient ID</span>
                <strong>
                  {patient.patient_id || "Not available"}
                </strong>
              </div>

              <div className="patient-active-badge">
                ● Active Patient
              </div>

            </div>


            <div className="patient-grid">

              <div className="patient-card">

                <div className="patient-card-header">

                  <div className="patient-section-icon">
                    👤
                  </div>

                  <div>
                    <h3>Patient Information</h3>
                    <p>Your personal details</p>
                  </div>

                </div>

                <div className="patient-info-grid">

                  <div className="patient-info-item">
                    <span>Full Name</span>
                    <strong>
                      {patient.first_name} {patient.last_name}
                    </strong>
                  </div>

                  <div className="patient-info-item">
                    <span>Email</span>
                    <strong>{patient.email}</strong>
                  </div>

                  <div className="patient-info-item">
                    <span>Gender</span>
                    <strong>
                      {patient.gender || "Not available"}
                    </strong>
                  </div>

                  <div className="patient-info-item">
                    <span>Blood Group</span>
                    <strong>
                      {patient.blood_group || "Not available"}
                    </strong>
                  </div>

                  <div className="patient-info-item">
                    <span>Mobile</span>
                    <strong>
                      {patient.mobile || "Not available"}
                    </strong>
                  </div>

                  <div className="patient-info-item">
                    <span>Role</span>
                    <strong>{patient.role}</strong>
                  </div>

                </div>

              </div>


              <div className="patient-card">

                <div className="patient-card-header">

                  <div className="patient-section-icon">
                    ⚡
                  </div>

                  <div>
                    <h3>Quick Actions</h3>
                    <p>Access your healthcare services</p>
                  </div>

                </div>

                <button
                  className="patient-action-button primary"
                  onClick={() => navigate("/book-appointment")}
                >
                  📅 Book an Appointment
                </button>

                <button
                  className="patient-action-button secondary"
                  onClick={() => navigate("/available-doctors")}
                >
                  👨‍⚕️ Available Doctors
                </button>


                <button
                  className="patient-action-button secondary"
                  onClick={() => navigate("/my-appointments")}
                >
                  📋 My Appointments
                </button>


                <button
                  className="patient-action-button secondary"
                  onClick={() => navigate("/lab-reports")}
                >
                  🧪 View Lab Reports
                </button>

                <button
                  className="patient-action-button secondary"
                  onClick={() => navigate("/my-bills")}
                >
                  🧾 My Bills
                </button>

              </div>

            </div>

          </>
        ) : (

          <div className="patient-loading">
            <div className="patient-spinner"></div>
            <p>Loading patient information...</p>
          </div>

        )}

      </div>

    </div>
  );
}

export default PatientDashboard;