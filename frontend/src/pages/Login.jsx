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

      localStorage.setItem(
        "access_token",
        response.data.access
      );

      localStorage.setItem(
        "refresh_token",
        response.data.refresh
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

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

      {/* Background decorations */}
      <div className="login-circle login-circle-one"></div>
      <div className="login-circle login-circle-two"></div>
      <div className="login-circle login-circle-three"></div>

      <div className="login-wrapper">

        {/* =========================================
            LEFT SIDE
        ========================================= */}

        <div className="login-intro">

          {/* Target-style Hospify Logo */}
          <div className="hospify-brand-logo">

            <svg
              className="hospify-logo-art"
              viewBox="0 0 160 115"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Hospify logo"
              role="img"
            >
              <defs>
                <linearGradient
                  id="hospifyCyan"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#22D3EE" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>

                <linearGradient
                  id="hospifyGreen"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#A3E635" />
                  <stop offset="100%" stopColor="#84CC16" />
                </linearGradient>

                <linearGradient
                  id="hospifyHeart"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#22D3EE" />
                  <stop offset="52%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#A3E635" />
                </linearGradient>
              </defs>

              {/* Left person */}
              <circle
                cx="43"
                cy="22"
                r="14"
                fill="url(#hospifyCyan)"
              />

              <path
                d="M25 72 C23 50 31 37 45 37 C58 37 67 48 67 66"
                fill="none"
                stroke="url(#hospifyCyan)"
                strokeWidth="12"
                strokeLinecap="round"
              />

              {/* Right person */}
              <circle
                cx="117"
                cy="22"
                r="14"
                fill="url(#hospifyGreen)"
              />

              <path
                d="M93 66 C93 48 102 37 115 37 C129 37 137 50 135 72"
                fill="none"
                stroke="url(#hospifyGreen)"
                strokeWidth="12"
                strokeLinecap="round"
              />

              {/* Central heart */}
              <path
                d="M80 91
                   C76 86 52 69 52 52
                   C52 41 60 34 70 34
                   C76 34 80 38 80 43
                   C80 38 84 34 90 34
                   C100 34 108 41 108 52
                   C108 69 84 86 80 91Z"
                fill="url(#hospifyHeart)"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* ECG line */}
              <path
                d="M57 58 H67
                   L72 48
                   L78 69
                   L84 40
                   L90 58
                   H103"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="hospify-logo-name">
              Hospify
            </div>

            <div className="hospify-logo-tagline">
              Your Health, Our Priority
            </div>

          </div>


          <h1>
            Your Health,
            <br />
            <span>Our Priority.</span>
          </h1>


          <p>
            A smarter healthcare experience that
            connects patients, doctors and healthcare
            professionals in one place.
          </p>


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
            LOGIN CARD
        ========================================= */}

        <div className="login-card">

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


          {error && (
            <div className="login-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}


          <form onSubmit={handleLogin}>

            {/* EMAIL */}
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


            {/* PASSWORD */}
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


            {/* LOGIN BUTTON */}
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
