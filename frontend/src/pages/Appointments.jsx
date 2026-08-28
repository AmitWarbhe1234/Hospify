import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Appointments() {

  const [doctors, setDoctors] = useState([]);

  useEffect(() => {

    const getDoctors = async () => {

      try {

        const response = await API.get("/appointments/doctors/");

        console.log("Doctors:", response.data);

        setDoctors(response.data);

      } catch (error) {

        console.log(
          "Doctor API Error:",
          error.response?.data
        );

      }

    };

    getDoctors();

  }, []);

  return (
    <div>

      <Navbar />

      <div className="container mt-4">

        <h2 className="mb-4">
          Available Doctors
        </h2>

        <div className="row">

          {doctors.length > 0 ? (

            doctors.map((doctor) => (

              <div
                className="col-md-4 mb-4"
                key={doctor.id}
              >

                <div className="card shadow-sm">

                  <div className="card-body">

                    <h5 className="card-title">
                      Dr. {doctor.first_name} {doctor.last_name}
                    </h5>

                    <p className="card-text">
                      Email: {doctor.email}
                    </p>

                    <button className="btn btn-primary">
                      Book Appointment
                    </button>

                  </div>

                </div>

              </div>

            ))

          ) : (

            <p>No doctors available.</p>

          )}

        </div>

      </div>

    </div>
  );
}

export default Appointments;