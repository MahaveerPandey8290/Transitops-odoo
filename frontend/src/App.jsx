import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TripDispatcher from "./pages/TripDispatcher";
import Maintenance from "./pages/Maintenance";

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Trip Dispatcher */}
        <Route path="/trip-dispatcher" element={<TripDispatcher />} />

        {/* Maintenance */}
        <Route path="/maintenance" element={<Maintenance />} />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;