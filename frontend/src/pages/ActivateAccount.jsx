import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function ActivateAccount() {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (!email || !token) {
      setError("Invalid activation link.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {

      const response = await API.post("/patients/activate/", {
        email: email,
        activation_token: token,
        password: password,
      });

      setSuccess(true);

    } catch (error) {

      const errorMessage =
        error.response?.data?.message ||
        "Activation failed. The link may be invalid or expired.";

      setError(errorMessage);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper" style={{ justifyContent: "center" }}>
        <div className="login-card">

          {!success ? (

            <>
              <div className="login-card-header">
                <div className="login-card-icon">
                  🔐
                </div>

                <h2>
                  Set Your Password
                </h2>

                <p>
                  Create a password to activate your account.
                </p>
              </div>

              {error && (
                <div className="login-error">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>

                <div className="login-field">
                  <label>New Password</label>
                  <div className="login-input-wrapper">
                    <span className="login-input-icon">🔒</span>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="login-field">
                  <label>Confirm Password</label>
                  <div className="login-input-wrapper">
                    <span className="login-input-icon">🔒</span>
                    <input
                      type="password"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? "Activating..." : "Set Password & Activate"}
                </button>

              </form>
            </>

          ) : (

            <div className="login-card-header">
              <div className="login-card-icon">✅</div>
              <h2>Account Activated!</h2>
              <p>Your password has been set. You can now log in.</p>

              <Link
                to="/login"
                className="login-button"
                style={{ textAlign: "center", display: "block", marginTop: "20px" }}
              >
                Go to Login →
              </Link>
            </div>

          )}

        </div>
      </div>
    </div>
  );
}

export default ActivateAccount;