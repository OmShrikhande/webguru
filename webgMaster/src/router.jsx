import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import MasterDashboard from './pages/MasterDashboard';
import Admin from './pages/Admin';
import Analytics from './pages/Analytics';
import UserData from './pages/UserData';
import UserInfo from './pages/UserInfo';
import Attendance from './pages/Attendance';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Alert from './pages/Alert';

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
    path: '/',
    element: <Login />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '', // This is the index route for /dashboard
        element: <MasterDashboard />
      },
      {
        path: 'overview',
        element: <Dashboard />
      },
      {
        path: 'users',
        element: <UserData />
      },
      {
        path: 'admin',
        element: <Admin />
      },
      {
        path: 'analytics',
        element: <Analytics />
      },
      {
        path: 'userdata',
        element: <UserData />
      },
      {
        path: 'userinfo/:userId',
        element: <UserInfo />
      },
      {
        path: 'attendance',
        element: <Attendance />
      },
      {
        path: 'settings',
        element: <Settings />
      },
      {
        path: 'alert',
        element: <Alert />
      },
      {
        path: '*',
        element: <DefaultPage title="Page Not Found" />
      }
    ]
  }
]);

export default router;