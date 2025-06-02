import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfessionalDashboard = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Fetch stats
      try {
        const statsResponse = await axios.get('http://localhost:5000/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardStats(statsResponse.data.data);
      } catch (err) {
        console.log('Dashboard stats not available');
      }

      // Fetch activities
      try {
        const activitiesResponse = await axios.get('http://localhost:5000/api/dashboard/recent-activities', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecentActivities(activitiesResponse.data.activities);
      } catch (err) {
        console.log('Recent activities not available');
      }

      setStatsLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setStatsLoading(false);
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { name: 'Users', icon: '👥', path: '/users' },
    { name: 'Add User', icon: '➕', path: '/adduser' },
    { name: 'Attendance', icon: '📅', path: '/attendance' },
    { name: 'Analytics', icon: '📊', path: '/analytics' },
    { name: 'Reports', icon: '📋', path: '/reports' },
    { name: 'Settings', icon: '⚙️', path: '/settings' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 
        text-white z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
        w-64 shadow-2xl border-r border-gray-700
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">W</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">WebGuru</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl
                       text-gray-300 hover:bg-gray-700 hover:text-white
                       transition-all duration-200"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl
                     text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-transparent overflow-y-auto">
        {/* Top navigation */}
        <header className="bg-white/30 backdrop-blur border border-white/30 shadow-lg z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                ☰
              </button>
              <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <span className="text-xl">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Admin</span>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600">👤</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Stats Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="rounded-xl p-6 shadow-lg bg-white/30 backdrop-blur border border-white/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardStats?.totalUsers || 0}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-6 shadow-lg bg-white/30 backdrop-blur border border-white/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardStats?.activeUsers || 0}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-xl">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-6 shadow-lg bg-white/30 backdrop-blur border border-white/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardStats?.recentUsers || 0}
                  </p>
                  <p className="text-xs text-gray-500">Last 7 days</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-xl">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-6 shadow-lg bg-white/30 backdrop-blur border border-white/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Health</p>
                  <p className="text-2xl font-bold text-gray-900">99.9%</p>
                  <p className="text-xs text-gray-500">Uptime</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl">
                  <span className="text-2xl">💚</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <div className="rounded-xl p-6 shadow-lg bg-white/30 backdrop-blur border border-white/30">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => navigate('/adduser')}
                    className="p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 text-center"
                  >
                    <div className="bg-blue-50 p-3 rounded-xl mb-2 mx-auto w-fit">
                      <span className="text-2xl">➕</span>
                    </div>
                    <p className="text-sm font-medium text-gray-950">Add User</p>
                  </button>
                  
                  <button
                    onClick={() => navigate('/reports')}
                    className="p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 text-center text-gray-950"
                  >
                    <div className="bg-green-50 p-3 rounded-xl mb-2 mx-auto w-fit">
                      <span className="text-2xl">📋</span>
                    </div>
                    <p className="text-sm font-medium text-gray-950">Reports</p>
                  </button>
                  
                  <button
                    onClick={() => navigate('/analytics')}
                    className="p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 text-center"
                  >
                    <div className="bg-purple-50 p-3 rounded-xl mb-2 mx-auto w-fit text-gray-950">
                      <span className="text-2xl">📊</span>
                    </div>
                    <p className="text-sm font-medium text-gray-950">Analytics</p>
                  </button>
                  
                  <button
                    onClick={fetchDashboardData}
                    className="p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 text-center"
                  >
                    <div className="bg-gray-50 p-3 rounded-xl mb-2 mx-auto w-fit">
                      <span className="text-2xl">🔄</span>
                    </div>
                    <p className="text-sm font-medium text-gray-950">Refresh</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="lg:col-span-1">
              <div className="rounded-xl p-6 shadow-lg bg-white/30 backdrop-blur border border-white/30">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                <div className="space-y-3">
                  {recentActivities.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <span className="text-sm">👤</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">
                          {activity.user?.name || 'User'} joined
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.user?.department || 'Department'}
                        </p>
                      </div>
                    </div>
                  ))}
                  {recentActivities.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No recent activities
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="rounded-xl shadow-lg bg-white/30 backdrop-blur border border-white/30">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;