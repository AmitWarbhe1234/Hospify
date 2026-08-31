import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../services/api";
import { Lock, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

function ActivateAccount() {
  const [searchParams] = useSearchParams();

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
      await API.post("/patients/activate/", {
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
    <div className="hospify-login-page">

      {/* BACKGROUND DECORATIONS */}
      <div className="login-bg-shape login-bg-one"></div>
      <div className="login-bg-shape login-bg-two"></div>
      <div className="login-bg-shape login-bg-three"></div>

      <div
        className="hospify-login-wrapper"
        style={{ gridTemplateColumns: "1fr", maxWidth: "560px" }}
      >
        <section className="hospify-right-panel" style={{ width: "100%" }}>
          <div className="login-form-container">

            {!success ? (
              <>
                <div className="login-header">
                  <div className="login-lock-box">
                    <Lock size={27} strokeWidth={2} />
                  </div>

                  <h2>Set Your Password</h2>

                  <p>Create a password to activate your account.</p>
                </div>

                {error && (
                  <div className="hospify-login-error">
                    <AlertCircle size={17} />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  <div className="hospify-field">
                    <label htmlFor="password">New Password</label>

                    <div className="hospify-input">
                      <Lock size={20} strokeWidth={1.8} />
                      <input
                        id="password"
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                      />
                    </div>
                  </div>

                  <div className="hospify-field">
                    <label htmlFor="confirmPassword">Confirm Password</label>

                    <div className="hospify-input">
                      <Lock size={20} strokeWidth={1.8} />
                      <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="hospify-signin-button"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="hospify-spinner"></span>
                        <span>Activating...</span>
                      </>
                    ) : (
                      <>
                        <span>Set Password &amp; Activate</span>
                        <ArrowRight size={21} strokeWidth={2.6} />
                      </>
                    )}
                  </button>

                </form>

                <div className="hospify-security">
                  <ShieldCheck size={17} strokeWidth={1.8} />
                  <span>
                    Your information is protected with secure authentication.
                  </span>
                </div>
              </>
            ) : (
              <div className="login-header" style={{ textAlign: "center" }}>
                <div
                  className="login-lock-box"
                  style={{ margin: "0 auto 27px", color: "#15845a", background: "linear-gradient(145deg,#e2fbec,#d7f7e5)" }}
                >
                  <CheckCircle2 size={27} strokeWidth={2} />
                </div>

                <h2>Account Activated!</h2>

                <p>Your password has been set. You can now log in.</p>

                <Link
                  to="/login"
                  className="hospify-signin-button"
                  style={{
                    marginTop: "28px",
                    textDecoration: "none",
                  }}
                >
                  <span>Go to Login</span>
                  <ArrowRight size={21} strokeWidth={2.6} />
                </Link>
              </div>
            )}

          </div>
        </section>
      </div>
    </div>
  );
}

export default ActivateAccount;
