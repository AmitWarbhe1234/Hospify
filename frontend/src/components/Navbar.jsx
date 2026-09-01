import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (

    <nav className="navbar navbar-expand-lg bg-white shadow-sm border-bottom">

      <div className="container-fluid px-4">

        {/* Brand */}

        <Link
          to="/patient-dashboard"
          className="navbar-brand fw-bold text-primary fs-4"
        >
          🏥 Hospify
        </Link>


        {/* Navigation */}

        <div className="d-flex align-items-center gap-3">

          <Link
            to="/patient-dashboard"
            className="text-decoration-none text-dark fw-medium"
          >
            Dashboard
          </Link>


          <Link
            to="/available-doctors"
            className="text-decoration-none text-dark fw-medium"
          >
            Doctors
          </Link>


          <Link
            to="/book-appointment"
            className="text-decoration-none text-dark fw-medium"
          >
            Appointments
          </Link>


          {/* Logout */}

          <button
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm px-3"
          >
            Logout
          </button>

        </div>

      </div>

    </nav>

  );
}

export default Navbar;