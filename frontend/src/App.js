import React, { useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter, Link, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AuthContext from './contexts/AuthContext';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/"
            element={
              <div className="home-container">
                <h1 className="home-title">Welcome to the Task Manager</h1>
                <div className="home-buttons">
                  <Link to="/login">
                    <button className="home-button">Login</button>
                  </Link>
                  <Link to="/signup" style={{ marginLeft: '10px' }}>
                    <button className="home-button">Signup</button>
                  </Link>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
