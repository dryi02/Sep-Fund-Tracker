import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');  // First name (username)
  const [password, setPassword] = useState<string>('');  // Last name (password)
  const [error, setError] = useState<string>('');  // Error message
  const navigate = useNavigate();  // For navigation after login

  // Handle form submission
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Simulate a login API request
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),  // Send first name + last name
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      console.log(data);  // Log response to see if it worked

      if (response.ok) {
        // Based on the role from the backend, redirect to the appropriate dashboard
        if (data.role === 'admin') {
          navigate('/admin-dashboard');  // If role is admin, go to admin dashboard
        } else if (data.role === 'pledge') {
          navigate('/pledge-dashboard');  // If role is pledge, go to pledge dashboard
        }
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="username">First Name</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Last Name</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}  {/* Display error message if login fails */}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
