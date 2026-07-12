import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";


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



function App() {

  return (

    <Router>

      <Routes>


        {/* Authentication */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />



        {/* Dashboard */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />



        {/* Fleet */}

        <Route
          path="/fleet"
          element={<VehicleRegistry />}
        />



        {/* Drivers */}

        <Route
          path="/drivers"
          element={<Drivers />}
        />



        {/* Trips */}

        <Route
          path="/trip-dispatcher"
          element={<TripDispatcher />}
        />



        {/* Maintenance */}

        <Route
          path="/maintenance"
          element={<Maintenance />}
        />



        {/* Fuel Management */}

        <Route
          path="/fuel-management"
          element={<FuelManagement />}
        />



        {/* Analytics */}

        <Route
          path="/analytics"
          element={<Analytics />}
        />



        {/* Settings */}

        <Route
          path="/settings"
          element={<Settings />}
        />



        {/* Default */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />


      </Routes>


    </Router>

  );

}


export default App;