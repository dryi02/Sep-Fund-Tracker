import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();  // For navigation after logout

  // Handle logout
  const handleLogout = () => {
    // Clear any session or authentication data (e.g., from localStorage)
    localStorage.removeItem('adminToken');  // Remove admin token if you're using JWT
    localStorage.removeItem('role');  // Remove role if stored

    // Redirect to login page after logging out
    navigate('/');  // Redirect to login page (or wherever you want the user to go after logging out)
  };

  return (
    <div>
      <h1>Welcome to the Admin Dashboard</h1>
      <p>Here you can manage the classes and pledges.</p>

      {/* Logout Button */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
