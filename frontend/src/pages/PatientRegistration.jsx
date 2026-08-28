import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function PatientRegistration() {
   
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [mobile, setMobile] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [patientId, setPatientId] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");
    setPatientId("");

    try {

      const response = await API.post(
        "/patients/register/",
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          date_of_birth: dateOfBirth,
          gender: gender,
          blood_group: bloodGroup,
          mobile: mobile,
          emergency_contact: emergencyContact,
          address: address,
        }
      );

      console.log(
        "Patient Registration:",
        response.data
      );

      setPatientId(
        response.data.patient_id
      );

      setSuccess(
        "Patient registered successfully."
      );

      // Clear form after successful registration
      setFirstName("");
      setLastName("");
      setEmail("");
      setDateOfBirth("");
      setGender("");
      setBloodGroup("");
      setMobile("");
      setEmergencyContact("");
      setAddress("");

    } catch (error) {

  console.log(
    "Registration Error:",
    error.response?.data
  );

  const data = error.response?.data;

  let errorMessage = "Patient registration failed. Please try again.";

  if (data) {

    if (data.detail) {
      errorMessage = data.detail;
    } else if (data.message) {
      errorMessage = data.message;
    } else if (typeof data === "object") {
      // DRF validation errors come as { field_name: ["error msg", ...] }
      const firstField = Object.keys(data)[0];

      if (firstField) {
        const fieldError = data[firstField];

        errorMessage = Array.isArray(fieldError)
          ? fieldError[0]
          : String(fieldError);
      }
    }
  }

  setError(errorMessage);

} finally {
      setLoading(false);

    }
  };


  return (

    <div className="registration-page">

      {/* Background decorations */}

      <div className="registration-circle registration-circle-one"></div>

      <div className="registration-circle registration-circle-two"></div>

      <div className="registration-circle registration-circle-three"></div>


      <div className="registration-wrapper">

        {/* HEADER */}

        <div className="registration-header">

          <div className="registration-logo">
            🏥
          </div>

          <div>

            <div className="registration-brand">
              Hospify
            </div>

            <p>
              Healthcare Management System
            </p>

          </div>

        </div>

        <button
            type="button"
            className="back-to-dashboard-button"
            onClick={() => navigate("/receptionist-dashboard")}
          >
            <span>←</span>
            Back to Dashboard
        </button>
        {/* TITLE */}

        <div className="registration-title">

          <div>

            <h1>
              Patient Registration
            </h1>

            <p>
              Enter the patient's information to create
              a new healthcare record.
            </p>

          </div>

          <div className="registration-badge">
            👤 New Patient
          </div>

        </div>


        {/* SUCCESS MESSAGE */}

        {success && (

          <div className="registration-success">

            <div className="success-icon">
              ✓
            </div>

            <div>

              <strong>
                {success}
              </strong>

              <p>
                Patient ID:{" "}
                <strong>{patientId}</strong>
              </p>

              <small>
                Patient account has been created successfully.
              </small>

            </div>

          </div>

        )}


        {/* ERROR MESSAGE */}

        {error && (

          <div className="registration-error">

            <span>
              ⚠️
            </span>

            <div>
              {error}
            </div>

          </div>

        )}


        {/* FORM CARD */}

        <div className="registration-card">

          <form onSubmit={handleSubmit}>

            {/* PERSONAL INFORMATION */}

            <div className="form-section">

              <div className="form-section-heading">

                <div className="section-icon">
                  👤
                </div>

                <div>

                  <h3>
                    Personal Information
                  </h3>

                  <p>
                    Basic information about the patient
                  </p>

                </div>

              </div>


              <div className="registration-grid">

                {/* First Name */}

                <div className="registration-field">

                  <label>
                    First Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) =>
                      setFirstName(e.target.value)
                    }
                    required
                  />

                </div>


                {/* Last Name */}

                <div className="registration-field">

                  <label>
                    Last Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) =>
                      setLastName(e.target.value)
                    }
                    required
                  />

                </div>


                {/* Date of Birth */}

                <div className="registration-field">

                  <label>
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) =>
                      setDateOfBirth(e.target.value)
                    }
                    required
                  />

                </div>


                {/* Gender */}

                <div className="registration-field">

                  <label>
                    Gender
                  </label>

                  <select
                    value={gender}
                    onChange={(e) =>
                      setGender(e.target.value)
                    }
                    required
                  >

                    <option value="">
                      Select Gender
                    </option>

                    <option value="MALE">
                      Male
                    </option>

                    <option value="FEMALE">
                      Female
                    </option>

                    <option value="OTHER">
                      Other
                    </option>

                  </select>

                </div>


                {/* Blood Group */}

                <div className="registration-field">

                  <label>
                    Blood Group
                  </label>

                  <select
                    value={bloodGroup}
                    onChange={(e) =>
                      setBloodGroup(e.target.value)
                    }
                  >

                    <option value="">
                      Select Blood Group
                    </option>

                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>

                  </select>

                </div>


                {/* Mobile */}

                <div className="registration-field">

                  <label>
                    Mobile Number
                  </label>

                  <input
                    type="text"
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChange={(e) =>
                      setMobile(e.target.value)
                    }
                    required
                  />

                </div>

              </div>

            </div>


            {/* ACCOUNT INFORMATION */}

            <div className="form-section">

              <div className="form-section-heading">

                <div className="section-icon">
                  🔐
                </div>

                <div>

                  <h3>
                    Account Information
                  </h3>

                  <p>
                    Login credentials for the patient
                  </p>

                </div>

              </div>


              <div className="registration-grid">

                <div className="registration-field">

                  <label>
                    Email Address
                  </label>

                  <input
                    type="email"
                    placeholder="patient@example.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />

                </div>


              </div>

            </div>


            {/* CONTACT INFORMATION */}

            <div className="form-section">

              <div className="form-section-heading">

                <div className="section-icon">
                  🚨
                </div>

                <div>

                  <h3>
                    Contact Information
                  </h3>

                  <p>
                    Emergency and address details
                  </p>

                </div>

              </div>


              <div className="registration-grid">

                <div className="registration-field">

                  <label>
                    Emergency Contact
                  </label>

                  <input
                    type="text"
                    placeholder="Emergency contact number"
                    value={emergencyContact}
                    onChange={(e) =>
                      setEmergencyContact(e.target.value)
                    }
                  />

                </div>


                <div className="registration-field full-width">

                  <label>
                    Address
                  </label>

                  <textarea
                    rows="4"
                    placeholder="Enter patient's complete address"
                    value={address}
                    onChange={(e) =>
                      setAddress(e.target.value)
                    }
                  />

                </div>

              </div>

            </div>


            {/* BUTTON */}

            <div className="registration-footer">

              <div className="registration-note">

                🔒 Patient information is stored securely.

              </div>

              <button
                type="submit"
                className="registration-button"
                disabled={loading}
              >

                {loading ? (

                  <>
                    <span
                      className="registration-spinner"
                    ></span>

                    Registering...

                  </>

                ) : (

                  <>
                    Register Patient
                    <span className="button-arrow">
                      →
                    </span>
                  </>

                )}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default PatientRegistration;