import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VehicleRegistry from './pages/VehicleRegistry';
import Drivers from './pages/Drivers';
import Settings from './pages/Settings';
import TripDispatcher from './pages/TripDispatcher';

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Fleet */}
        <Route path="/fleet" element={<VehicleRegistry />} />

        {/* Drivers */}
        <Route path="/drivers" element={<Drivers />} />

        {/* Trip Dispatcher */}
        <Route path="/trip-dispatcher" element={<TripDispatcher />} />

        {/* Settings */}
        <Route path="/settings" element={<Settings />} />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;