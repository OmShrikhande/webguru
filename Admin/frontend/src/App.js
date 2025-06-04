import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import AddUser from './pages/AddUser';
import UserInfo from './pages/UserInfo';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Attendance from './pages/Attendance';
import AdminProfile from './pages/AdminProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/adduser" element={<AddUser />} />
        <Route path="/userinfo/:userId" element={<UserInfo />} />
        <Route path="/users" element={<Users />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/notifications" element={<Dashboard />} />
        <Route path="/security" element={<Settings />} />
        <Route path="/system" element={<Analytics />} />
      </Routes>
    </Router>
  );
}

export default App;
