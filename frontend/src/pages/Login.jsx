import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
  Check,
  ArrowRight,
} from "lucide-react";


function HospifyLogo() {
  return (
    <div className="hospify-brand">
      <svg
        className="hospify-logo-svg"
        viewBox="0 0 220 160"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Hospify Logo"
        role="img"
      >
        <defs>
          <linearGradient
            id="personBlue"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#19D3E6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          <linearGradient
            id="personGreen"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#A8E63A" />
            <stop offset="100%" stopColor="#84CC16" />
          </linearGradient>

          <linearGradient
            id="heartGradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#17D5E7" />
            <stop offset="50%" stopColor="#2CB9F4" />
            <stop offset="100%" stopColor="#9BE52D" />
          </linearGradient>
        </defs>

        {/* LEFT PERSON HEAD */}
        <circle
          cx="63"
          cy="27"
          r="16"
          fill="url(#personBlue)"
        />

        {/* LEFT PERSON BODY */}
        <path
          d="M40 88
             C39 61 48 45 64 45
             C80 45 91 59 91 83"
          fill="none"
          stroke="url(#personBlue)"
          strokeWidth="15"
          strokeLinecap="round"
        />

        {/* RIGHT PERSON HEAD */}
        <circle
          cx="157"
          cy="27"
          r="16"
          fill="url(#personGreen)"
        />

        {/* RIGHT PERSON BODY */}
        <path
          d="M129 83
             C129 59 140 45 156 45
             C172 45 181 62 180 89"
          fill="none"
          stroke="url(#personGreen)"
          strokeWidth="15"
          strokeLinecap="round"
        />

        {/* HEART */}
        <path
          d="M110 119
             C104 112 74 91 74 67
             C74 52 84 42 97 42
             C105 42 111 46 110 57
             C112 46 118 42 127 42
             C140 42 148 52 148 67
             C148 91 117 113 110 119Z"
          fill="url(#heartGradient)"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinejoin="round"
        />

        {/* MEDICAL CROSS */}
        <rect
          x="100"
          y="58"
          width="20"
          height="47"
          rx="2"
          fill="#FFFFFF"
        />

        <rect
          x="86"
          y="72"
          width="48"
          height="20"
          rx="2"
          fill="#FFFFFF"
        />

        {/* ECG */}
        <path
          d="M86 82
             H97
             L102 70
             L108 94
             L115 61
             L121 82
             H136"
          fill="none"
          stroke="#3157E8"
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
  );
}

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
    <div className="hospify-login-page">

      {/* BACKGROUND DECORATIONS */}
      <div className="login-bg-shape login-bg-one"></div>
      <div className="login-bg-shape login-bg-two"></div>
      <div className="login-bg-shape login-bg-three"></div>

      {/* MAIN CARD */}
      <div className="hospify-login-wrapper">

        {/* ======================================
            LEFT BRANDING PANEL
        ======================================= */}
        <section className="hospify-left-panel">

          <div className="left-panel-content">

            {/* LOGO */}
            <HospifyLogo />

            {/* MAIN HEADING */}
            <h1>
              Your Health,
              <br />
              <span>Our Priority.</span>
            </h1>

            {/* DESCRIPTION */}
            <p className="left-description">
              A smarter healthcare experience that connects
              patients, doctors and healthcare professionals
              in one place.
            </p>

            {/* FEATURES */}
            <div className="hospify-features">

              <div className="hospify-feature">
                <div className="feature-icon">
                  <Check size={17} strokeWidth={3} />
                </div>

                <span>
                  Secure & reliable healthcare
                </span>
              </div>

              <div className="hospify-feature">
                <div className="feature-icon">
                  <Check size={17} strokeWidth={3} />
                </div>

                <span>
                  Easy appointment management
                </span>
              </div>

              <div className="hospify-feature">
                <div className="feature-icon">
                  <Check size={17} strokeWidth={3} />
                </div>

                <span>
                  Access your medical reports
                </span>
              </div>

            </div>

          </div>
        </section>

        {/* ======================================
            RIGHT LOGIN PANEL
        ======================================= */}
        <section className="hospify-right-panel">

          <div className="login-form-container">

            {/* HEADER */}
            <div className="login-header">

              <div className="login-lock-box">
                <Lock
                  size={27}
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

            {/* ERROR */}
            {error && (
              <div className="hospify-login-error">
                <AlertCircle size={17} />
                <span>{error}</span>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleLogin}>

              {/* EMAIL */}
              <div className="hospify-field">

                <label htmlFor="email">
                  Email Address
                </label>

                <div className="hospify-input">

                  <Mail
                    size={20}
                    strokeWidth={1.8}
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

              {/* PASSWORD */}
              <div className="hospify-field">

                <label htmlFor="password">
                  Password
                </label>

                <div className="hospify-input">

                  <Lock
                    size={20}
                    strokeWidth={1.8}
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

              {/* SIGN IN BUTTON */}
              <button
                type="submit"
                className="hospify-signin-button"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="hospify-spinner"></span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>

                    <ArrowRight
                      size={21}
                      strokeWidth={2.6}
                    />
                  </>
                )}

              </button>

            </form>

            {/* SECURITY MESSAGE */}
            <div className="hospify-security">

              <ShieldCheck
                size={17}
                strokeWidth={1.8}
              />

              <span>
                Your information is protected with secure authentication.
              </span>

            </div>

          </div>

        </section>

      </div>
    </div>
  );
}

export default Login;