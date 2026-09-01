import { useNavigate } from "react-router-dom";

function ReceptionistDashboard() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (

    <div className="receptionist-page">

      {/* Background Decorations */}

      <div className="receptionist-bg-circle receptionist-bg-one"></div>
      <div className="receptionist-bg-circle receptionist-bg-two"></div>
      <div className="receptionist-bg-circle receptionist-bg-three"></div>


      <div className="receptionist-container">

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


        {/* ================= HERO ================= */}

        <section className="receptionist-hero">

          <div>

            <span className="receptionist-label">
              RECEPTION DESK
            </span>

            <h1>
              Welcome Back 👋
            </h1>

            <p>
              Manage patients and healthcare operations
              from one convenient place.
            </p>

          </div>


          <div className="receptionist-hero-icon">
            👩‍⚕️
          </div>

        </section>


        {/* ================= QUICK STATS ================= */}

        <section className="receptionist-stats">

          <div className="receptionist-stat-card">

            <div className="receptionist-stat-icon blue">
              👥
            </div>

            <div>

              <span>
                Patient Management
              </span>

              <strong>
                Active
              </strong>

              <small>
                Registration available
              </small>

            </div>

          </div>


          <div className="receptionist-stat-card">

            <div className="receptionist-stat-icon purple">
              📋
            </div>

            <div>

              <span>
                Patient Registration
              </span>

              <strong>
                Ready
              </strong>

              <small>
                Register new patients
              </small>

            </div>

          </div>


          <div className="receptionist-stat-card">

            <div className="receptionist-stat-icon green">
              🏥
            </div>

            <div>

              <span>
                Reception Desk
              </span>

              <strong>
                Online
              </strong>

              <small>
                System operational
              </small>

            </div>

          </div>

        </section>


        {/* ================= MAIN CONTENT ================= */}

        <section className="receptionist-content">

          <div className="receptionist-card">

            <div className="receptionist-card-header">

              <div className="receptionist-section-icon">
                👤
              </div>

              <div>

                <h2>
                  Patient Management
                </h2>

                <p>
                  Register and manage patient information
                </p>

              </div>

            </div>


            <div className="receptionist-action-grid">

              {/* Registration */}

              <div className="receptionist-action-card">

                <div className="action-icon registration-icon">
                  ➕
                </div>

                <h3>
                  Register New Patient
                </h3>

                <p>
                  Create a new patient profile and
                  generate a unique Patient ID.
                </p>

                <button
                  className="receptionist-primary-button"
                  onClick={() =>
                    navigate("/patient-registration")
                  }
                >
                  Register Patient
                  <span>→</span>
                </button>

              </div>


              {/* Patient Search - UI only for now */}

              <div className="receptionist-action-card">

                <div className="action-icon search-icon">
                  🔎
                </div>

                <h3>
                  Find Patient
                </h3>

                <p>
                  Quickly access patient information
                  and manage their healthcare records.
                </p>

                <button
                  className="receptionist-secondary-button"
                  onClick={() => {
                    alert(
                      "Patient Search functionality will be added next."
                    );
                  }}
                >
                  Search Patient
                  <span>→</span>
                </button>

              </div>





                            {/* Generate Bill */}

              <div className="receptionist-action-card">

                <div className="action-icon registration-icon">
                  🧾
                </div>

                <h3>
                  Generate Bill
                </h3>

                <p>
                  Create a bill for registration,
                  consultation, and lab tests.
                </p>

                <button
                  className="receptionist-primary-button"
                  onClick={() =>
                    navigate("/generate-bill")
                  }
                >
                  Generate Bill
                  <span>→</span>
                </button>

              </div>


              
              {/* Appointment */}

              <div className="receptionist-action-card">

                <div className="action-icon appointment-icon">
                  📅
                </div>

                <h3>
                  Appointments
                </h3>

                <p>
                  Manage patient appointments and
                  coordinate with doctors.
                </p>

                <button
                  className="receptionist-secondary-button"
                  onClick={() => {
                    alert(
                      "Appointment management will be added next."
                    );
                  }}
                >
                  View Appointments
                  <span>→</span>
                </button>

              </div>

            </div>

          </div>

        </section>


        {/* ================= INFORMATION ================= */}

        <section className="receptionist-info">

          <div className="receptionist-info-icon">
            💡
          </div>

          <div>

            <strong>
              Receptionist Workspace
            </strong>

            <p>
              Use this dashboard to register patients
              and manage front-desk healthcare activities.
            </p>

          </div>

        </section>


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

export default ReceptionistDashboard;