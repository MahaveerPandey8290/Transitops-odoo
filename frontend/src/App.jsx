<<<<<<< HEAD
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TripDispatcher from "./pages/TripDispatcher";
import Maintenance from "./pages/Maintenance";

=======
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VehicleRegistry from './pages/VehicleRegistry';
import Drivers from './pages/Drivers';
import Settings from './pages/Settings';
import TripDispatcher from './pages/TripDispatcher';

>>>>>>> 02b1c6d3d25c2ee2ea79cbb467278f1773f87197
function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication */}
        <Route path="/login" element={<Login />} />
<<<<<<< HEAD

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
=======

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Fleet */}
        <Route path="/fleet" element={<VehicleRegistry />} />

        {/* Drivers */}
        <Route path="/drivers" element={<Drivers />} />
>>>>>>> 02b1c6d3d25c2ee2ea79cbb467278f1773f87197

        {/* Trip Dispatcher */}
        <Route path="/trip-dispatcher" element={<TripDispatcher />} />

<<<<<<< HEAD
        {/* Maintenance */}
        <Route path="/maintenance" element={<Maintenance />} />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
=======
        {/* Settings */}
        <Route path="/settings" element={<Settings />} />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
>>>>>>> 02b1c6d3d25c2ee2ea79cbb467278f1773f87197
      </Routes>
    </Router>
  );
}

export default App;