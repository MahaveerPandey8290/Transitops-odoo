import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import VehicleRegistry from "./pages/VehicleRegistry";
import Drivers from "./pages/Drivers";
import Settings from "./pages/Settings";
import TripDispatcher from "./pages/TripDispatcher";
import Maintenance from "./pages/Maintenance";
import FuelManagement from "./pages/FuelManagement";


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


        {/* Maintenance */}
        <Route path="/maintenance" element={<Maintenance />} />


        {/* Fuel Management */}
        <Route 
          path="/fuel-management" 
          element={<FuelManagement />} 
        />


        {/* Settings */}
        <Route path="/settings" element={<Settings />} />


        {/* Default Redirect */}
        <Route 
          path="*" 
          element={<Navigate to="/dashboard" replace />} 
        />

      </Routes>

    </Router>
  );
}

export default App;