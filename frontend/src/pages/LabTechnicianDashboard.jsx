import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function LabTechnicianDashboard() {

  const navigate = useNavigate();

  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [results, setResults] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const handleLogout = () => {

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    navigate("/");
  };


  const fetchLabTests = async () => {

    try {

      const response = await API.get(
        "/lab/tests/"
      );

      console.log(
        "Lab Tests:",
        response.data
      );

      setLabTests(response.data);

    } catch (error) {

      console.log(
        "Lab Tests Error:",
        error.response?.data
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    fetchLabTests();

  }, []);


  const handleResultChange = (testId, value) => {

    setResults({
      ...results,
      [testId]: value
    });

  };


  const handleCompleteTest = async (testId) => {

    const result = results[testId];

    if (!result || !result.trim()) {

      setMessage(
        "Please enter the test result."
      );

      setMessageType("error");

      return;
    }

    try {

      const response = await API.post(
        `/lab/complete/${testId}/`,
        {
          result: result
        }
      );

      console.log(
        "Complete Lab Test:",
        response.data
      );

      setMessage(
        "Lab test completed successfully."
      );

      setMessageType("success");

      setResults({
        ...results,
        [testId]: ""
      });

      fetchLabTests();

    } catch (error) {

      console.log(
        "Complete Lab Test Error:",
        error.response?.data
      );

      setMessage(
        error.response?.data?.detail ||
        "Failed to complete lab test."
      );

      setMessageType("error");

    }

  };


  return (

    <div className="lab-dashboard">

      {/* Background Decorations */}

      <div className="lab-bg-circle lab-bg-one"></div>
      <div className="lab-bg-circle lab-bg-two"></div>
      <div className="lab-bg-circle lab-bg-three"></div>


      {/* HEADER */}

      <header className="lab-header">

        <div className="lab-brand">

          <div className="lab-logo">
            🧪
          </div>

          <div>
            <h2>Hospify</h2>

            <p>
              Healthcare Management System
            </p>
          </div>

        </div>


        <div className="lab-header-right">

          <div className="lab-user">

            <div className="lab-user-icon">
              🔬
            </div>

            <div>
              <strong>
                Lab Technician
              </strong>

              <span>
                Laboratory Department
              </span>
            </div>

          </div>


          <button
            className="lab-logout"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </header>


      {/* MAIN CONTENT */}

      <main className="lab-main">


        {/* WELCOME */}

        <section className="lab-welcome">

          <div>

            <div className="lab-welcome-label">
              LABORATORY PORTAL
            </div>

            <h1>
              Lab Technician Dashboard
            </h1>

            <p>
              Review pending laboratory tests,
              enter results and complete test reports.
            </p>

          </div>


          <div className="lab-stat-card">

            <div className="lab-stat-icon">
              🧪
            </div>

            <div>

              <span>
                Pending Tests
              </span>

              <strong>
                {labTests.length}
              </strong>

            </div>

          </div>

        </section>


        {/* MESSAGE */}

        {message && (

          <div
            className={`lab-message ${
              messageType === "success"
                ? "lab-message-success"
                : messageType === "error"
                ? "lab-message-error"
                : "lab-message-info"
            }`}
          >

            <span>

              {messageType === "success"
                ? "✓"
                : messageType === "error"
                ? "!"
                : "i"}

            </span>

            {message}

          </div>

        )}


        {/* TEST SECTION */}

        <section className="lab-card">

          <div className="lab-card-header">

            <div>

              <h2>
                Pending Laboratory Tests
              </h2>

              <p>
                Tests requested by doctors that
                require laboratory processing.
              </p>

            </div>


            <button
              className="lab-refresh"
              onClick={() => {
                setLoading(true);
                fetchLabTests();
              }}
            >
              ↻ Refresh
            </button>

          </div>


          {/* LOADING */}

          {loading ? (

            <div className="lab-empty">

              <div className="lab-loading-spinner"></div>

              <h3>
                Loading laboratory tests...
              </h3>

              <p>
                Please wait while we fetch pending tests.
              </p>

            </div>


          ) : labTests.length === 0 ? (

            /* EMPTY */

            <div className="lab-empty">

              <div className="lab-empty-icon">
                ✓
              </div>

              <h3>
                No Pending Tests
              </h3>

              <p>
                There are currently no laboratory
                tests waiting for processing.
              </p>

            </div>


          ) : (

            /* TEST CARDS */

            <div className="lab-test-list">

              {labTests.map((test) => (

                <div
                  className="lab-test-card"
                  key={test.id}
                >

                  {/* CARD TOP */}

                  <div className="lab-test-top">

                    <div className="lab-test-title">

                      <div className="test-icon">
                        🧪
                      </div>

                      <div>

                        <h3>
                          {test.test_name}
                        </h3>

                        <span>
                          Laboratory Test
                        </span>

                      </div>

                    </div>


                    <span className="lab-status">
                      {test.status}
                    </span>

                  </div>


                  {/* DETAILS */}

                  <div className="lab-details">

                    <div className="lab-detail">

                      <span>
                        Patient ID
                      </span>

                      <strong>
                        {test.patient_id}
                      </strong>

                    </div>


                    <div className="lab-detail">

                      <span>
                        Doctor
                      </span>

                      <strong>
                        {test.doctor}
                      </strong>

                    </div>


                    <div className="lab-detail">

                      <span>
                        Test Date
                      </span>

                      <strong>
                        {test.test_date}
                      </strong>

                    </div>

                  </div>


                  {/* RESULT */}

                  <div className="lab-result-section">

                    <label>
                      Test Result
                    </label>

                    <textarea
                      placeholder="Enter the laboratory test result..."
                      value={results[test.id] || ""}
                      onChange={(e) =>
                        handleResultChange(
                          test.id,
                          e.target.value
                        )
                      }
                    />

                  </div>


                  {/* ACTION */}

                  <div className="lab-test-footer">

                    <span>
                      Please verify the result before completing the test.
                    </span>

                    <button
                      className="complete-test-button"
                      onClick={() =>
                        handleCompleteTest(test.id)
                      }
                    >
                      <span>✓</span>
                      Complete Test
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default LabTechnicianDashboard;