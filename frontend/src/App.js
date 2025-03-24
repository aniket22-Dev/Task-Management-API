import React from 'react';
import { Route, Routes, BrowserRouter, Link } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/"
          element={
            <div>
              <h1>Welcome to the Task Manager</h1>
              <div>
                {/* Redirect to login and signup */}
                <Link to="/login">
                  <button>Login</button>
                </Link>
                <Link to="/signup" style={{ marginLeft: '10px' }}>
                  <button>Signup</button>
                </Link>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
