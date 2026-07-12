import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { isAuthenticated } from "./api/client";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import VehicleRegistry from "./pages/VehicleRegistry";
import Drivers from "./pages/Drivers";
import Settings from "./pages/Settings";
import TripDispatcher from "./pages/TripDispatcher";
import Maintenance from "./pages/Maintenance";
import FuelManagement from "./pages/FuelManagement";
import Analytics from "./pages/Analytics";

// Guards any route behind a valid JWT in localStorage
function PrivateRoute({ element }) {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication — accessible without a token */}
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route path="/dashboard"       element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/fleet"           element={<PrivateRoute element={<VehicleRegistry />} />} />
        <Route path="/drivers"         element={<PrivateRoute element={<Drivers />} />} />
        <Route path="/trip-dispatcher" element={<PrivateRoute element={<TripDispatcher />} />} />
        <Route path="/maintenance"     element={<PrivateRoute element={<Maintenance />} />} />
        <Route path="/fuel-management" element={<PrivateRoute element={<FuelManagement />} />} />
        <Route path="/analytics"       element={<PrivateRoute element={<Analytics />} />} />
        <Route path="/settings"        element={<PrivateRoute element={<Settings />} />} />

        {/* Default */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;