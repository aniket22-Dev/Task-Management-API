import React from 'react';
import { Route, Routes, BrowserRouter, Link } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

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
  );
};

export default App;
