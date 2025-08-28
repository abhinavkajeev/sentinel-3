// src/App.js
// This is the main React component for your Sentinel-3 frontend.
// It handles state, displays the UI, and communicates with the backend API.




import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CameraPage from './components/CameraPage';

function App() {
  const [page, setPage] = useState('landing'); // 'landing' | 'dashboard' | 'camera'

  if (page === 'landing') {
    return <LandingPage onLogin={() => setPage('dashboard')} />;
  }
  if (page === 'camera') {
    return <CameraPage />;
  }
  // dashboard
  return <Dashboard onBack={() => setPage('landing')} onCamera={() => setPage('camera')} />;
}

export default App;
