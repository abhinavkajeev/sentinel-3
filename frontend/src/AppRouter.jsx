import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CameraPage from './components/CameraPage';
import LoginPage from './components/LoginPage';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { company, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }
  
  return company ? children : <Navigate to="/login" replace />;
};

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/camera" element={
          <ProtectedRoute>
            <CameraPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default AppRouter;
