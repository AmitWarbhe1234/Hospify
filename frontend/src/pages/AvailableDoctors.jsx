import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function AvailableDoctors() {
  
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchDoctors = async () => {

      try {

        const response = await API.get(
          "/appointments/doctors/"
        );

        console.log("Doctors:", response.data);

        setDoctors(response.data);

      } catch (error) {

        console.log(
          "Doctors Error:",
          error.response?.data
        );

        setError("Unable to load doctors.");

      } finally {

        setLoading(false);

      }
    };

    fetchDoctors();

  }, []);

  return (

    <div className="available-doctors-page">

      {/* Header */}

      <div className="available-doctors-header">

        <div>

          <div className="available-doctors-badge">
            MEDICAL TEAM
          </div>

          <h1>
            Available Doctors
          </h1>

          <p>
            Find the right doctor and book an appointment
            with ease.
          </p>

        </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "15px" }}>

          <button
            type="button"
            className="back-to-dashboard-button"
            onClick={() => navigate("/patient-dashboard")}
            style={{ whiteSpace: "nowrap" }}
          >
            <span>←</span>
            Back to Dashboard
          </button>

          <div className="available-doctors-icon">
            👨‍⚕️
          </div>

        </div>

      </div>


      {/* Content */}

      <div className="available-doctors-content">

        {loading && (

          <div className="doctors-message">
            <div className="doctors-loading-icon">
              ⏳
            </div>

            <h3>Loading doctors...</h3>

            <p>
              Please wait while we fetch available doctors.
            </p>
          </div>

        )}


        {error && (

          <div className="doctors-message doctors-error">

            <div className="doctors-loading-icon">
              ⚠️
            </div>

            <h3>Something went wrong</h3>

            <p>{error}</p>

          </div>

        )}


        {!loading &&
          !error &&
          doctors.length === 0 && (

            <div className="doctors-message">

              <div className="doctors-loading-icon">
                🩺
              </div>

              <h3>No doctors available</h3>

              <p>
                There are currently no doctors available.
              </p>

            </div>

          )}


        {!loading &&
          !error &&
          doctors.length > 0 && (

            <>

              <div className="doctors-section-header">

                <div>

                  <h2>
                    Our Doctors
                  </h2>

                  <p>
                    Choose from our available healthcare
                    professionals.
                  </p>

                </div>

                <div className="doctor-count">
                  {doctors.length} Doctors
                </div>

              </div>


              <div className="doctors-grid">

                {doctors.map((doc) => (

                  <div
                    className="doctor-card"
                    key={doc.id}
                  >

                    <div className="doctor-card-top">

                      <div className="doctor-avatar">
                        👨‍⚕️
                      </div>

                      <div className="doctor-status">
                        Available
                      </div>

                    </div>


                    <div className="doctor-card-body">

                      <h3>
                        Dr. {doc.first_name
                          ? `${doc.first_name} ${doc.last_name || ""}`
                          : doc.email}
                      </h3>

                      <p className="doctor-speciality">
                        {doc.department
                          ? doc.department.replace("_", " ")
                          : "Healthcare Professional"}
                      </p>


                      <div className="doctor-info">

                        <span className="doctor-info-icon">
                          ✉️
                        </span>

                        <span>
                          {doc.email}
                        </span>

                      </div>

                    </div>


                    <div className="doctor-card-footer">

                      <button
                        onClick={() =>
                          window.location.href =
                            "/book-appointment"
                        }
                        className="book-doctor-button"
                      >
                        Book Appointment
                        <span>→</span>
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </>

          )}

      </div>

    </div>

  );
}

export default AvailableDoctors;