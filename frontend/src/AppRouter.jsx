import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CameraPage from './components/CameraPage';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

function AppRouter() {
  // Track company registration globally
  const [companyRegistered, setCompanyRegistered] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage setCompanyRegistered={setCompanyRegistered} companyRegistered={companyRegistered} />} />
        <Route path="/dashboard" element={companyRegistered ? <Dashboard /> : <Navigate to="/" replace />} />
        <Route path="/camera" element={companyRegistered ? <CameraPage /> : <Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
