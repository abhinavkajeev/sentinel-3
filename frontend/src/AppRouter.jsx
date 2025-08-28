import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import CameraPage from './components/CameraPage';
import { useState } from 'react';

function AppRouter() {
  // Track company registration globally
  const [companyRegistered, setCompanyRegistered] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/camera" element={<CameraPage />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
