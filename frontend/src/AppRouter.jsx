import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CameraPage from './components/CameraPage';
import EventLog from './components/EventLog';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/camera" element={<CameraPage />} />
        <Route path="/eventlog" element={<EventLog events={[]} />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
