import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login/", {
        email: email,
        password: password,
      });

      console.log("Login Response:", response.data);

      // Store JWT tokens
      localStorage.setItem(
        "access_token",
        response.data.access
      );

      localStorage.setItem(
        "refresh_token",
        response.data.refresh
      );

      // Store user information
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // Role based navigation
      const role = response.data.user.role;

      if (role === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (role === "DOCTOR") {
        navigate("/doctor-dashboard");
      } else if (role === "RECEPTIONIST") {
        navigate("/receptionist-dashboard");
      } else if (role === "PATIENT") {
        navigate("/patient-dashboard");
      } else if (role === "LAB_TECHNICIAN") {
        navigate("/lab-technician-dashboard");
      }
    } catch (error) {
      console.log(
        "Login Error:",
        error.response?.data
      );

      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Invalid email or password. Please try again.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* =========================================
          BACKGROUND DECORATIONS
      ========================================= */}

      <div className="login-circle login-circle-one"></div>
      <div className="login-circle login-circle-two"></div>
      <div className="login-circle login-circle-three"></div>


      <div className="login-wrapper">

        {/* =========================================
            LEFT SIDE - HOSPIFY BRANDING
        ========================================= */}

        <div className="login-intro">

          {/* EXACT HOSPIFY LOGO */}
          <div className="hospify-brand-logo">

            <img
              src="/hospify-logo-exact.png"
              alt="Hospify"
              className="hospify-logo-exact"
            />

          </div>


          {/* =====================================
              MAIN HEADING
          ===================================== */}

          <h1>
            Your Health,
            <br />
            <span>Our Priority.</span>
          </h1>


          {/* =====================================
              DESCRIPTION
          ===================================== */}

          <p>
            A smarter healthcare experience that
            connects patients, doctors and healthcare
            professionals in one place.
          </p>


          {/* =====================================
              FEATURES
          ===================================== */}

          <div className="login-features">

            <div className="login-feature">
              <span>✓</span>
              Secure & reliable healthcare
            </div>

            <div className="login-feature">
              <span>✓</span>
              Easy appointment management
            </div>

            <div className="login-feature">
              <span>✓</span>
              Access your medical reports
            </div>

          </div>

        </div>


        {/* =========================================
            RIGHT SIDE - LOGIN CARD
        ========================================= */}

        <div className="login-card">

          {/* =====================================
              LOGIN HEADER
          ===================================== */}

          <div className="login-card-header">

            <div className="login-card-icon">
              <Lock size={22} />
            </div>

            <h2>
              Welcome Back
            </h2>

            <p>
              Sign in to your Hospify account
            </p>

          </div>


          {/* =====================================
              ERROR MESSAGE
          ===================================== */}

          {error && (
            <div className="login-error">

              <AlertCircle size={16} />

              <span>
                {error}
              </span>

            </div>
          )}


          {/* =====================================
              LOGIN FORM
          ===================================== */}

          <form onSubmit={handleLogin}>

            {/* ===================================
                EMAIL FIELD
            =================================== */}

            <div className="login-field">

              <label>
                Email Address
              </label>

              <div className="login-input-wrapper">

                <span className="login-input-icon">
                  <Mail size={16} />
                </span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>


            {/* ===================================
                PASSWORD FIELD
            =================================== */}

            <div className="login-field">

              <label>
                Password
              </label>

              <div className="login-input-wrapper">

                <span className="login-input-icon">
                  <Lock size={16} />
                </span>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

              </div>

            </div>


            {/* ===================================
                SIGN IN BUTTON
            =================================== */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In

                  <span className="login-arrow">
                    →
                  </span>
                </>
              )}

            </button>

          </form>


          {/* =====================================
              SECURITY MESSAGE
          ===================================== */}

          <div className="login-security">

            <ShieldCheck
              size={14}
              style={{
                verticalAlign: "middle",
                marginRight: "5px",
              }}
            />

            Your information is protected with
            secure authentication.

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;