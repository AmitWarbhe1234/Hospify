import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {

  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Agar allowedRoles specify nahi kiya, toh sirf login-check kaafi hai
  if (!allowedRoles) {
    return children;
  }

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;