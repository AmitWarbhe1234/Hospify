import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import ActivateAccount from "./pages/ActivateAccount";

import ProtectedRoute from "./components/ProtectedRoute";

import PatientDashboard from "./pages/PatientDashboard";
import AvailableDoctors from "./pages/AvailableDoctors";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";

import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PatientRegistration from "./pages/PatientRegistration";

import DoctorDashboard from "./pages/DoctorDashboard";
import LabTechnicianDashboard from "./pages/LabTechnicianDashboard";

import LabReports from "./pages/LabReports";
import GenerateBill from "./pages/GenerateBill";
import MyBills from "./pages/MyBills";

import FindPatient from "./pages/FindPatient";
import PatientDetails from "./pages/PatientDetails";

import Appointments from "./pages/Appointments";

import Chatbot from "./components/Chatbot";

import "./App.css";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================= LOGIN ================= */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/activate"
          element={<ActivateAccount />}
        />


        {/* ================= PATIENT ================= */}

        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/available-doctors"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <AvailableDoctors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book-appointment"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <BookAppointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <MyAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bills"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <MyBills />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lab-reports"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <LabReports />
            </ProtectedRoute>
          }
        />


        {/* ================= ADMIN ================= */}

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        {/* ================= RECEPTIONIST ================= */}

        <Route
          path="/receptionist-dashboard"
          element={
            <ProtectedRoute allowedRoles={["RECEPTIONIST"]}>
              <ReceptionistDashboard />
            </ProtectedRoute>
          }
        />

        {/* Receptionist Appointment Management */}

        <Route
          path="/receptionist-appointments"
          element={
            <ProtectedRoute allowedRoles={["RECEPTIONIST"]}>
              <Appointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient-registration"
          element={
            <ProtectedRoute allowedRoles={["RECEPTIONIST"]}>
              <PatientRegistration />
            </ProtectedRoute>
          }
        />

        <Route
          path="/find-patient"
          element={
            <ProtectedRoute allowedRoles={["RECEPTIONIST"]}>
              <FindPatient />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/:patientId"
          element={
            <ProtectedRoute allowedRoles={["RECEPTIONIST"]}>
              <PatientDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/generate-bill"
          element={
            <ProtectedRoute allowedRoles={["RECEPTIONIST"]}>
              <GenerateBill />
            </ProtectedRoute>
          }
        />


        {/* ================= DOCTOR ================= */}

        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />


        {/* ================= LAB TECHNICIAN ================= */}

        <Route
          path="/lab-technician-dashboard"
          element={
            <ProtectedRoute allowedRoles={["LAB_TECHNICIAN"]}>
              <LabTechnicianDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>


      {/* ================= CHATBOT ================= */}

      <Chatbot />

    </BrowserRouter>
  );
}

export default App;
