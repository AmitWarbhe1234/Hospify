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
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/available-doctors"
          element={
            <ProtectedRoute>
              <AvailableDoctors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book-appointment"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bills"
          element={
            <ProtectedRoute>
              <MyBills />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lab-reports"
          element={
            <ProtectedRoute>
              <LabReports />
            </ProtectedRoute>
          }
        />


        {/* ================= ADMIN ================= */}

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        {/* ================= RECEPTIONIST ================= */}

        <Route
          path="/receptionist-dashboard"
          element={
            <ProtectedRoute>
              <ReceptionistDashboard />
            </ProtectedRoute>
          }
        />

        {/* Receptionist Appointment Management */}

        <Route
          path="/receptionist-appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient-registration"
          element={
            <ProtectedRoute>
              <PatientRegistration />
            </ProtectedRoute>
          }
        />

        <Route
          path="/find-patient"
          element={
            <ProtectedRoute>
              <FindPatient />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/:patientId"
          element={
            <ProtectedRoute>
              <PatientDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/generate-bill"
          element={
            <ProtectedRoute>
              <GenerateBill />
            </ProtectedRoute>
          }
        />


        {/* ================= DOCTOR ================= */}

        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />


        {/* ================= LAB TECHNICIAN ================= */}

        <Route
          path="/lab-technician-dashboard"
          element={
            <ProtectedRoute>
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