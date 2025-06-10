import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import MasterDashboard from './pages/MasterDashboard';
import Users from './pages/Users';
import Admin from './pages/Admin';
import Analytics from './pages/Analytics';
import Userdata from './components/dashboard/userdata';
import Attendance from './pages/Attendance';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

// Loading component for lazy-loaded routes
const LazyLoadingComponent = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100%',
    color: 'rgba(255, 255, 255, 0.7)'
  }}>
    Loading...
  </div>
);

// Default component for unimplemented pages
const DefaultPage = ({ title }) => (
  <div style={{ padding: '20px' }}>
    <h2 style={{ 
      background: 'linear-gradient(90deg, #fff, #90caf9)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 700
    }}>
      {title}
    </h2>
    <div style={{ 
      padding: '40px', 
      backgroundColor: 'rgba(25, 35, 60, 0.5)',
      borderRadius: '12px',
      border: '1px solid rgba(100, 180, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      textAlign: 'center',
      color: 'rgba(255, 255, 255, 0.7)',
      marginTop: '20px'
    }}>
      This page is under construction.
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <MasterDashboard />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/users',
        element: <Users />
      },
      {
        path: '/admin',
        element: <Admin />
      },
      {
        path: '/analytics',
        element: <Analytics />
      },
      {
        path: '/userdata',
        element: <Userdata />
      },
      {
        path: '/attendance',
        element: <Attendance />
      },
      {
        path: '/settings',
        element: <Settings />
      },
      {
        path: '*',
        element: <DefaultPage title="Page Not Found" />
      }
    ]
  }
]);

export default router;