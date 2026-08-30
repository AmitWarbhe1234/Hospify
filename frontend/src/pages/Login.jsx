import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
  HeartPulse,
  Check,
  ArrowRight,
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
        email,
        password,
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

      {/* Background decorations */}
      <div className="login-circle login-circle-one"></div>
      <div className="login-circle login-circle-two"></div>
      <div className="login-circle login-circle-three"></div>

      <div className="login-wrapper">

        {/* =====================================
            LEFT BRANDING SECTION
        ====================================== */}

        <div className="login-intro">

          <div className="login-intro-content">

            {/* CSS / ICON BASED LOGO - NO IMAGE */}
            <div className="hospify-brand-logo">

              <div className="hospify-logo-mark">

                <div className="logo-person logo-person-left"></div>

                <div className="logo-person logo-person-right"></div>

                <div className="logo-heart">
                  <HeartPulse
                    size={62}
                    strokeWidth={2.4}
                  />
                </div>

              </div>

              <div className="hospify-logo-text">
                Hospify
              </div>

              <div className="hospify-logo-tagline">
                Your Health, Our Priority
              </div>

            </div>


            {/* Main heading */}
            <h1>
              Your Health,
              <br />
              <span>Our Priority.</span>
            </h1>


            {/* Description */}
            <p>
              A smarter healthcare experience that
              connects patients, doctors and healthcare
              professionals in one place.
            </p>


            {/* Features */}
            <div className="login-features">

              <div className="login-feature">
                <div className="feature-check">
                  <Check size={16} strokeWidth={3} />
                </div>

                <span>
                  Secure & reliable healthcare
                </span>
              </div>

              <div className="login-feature">
                <div className="feature-check">
                  <Check size={16} strokeWidth={3} />
                </div>

                <span>
                  Easy appointment management
                </span>
              </div>

              <div className="login-feature">
                <div className="feature-check">
                  <Check size={16} strokeWidth={3} />
                </div>

                <span>
                  Access your medical reports
                </span>
              </div>

            </div>

          </div>

        </div>


        {/* =====================================
            RIGHT LOGIN SECTION
        ====================================== */}

        <div className="login-card">

          <div className="login-card-content">

            {/* Login header */}
            <div className="login-card-header">

              <div className="login-card-icon">
                <Lock
                  size={24}
                  strokeWidth={2}
                />
              </div>

              <h2>
                Welcome Back
              </h2>

              <p>
                Sign in to your Hospify account
              </p>

            </div>


            {/* Error message */}
            {error && (
              <div className="login-error">

                <AlertCircle size={17} />

                <span>
                  {error}
                </span>

              </div>
            )}


            {/* Login form */}
            <form onSubmit={handleLogin}>

              {/* Email */}
              <div className="login-field">

                <label htmlFor="email">
                  Email Address
                </label>

                <div className="login-input-wrapper">

                  <Mail
                    className="login-input-icon"
                    size={18}
                  />

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    autoComplete="email"
                    required
                  />

                </div>

              </div>


              {/* Password */}
              <div className="login-field">

                <label htmlFor="password">
                  Password
                </label>

                <div className="login-input-wrapper">

                  <Lock
                    className="login-input-icon"
                    size={18}
                  />

                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    autoComplete="current-password"
                    required
                  />

                </div>

              </div>


              {/* Sign in */}
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
                    <span>Sign In</span>

                    <ArrowRight
                      size={20}
                      strokeWidth={2.5}
                    />
                  </>
                )}

              </button>

            </form>


            {/* Security message */}
            <div className="login-security">

              <ShieldCheck
                size={16}
                strokeWidth={2}
              />

              <span>
                Your information is protected with
                secure authentication.
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;
