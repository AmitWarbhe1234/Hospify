import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";



function AdminDashboard() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [patientList, setPatientList] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [editTarget, setEditTarget] = useState(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [editError, setEditError] = useState("");

  const [department, setDepartment] = useState("");







  const handleDeleteClick = (staff) => {
    setDeleteTarget(staff);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/auth/staff/${deleteTarget.id}/`);

      setStaffList((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    } catch (err) {
      console.log("Delete Error:", err.response?.data);
      alert("Staff delete karne mein error aayi. Dobara try karein.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => setDeleteTarget(null);

  
    const handleEditClick = (staff) => {
  setEditTarget(staff);
  setEditFirstName(staff.first_name || "");
  setEditLastName(staff.last_name || "");
  setEditEmail(staff.email || "");
  setEditRole(staff.role || "");
  setEditDepartment(staff.department || "");
  setEditError("");
};

const cancelEdit = () => {
  setEditTarget(null);
  setEditError("");
};

const confirmEdit = async (e) => {
  e.preventDefault();
  if (!editTarget) return;

  try {
      const response = await API.patch(`/auth/staff/${editTarget.id}/`, {
      first_name: editFirstName,
      last_name: editLastName,
      email: editEmail,
      role: editRole,
      department: editRole === "DOCTOR" ? editDepartment : null,
    });

    setStaffList((prev) =>
      prev.map((s) => (s.id === editTarget.id ? response.data : s))
    );

    setEditTarget(null);
  } catch (err) {
    console.log("Edit Error:", err.response?.data);
    setEditError(
      err.response?.data?.detail || "Staff update karne mein error aayi."
    );
  }
};

  const handleLogout = () => {

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await API.get("/auth/profile/");

        console.log("Admin Profile:", response.data);

        if (response.data.role !== "ADMIN") {
          alert("Access denied. Admin only.");
          navigate("/patient-dashboard");
        }
      } catch (error) {
        console.log(
          "Admin Authentication Error:",
          error.response?.data
        );

        navigate("/login");
      }
    };

    checkAdmin();
  }, [navigate]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await API.get("/auth/staff/");

        console.log("Staff List:", response.data);

        setStaffList(response.data);
      } catch (error) {
        console.log(
          "Staff List Error:",
          error.response?.data
        );
      }
    };

    fetchStaff();
  }, []);




useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await API.get("/auth/patients/");

        console.log("Patient List:", response.data);

        setPatientList(response.data);
      } catch (error) {
        console.log(
          "Patient List Error:",
          error.response?.data
        );
      }
    };

    fetchPatients();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
        const response = await API.post(
        "/auth/staff/create/",
        {
          email: email,
          password: password,
          first_name: firstName,
          last_name: lastName,
          role: role,
          department: role === "DOCTOR" ? department : null,
        }
      );

      console.log("Staff Created:", response.data);

      setMessage("Staff member created successfully!");

      const staffResponse = await API.get("/auth/staff/");
      setStaffList(staffResponse.data);

      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setRole("");
      setDepartment("");


    } catch (error) {
      console.log(
        "Staff Creation Error:",
        error.response?.data
      );

      setError(
        error.response?.data?.detail ||
        "Failed to create staff."
      );
    }
  };

  const getRoleClass = (role) => {
    if (role === "DOCTOR") return "admin-role doctor";
    if (role === "RECEPTIONIST") return "admin-role receptionist";
    if (role === "LAB_TECHNICIAN") return "admin-role lab";

    return "admin-role";
  };

  const doctorCount = staffList.filter(
    (staff) => staff.role === "DOCTOR"
  ).length;

  const receptionistCount = staffList.filter(
    (staff) => staff.role === "RECEPTIONIST"
  ).length;

  const labCount = staffList.filter(
    (staff) => staff.role === "LAB_TECHNICIAN"
  ).length;

  const filteredStaffList = staffList.filter((staff) => {
    const fullName = `${staff.first_name} ${staff.last_name}`.toLowerCase();
    const email = staff.email.toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      fullName.includes(search) || email.includes(search);

    const matchesRole =
      selectedRole === "ALL" || staff.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="admin-page">

      {/* Decorative Background */}
      <div className="admin-bg-circle admin-bg-one"></div>
      <div className="admin-bg-circle admin-bg-two"></div>
      <div className="admin-bg-circle admin-bg-three"></div>


      {/* NAVBAR */}
      <nav className="admin-navbar">

        <div className="admin-brand">

          <div className="admin-brand-icon">
            🏥
          </div>

          <div>
            <h2>Hospify</h2>
            <span>Healthcare Management System</span>
          </div>

        </div>


        <div className="admin-nav-right">

          <div className="admin-profile">

            <div className="admin-avatar">
              👨‍💼
            </div>

            <div>
              <strong>Administrator</strong>
              <small>System Admin</small>
            </div>

          </div>

          <button
            className="admin-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* MAIN CONTENT */}
      <main className="admin-container">


        {/* HEADER */}
        <div className="admin-header">

          <div>

            <div className="admin-label">
              ADMIN PORTAL
            </div>

            <h1>
              Admin Dashboard 👋
            </h1>

            <p>
              Manage your healthcare staff and system operations
              from one place.
            </p>

          </div>

          <div className="admin-header-icon">
            📊
          </div>

        </div>


        {/* STAT CARDS */}
        <div className="admin-stats">


          <div className="admin-stat-card">

            <div className="admin-stat-icon blue">
              👨‍⚕️
            </div>

            <div>
              <span>Doctors</span>
              <strong>{doctorCount}</strong>
              <small>Active staff</small>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon purple">
              👩‍💼
            </div>

            <div>
              <span>Receptionists</span>
              <strong>{receptionistCount}</strong>
              <small>Active staff</small>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon green">
              🧪
            </div>

            <div>
              <span>Lab Technicians</span>
              <strong>{labCount}</strong>
              <small>Active staff</small>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon orange">
              🛏️
            </div>

            <div>
              <span>Total Patients</span>
              <strong>{patientList.length}</strong>
              <small>Registered patients</small>
            </div>

          </div>

        </div>


        {/* CREATE STAFF */}
        <section className="admin-card">

          <div className="admin-card-header">

            <div className="admin-section-icon">
              ➕
            </div>

            <div>
              <h2>Create Staff Member</h2>

              <p>
                Add a doctor, receptionist or lab technician
                to your healthcare team.
              </p>
            </div>

          </div>


          {message && (
            <div className="admin-success">
              <span>✓</span>
              {message}
            </div>
          )}


          {error && (
            <div className="admin-error">
              <span>⚠️</span>
              {error}
            </div>
          )}


          <form
            className="admin-form"
            onSubmit={handleSubmit}
          >

            <div className="admin-form-grid">


              <div className="admin-field">

                <label>Email Address</label>

                <div className="admin-input-wrapper">
                  <span>✉️</span>

                  <input
                    type="email"
                    placeholder="staff@hospify.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />
                </div>

              </div>


              <div className="admin-field">

                <label>Password</label>

                <div className="admin-input-wrapper">
                  <span>🔒</span>

                  <input
                    type="password"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />
                </div>

              </div>


              <div className="admin-field">

                <label>First Name</label>

                <div className="admin-input-wrapper">
                  <span>👤</span>

                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) =>
                      setFirstName(e.target.value)
                    }
                    required
                  />
                </div>

              </div>


              <div className="admin-field">

                <label>Last Name</label>

                <div className="admin-input-wrapper">
                  <span>👤</span>

                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) =>
                      setLastName(e.target.value)
                    }
                    required
                  />
                </div>

              </div>


                            <div className="admin-field admin-field-full">

                <label>Staff Role</label>

                <div className="admin-input-wrapper">
                  <span>💼</span>

                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      if (e.target.value !== "DOCTOR") {
                        setDepartment("");
                      }
                    }}
                    required
                  >

                    <option value="">
                      Select staff role
                    </option>

                    <option value="DOCTOR">
                      Doctor
                    </option>

                    <option value="RECEPTIONIST">
                      Receptionist
                    </option>

                    <option value="LAB_TECHNICIAN">
                      Lab Technician
                    </option>

                  </select>

                </div>

              </div>


              {role === "DOCTOR" && (

                <div className="admin-field admin-field-full">

                  <label>Department</label>

                  <div className="admin-input-wrapper">
                    <span>🏥</span>

                    <select
                      value={department}
                      onChange={(e) =>
                        setDepartment(e.target.value)
                      }
                      required
                    >

                      <option value="">
                        Select department
                      </option>

                      <option value="ORTHOPEDICS">🦴 Orthopedics</option>
                      <option value="NEUROLOGY">🧠 Neurology</option>
                      <option value="CARDIOLOGY">❤️ Cardiology</option>
                      <option value="OPHTHALMOLOGY">👁️ Ophthalmology</option>
                      <option value="GENERAL_MEDICINE">🩺 General Medicine</option>
                      <option value="PEDIATRICS">👶 Pediatrics</option>
                      <option value="PULMONOLOGY">🫁 Pulmonology</option>

                    </select>

                  </div>

                </div>

              )}

            </div>


            <button
              type="submit"
              className="admin-create-button"
            >
              <span>+</span>
              Create Staff Member
            </button>

          </form>

        </section>


        {/* STAFF LIST */}
        <section className="admin-card staff-card">

          <div className="admin-card-header">
 
            <div className="admin-section-icon staff">
              👥
            </div>

            <div>
              <h2>Staff Directory</h2>
            <div className="admin-search-filter">

            <div className="admin-input-wrapper">
              <span>🔍</span>

              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="admin-input-wrapper">
              <span>🧰</span>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="ALL">All Roles</option>
                <option value="DOCTOR">Doctor</option>
                <option value="RECEPTIONIST">Receptionist</option>
                <option value="LAB_TECHNICIAN">Lab Technician</option>
              </select>
            </div>
        </div>
          </div>
            </div>  


          {staffList.length === 0 ? (

            <div className="admin-empty">

              <div>👥</div>

              <h3>No staff members found</h3>

              <p>
                Create your first staff member using the form above.
              </p>

            </div>

          ) : (

            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>

                  <tr>
                    <th>ID</th>
                    <th>Staff Member</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th colSpan="2" style={{ textAlign: "center" }}>Action</th>
                  </tr>

                </thead>


                <tbody>

                  {filteredStaffList.map((staff) => (
                  <tr key={staff.id}>
                    <td><span className="staff-id">#{staff.id}</span></td>
                  
                      <td>

                        <div className="staff-name">

                          <div className="staff-avatar">
                            {(staff.first_name?.[0] || "S").toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {staff.first_name} {staff.last_name}
                            </strong>

                            <small>
                              Healthcare Staff
                            </small>
                          </div>

                        </div>

                      </td>


                      <td>
                        <span className="staff-email">
                          {staff.email}
                        </span>
                      </td>


                      <td>

                        <span className={getRoleClass(staff.role)}>

                          {staff.role === "DOCTOR" && "👨‍⚕️"}
                          {staff.role === "RECEPTIONIST" && "👩‍💼"}
                          {staff.role === "LAB_TECHNICIAN" && "🧪"}

                          {" "}

                          {staff.role === "LAB_TECHNICIAN"
                            ? "Lab Technician"
                            : staff.role}

                        </span>

                      </td>


                      <td>
                        {staff.role === "DOCTOR" && staff.department
                          ? staff.department.replace("_", " ")
                          : "—"}
                      </td>


                      <td>
                      <div className="staff-action-buttons">
                        <button
                          className="staff-edit-btn"
                          onClick={() => handleEditClick(staff)}
                        >
                          ✏️ Edit
                        </button>
  
                      </div>
                      </td>

                      <td>
                        <button
                          className="staff-delete-btn"
                          onClick={() => handleDeleteClick(staff)}
                        >
                          🗑️ Delete
                        </button>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>


        {/* DELETE CONFIRMATION MODAL */}
        {deleteTarget && (
          <div
            className="admin-modal-overlay"
            onClick={cancelDelete}
          >
            <div
              className="admin-modal-box"
              onClick={(e) => e.stopPropagation()}
            >

              {/* Delete Icon */}
              <div className="admin-modal-icon">
                🗑️
              </div>

              {/* Title */}
              <h2>Confirm Deletion</h2>

              {/* Message */}
              <p className="admin-modal-message">
                Are you sure you want to delete this staff member?
              </p>

              {/* Selected Staff */}
              <div className="admin-modal-staff">

                <div className="admin-modal-avatar">
                  {deleteTarget.first_name?.charAt(0)}
                </div>

                <div className="admin-modal-staff-info">

                  <strong>
                    {deleteTarget.first_name} {deleteTarget.last_name}
                  </strong>

                  <span>
                    {deleteTarget.email}
                  </span>

                </div>

              </div>

              {/* Warning */}
              <p className="admin-modal-warning">
                ⚠️ This action cannot be undone.
              </p>

              {/* Buttons */}
              <div className="admin-modal-actions">

                <button
                  onClick={cancelDelete}
                  className="admin-modal-cancel"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="admin-modal-confirm"
                >
                  🗑️ Yes, Delete
                </button>

              </div>

            </div>
          </div>
        )}

        
        {/* EDIT STAFF MODAL */}
        {editTarget && (
          <div className="admin-modal-overlay" onClick={cancelEdit}>
            <div
              className="admin-modal-box"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="admin-modal-icon">✏️</div>

              <h2>Edit Staff Member</h2>

              <p className="admin-modal-message">
                Update details for this staff member.
              </p>

              {editError && (
                <div className="admin-error">
                  <span>⚠️</span>
                  {editError}
                </div>
              )}

              <form className="admin-form" onSubmit={confirmEdit}>
                <div className="admin-form-grid">

                  <div className="admin-field">
                    <label>First Name</label>
                    <div className="admin-input-wrapper">
                      <span>👤</span>
                      <input
                        type="text"
                        value={editFirstName}
                        onChange={(e) => setEditFirstName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="admin-field">
                    <label>Last Name</label>
                    <div className="admin-input-wrapper">
                      <span>👤</span>
                      <input
                        type="text"
                        value={editLastName}
                        onChange={(e) => setEditLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="admin-field admin-field-full">
                    <label>Email Address</label>
                    <div className="admin-input-wrapper">
                      <span>✉️</span>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                                    <div className="admin-field admin-field-full">
                    <label>Staff Role</label>
                    <div className="admin-input-wrapper">
                      <span>💼</span>
                      <select
                        value={editRole}
                        onChange={(e) => {
                          setEditRole(e.target.value);
                          if (e.target.value !== "DOCTOR") {
                            setEditDepartment("");
                          }
                        }}
                        required
                      >
                        <option value="DOCTOR">Doctor</option>
                        <option value="RECEPTIONIST">Receptionist</option>
                        <option value="LAB_TECHNICIAN">Lab Technician</option>
                      </select>
                    </div>
                  </div>


                  {editRole === "DOCTOR" && (

                    <div className="admin-field admin-field-full">
                      <label>Department</label>
                      <div className="admin-input-wrapper">
                        <span>🏥</span>
                        <select
                          value={editDepartment}
                          onChange={(e) => setEditDepartment(e.target.value)}
                          required
                        >
                          <option value="">Select department</option>
                          <option value="ORTHOPEDICS">🦴 Orthopedics</option>
                          <option value="NEUROLOGY">🧠 Neurology</option>
                          <option value="CARDIOLOGY">❤️ Cardiology</option>
                          <option value="OPHTHALMOLOGY">👁️ Ophthalmology</option>
                          <option value="GENERAL_MEDICINE">🩺 General Medicine</option>
                          <option value="PEDIATRICS">👶 Pediatrics</option>
                          <option value="PULMONOLOGY">🫁 Pulmonology</option>
                        </select>
                      </div>
                    </div>

                  )}

                </div>

                <div className="admin-modal-actions">
                  <button type="button" onClick={cancelEdit} className="admin-modal-cancel">
                    Cancel
                  </button>

                  <button type="submit" className="admin-modal-confirm">
                    ✏️ Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}



        {/* FOOTER */}
        <div className="admin-footer">
          <span>🏥 Hospify</span>
          <span>Healthcare Management System</span>
        </div>

      </main>

    </div>
  );
}
export default AdminDashboard;