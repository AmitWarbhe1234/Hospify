import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AvailableDoctors from "./pages/AvailableDoctors";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PatientRegistration from "./pages/PatientRegistration";
import DoctorDashboard from "./pages/DoctorDashboard";
import LabTechnicianDashboard from "./pages/LabTechnicianDashboard";
import ActivateAccount from "./pages/ActivateAccount";
import LabReports from "./pages/LabReports";
import GenerateBill from "./pages/GenerateBill";
import MyBills from "./pages/MyBills";
import Chatbot from "./components/Chatbot";
import "./App.css";





function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/activate" element={<ActivateAccount />} />

        <Route
          path="/"
          element={<h1>Welcome to Hospify</h1>}
        />


        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute>
              <PatientDashboard />
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

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
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
        path="/my-appointments"
        element={
          <ProtectedRoute>
            <MyAppointments />
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
          path="/patient-registration"
          element={<PatientRegistration />}
        />
        

        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/receptionist-dashboard"
          element={<ReceptionistDashboard />}
        />
       
        <Route
          path="/generate-bill"
          element={<GenerateBill />}
        />


        <Route
          path="/lab-technician-dashboard"
          element={
            <ProtectedRoute>
              <LabTechnicianDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    <Chatbot />
    </BrowserRouter>
  );
}

export default App;


