import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import AddUser from './pages/AddUser';
import UserInfo from './pages/UserInfo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/adduser" element={<AddUser />} />
        <Route path="/userinfo/:userId" element={<UserInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
