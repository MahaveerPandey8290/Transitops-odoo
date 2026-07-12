import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { isAuthenticated, getStoredUser } from "./api/client";
import { ROLE_ROUTES } from "./components/Sidebar";

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

// ── PrivateRoute ──────────────────────────────────────────────────────────────
// 1. Not logged in → redirect to /login
// 2. Logged in but role can't access this path → redirect to /dashboard
// This mirrors the sidebar filter so nav and routes agree.
function PrivateRoute({ path: routePath, element }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const user = getStoredUser();
  const allowedPaths = ROLE_ROUTES[user?.role] ?? ROLE_ROUTES['DISPATCHER'];

  if (!allowedPaths.includes(routePath)) {
    // Role can't visit this route — send them to dashboard (which every role can see)
    return <Navigate to="/dashboard" replace />;
  }

  return element;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public — no token required */}
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected — role-checked */}
        <Route path="/dashboard"
          element={<PrivateRoute path="/dashboard" element={<Dashboard />} />} />
        <Route path="/fleet"
          element={<PrivateRoute path="/fleet" element={<VehicleRegistry />} />} />
        <Route path="/drivers"
          element={<PrivateRoute path="/drivers" element={<Drivers />} />} />
        <Route path="/trip-dispatcher"
          element={<PrivateRoute path="/trip-dispatcher" element={<TripDispatcher />} />} />
        <Route path="/maintenance"
          element={<PrivateRoute path="/maintenance" element={<Maintenance />} />} />
        <Route path="/fuel-management"
          element={<PrivateRoute path="/fuel-management" element={<FuelManagement />} />} />
        <Route path="/analytics"
          element={<PrivateRoute path="/analytics" element={<Analytics />} />} />
        <Route path="/settings"
          element={<PrivateRoute path="/settings" element={<Settings />} />} />

        {/* Catch-all → login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}