import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use Routes instead of Switch

import LoginPage from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import PledgeDashboard from './components/PledgeDashboard';

const App = () => {
  return (
    <Router>
      <Routes> {/* Use Routes to wrap your routes */}
        <Route path="/" element={<LoginPage />} /> {/* Use element prop */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/pledge-dashboard" element={<PledgeDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
