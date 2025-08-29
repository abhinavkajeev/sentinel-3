
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LandingPage from "./components/LandingPage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import CameraPage from "./components/CameraPage.jsx";

function ProtectedRoute({ children }) {
  const { company, loading } = useAuth();
  if (loading) return null; // or a loading spinner
  return company ? children : <Navigate to="/login" replace />;
}

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/camera" element={<CameraPage />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
