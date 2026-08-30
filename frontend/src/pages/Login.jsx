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
        {/* LEFT PERSON HEAD (teal) */}
        <circle cx="70" cy="26" r="14" fill="#22C1D6" />

        {/* RIGHT PERSON HEAD (green) */}
        <circle cx="150" cy="26" r="14" fill="#8DD139" />

        {/* LEFT HEART LOBE (teal, filled) */}
        <path
          d="M110 138
             C78 112, 54 88, 54 60
             C54 38, 74 26, 95 33
             C104 36, 110 46, 110 60
             Z"
          fill="#22C1D6"
        />

        {/* RIGHT HEART LOBE (green, filled) */}
        <path
          d="M110 138
             C142 112, 166 88, 166 60
             C166 38, 146 26, 125 33
             C116 36, 110 46, 110 60
             Z"
          fill="#8DD139"
        />

        {/* WHITE CIRCLE BEHIND CROSS */}
        <circle cx="110" cy="70" r="28" fill="#FFFFFF" />

        {/* HEARTBEAT PULSE LINE */}
        <polyline
          points="86,70 97,70 102,57 109,84 115,64 121,70 134,70"
          fill="none"
          stroke="#22C1D6"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* MEDICAL CROSS */}
        <rect x="103" y="57" width="14" height="28" rx="2" fill="#22C1D6" />
        <rect x="96" y="64" width="28" height="14" rx="2" fill="#22C1D6" />
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
