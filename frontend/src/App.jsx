import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TripDispatcher from './pages/TripDispatcher';


function App() {

  return (

    <Router>

      <Routes>


        {/* Authentication */}
        <Route 
          path="/login" 
          element={<Login />} 
        />


        {/* Main Dashboard */}
        <Route 
          path="/dashboard" 
          element={<Dashboard />} 
        />


        {/* Trip Dispatcher */}
        <Route 
          path="/trip-dispatcher" 
          element={<TripDispatcher />} 
        />


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