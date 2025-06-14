import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  CircularProgress, 
  Fade, 
  Alert,
  IconButton, 
  Divider, 
  Stack,
  Button
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import { blue, green, orange, red, purple } from '@mui/material/colors';
import { Bar, Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

// Chart.js registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';  // Change from 'chart' to 'chart.js'
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Add these imports at the top with other imports
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function MasterDashboard() {
  const { getToken, user, refreshToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalAdmins: 0,
    recentUsers: 0,
    departmentStats: []
  });
  const [todayAttendance, setTodayAttendance] = useState({
    records: [],
    departmentStats: [],
    summary: {
      total: 0,
      present: 0,
      late: 0,
      absent: 0,
      halfDay: 0,
      averageCheckInTime: '00:00'
    }
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Get token from AuthContext
        const token = getToken();
        
        if (!token) {
          setError('Authentication token not found. Please login again.');
          setLoading(false);
          return;
        }
        
        try {
          // Fetch dashboard stats
          const [statsResponse, attendanceResponse] = await Promise.all([
            axios.get('http://localhost:5000/api/dashboard/stats', {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get('http://localhost:5000/api/dashboard/today-attendance', {
              headers: { Authorization: `Bearer ${token}` }
            })
          ]);
  
          if (statsResponse.data.success && attendanceResponse.data.success) {
            setStats(statsResponse.data.data);
            setTodayAttendance(attendanceResponse.data.data);
          }
        } catch (error) {
          // Check if error is due to token expiration (401 Unauthorized)
          if (error.response && error.response.status === 401) {
            // Try to refresh the token
            const refreshed = await refreshToken();
            
            if (refreshed) {
              // If token was refreshed successfully, try fetching data again
              const newToken = getToken();
              try {
                const [statsResponse, attendanceResponse] = await Promise.all([
                  axios.get('http://localhost:5000/api/dashboard/stats', {
                    headers: { Authorization: `Bearer ${newToken}` }
                  }),
                  axios.get('http://localhost:5000/api/dashboard/today-attendance', {
                    headers: { Authorization: `Bearer ${newToken}` }
                  })
                ]);
                
                if (statsResponse.data.success && attendanceResponse.data.success) {
                  setStats(statsResponse.data.data);
                  setTodayAttendance(attendanceResponse.data.data);
                  // Clear any error if it was set
                  setError(null);
                  return; // Exit the function since we've successfully fetched data
                }
              } catch (refreshError) {
                console.error('Error after token refresh:', refreshError);
              }
            }
            
            // If we get here, token refresh failed or fetching after refresh failed
            setError('Your session has expired. Please login again.');
            // Redirect to login page or trigger logout
            localStorage.removeItem('user');
            localStorage.removeItem('masterToken');
            window.location.href = '/'; // Redirect to login page
          } else {
            console.error('Dashboard data fetch error:', error);
            setError(error.response?.data?.message || 'Failed to fetch dashboard data');
          }
        }
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
        setError(error.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    } else {
      setError('User not authenticated. Please login.');
      setLoading(false);
    }
  }, [getToken, user, refreshToken]);

  // Transform backend data for stats cards
  const statsData = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: <PeopleIcon />,
      color: blue[500],
      description: 'Total registered users in the system'
    },
    {
      label: 'Present Today',
      value: todayAttendance.summary.present,
      icon: <EventAvailableIcon />,
      color: green[500],
      description: 'Users who checked in today'
    },
    {
      label: 'Late Today',
      value: todayAttendance.summary.late,
      icon: <AccessTimeIcon />,
      color: orange[500],
      description: 'Users who checked in late today'
    },
    {
      label: 'Active Admins',
      value: stats.totalAdmins,
      icon: <AdminPanelSettingsIcon />,
      color: purple[500],
      description: 'Total admin users with access'
    },
  ];

  // Transform attendance data for chart
  const chartData = {
    labels: todayAttendance.departmentStats.map(dept => dept._id),
    datasets: [
      {
        label: 'Present',
        data: todayAttendance.departmentStats.map(dept => dept.present),
        backgroundColor: 'rgba(76, 175, 80, 0.5)',
        borderColor: green[700],
        borderWidth: 2,
      },
      {
        label: 'Late',
        data: todayAttendance.departmentStats.map(dept => dept.late),
        backgroundColor: 'rgba(255, 152, 0, 0.5)',
        borderColor: orange[700],
        borderWidth: 2,
      },
      {
        label: 'Absent',
        data: todayAttendance.departmentStats.map(dept => dept.absent),
        backgroundColor: 'rgba(244, 67, 54, 0.5)',
        borderColor: red[700],
        borderWidth: 2,
      }
    ]
  };

  // Modified chart options to show multiple datasets
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { 
        display: true,
        position: 'top',
        labels: { color: 'rgba(255,255,255,0.8)' }
      },
    },
    scales: {
      x: { 
        grid: { display: false },
        ticks: { color: 'rgba(255,255,255,0.8)' }
      },
      y: { 
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: 'rgba(255,255,255,0.8)' }
      },
    },
    animation: {
      duration: 1200,
      easing: 'easeInOutQuart',
    },
  };

  // Transform attendance records for activities feed
  const recentActivities = todayAttendance.records.slice(0, 5).map(record => ({
    time: new Date(record.checkIn?.time).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    }),
    activity: `${record.userId.name} ${record.status === 'late' ? 'checked in late' : 'checked in'}`
  }));

  // Sample performance data
  const performanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Productivity',
      data: [75, 82, 78, 85, 80, 87, 89],
      borderColor: blue[500],
      backgroundColor: `${blue[500]}33`,
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw', // Add this
        maxWidth: '100vw', // Add this 
        background: 'linear-gradient(120deg, red 0%, #1e2a3a 100%)',
        p: { xs: 2, md: 2 },
        overflowX: 'auto', // Add this to prevent horizontal scroll
        position: 'relative', // Add this
        boxSizing: 'border-box', // Add this
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Fade in={!loading}>
        <Box>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                letterSpacing: 1,
                color: '#fff',
                background: 'linear-gradient(90deg, #fff, #90caf9, #00e676, #ffeb3b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Master Dashboard
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}
            >
              Welcome! Here’s a quick overview of your system.
            </Typography>
          </motion.div>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {statsData.map((stat, idx) => (
              <Grid item xs={12} sm={6} md={3} key={stat.label}>
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2 + idx * 0.1, duration: 0.6, type: 'spring' }}
                  whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
                >
                  <Card
                    sx={{
                      borderRadius: 4,
                      background: 'rgba(255,255,255,0.07)',
                      boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
                      color: '#fff',
                      minHeight: 120,
                    }}
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: stat.color,
                          width: 56,
                          height: 56,
                          mr: 2,
                          boxShadow: `0 4px 16px ${stat.color}55`,
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 600 }}>
                          {stat.label}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.6, display: 'block', mt: 0.5 }}>
                          {stat.description}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Attendance Summary Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon sx={{ mr: 1 }} /> Attendance Overview
            </Typography>
            <Card sx={{ 
              background: 'rgba(255,255,255,0.08)', 
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.05)' }}>
                      <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        Today's Summary
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box sx={{ 
                              width: 10, 
                              height: 10, 
                              borderRadius: '50%', 
                              bgcolor: green[500],
                              mr: 1 
                            }} />
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              Present: {todayAttendance.summary.present}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ 
                              width: 10, 
                              height: 10, 
                              borderRadius: '50%', 
                              bgcolor: orange[500],
                              mr: 1 
                            }} />
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              Late: {todayAttendance.summary.late}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box sx={{ 
                              width: 10, 
                              height: 10, 
                              borderRadius: '50%', 
                              bgcolor: red[500],
                              mr: 1 
                            }} />
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              Absent: {todayAttendance.summary.absent}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ 
                              width: 10, 
                              height: 10, 
                              borderRadius: '50%', 
                              bgcolor: purple[500],
                              mr: 1 
                            }} />
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              Half Day: {todayAttendance.summary.halfDay}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.05)' }}>
                      <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        User Statistics
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box sx={{ 
                              width: 10, 
                              height: 10, 
                              borderRadius: '50%', 
                              bgcolor: blue[500],
                              mr: 1 
                            }} />
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              Total Users: {stats.totalUsers}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ 
                              width: 10, 
                              height: 10, 
                              borderRadius: '50%', 
                              bgcolor: blue[300],
                              mr: 1 
                            }} />
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              Active Users: {stats.activeUsers}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box sx={{ 
                              width: 10, 
                              height: 10, 
                              borderRadius: '50%', 
                              bgcolor: purple[500],
                              mr: 1 
                            }} />
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              Total Admins: {stats.totalAdmins}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ 
                              width: 10, 
                              height: 10, 
                              borderRadius: '50%', 
                              bgcolor: green[300],
                              mr: 1 
                            }} />
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              Avg. Check-in: {todayAttendance.summary.averageCheckInTime}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
          
          {/* Quick Actions Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Quick Actions</Typography>
            <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
              {['Add User', 'Generate Report', 'View Locations', 'Manage Departments'].map((action, idx) => (
                <motion.div
                  key={action}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <Card
                    sx={{
                      minWidth: 200,
                      background: 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(10px)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ color: 'white' }}>{action}</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Stack>
          </Box>

          {/* Main Dashboard Content */}
          <Grid 
            container 
            spacing={3} 
            sx={{
              width: '100%',
              m: 0, // Remove default margins
              '& .MuiGrid-item': {
                pl: { xs: 0, sm: 3 }, // Adjust padding for different screen sizes
              }
            }}
          >
            {/* Chart Section */}
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                style={{ height: 320 }}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.09)',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.13)',
                    color: '#fff',
                    height: 320,
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#fff', fontWeight: 700 }}>
                      Today's Attendance Overview
                    </Typography>
                    <Line data={chartData} options={chartOptions} height={220} />
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.7 }}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.09)',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.13)',
                    color: '#fff',
                    height: 320,
                    overflow: 'auto',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#fff', fontWeight: 700 }}>
                      <NotificationsActiveIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Recent Activities
                    </Typography>
                    <Box>
                      {recentActivities.map((act, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + idx * 0.08, duration: 0.4 }}
                        >
                          <Box
                            sx={{
                              mb: 2,
                              p: 1.2,
                              borderRadius: 2,
                              background: 'rgba(33,150,243,0.07)',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: blue[300],
                                fontWeight: 700,
                                minWidth: 56,
                                mr: 1,
                              }}
                            >
                              {act.time}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#fff' }}>
                              {act.activity}
                            </Typography>
                          </Box>
                        </motion.div>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* New Sections */}
            {/* Department Performance */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card sx={{
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.09)',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.13)',
                  color: '#fff'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Department Performance
                      </Typography>
                      <IconButton size="small" sx={{ color: 'white' }}>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                    <Box sx={{ height: 300 }}>
                      <Line data={performanceData} options={chartOptions} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Recent Timeline */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card sx={{
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.09)',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.13)',
                  color: '#fff',
                  height: '100%'
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                      Recent Updates
                    </Typography>
                    <Timeline position="alternate" sx={{ color: 'white' }}>
                      {/*
                        Sample timeline data - replace with real data as needed
                        { title, icon, color }
                      */}
                      {/*
                        { title: 'New Employee Added', icon: <GroupAddIcon />, color: green[500] },
                        { title: 'Location Updated', icon: <LocationOnIcon />, color: blue[500] },
                        { title: 'Department Changed', icon: <WorkIcon />, color: purple[500] }
                      */}
                    </Timeline>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* System Status */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card sx={{
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.09)',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.13)',
                  color: '#fff'
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                      System Status
                    </Typography>
                    <Grid container spacing={3}>
                      {/*
                        Sample status data - replace with real data as needed
                        { label, value, trend }
                      */}
                      {/*
                        { label: 'Server Status', value: 'Operational', trend: 'up' },
                        { label: 'Response Time', value: '145ms', trend: 'down' },
                        { label: 'Active Sessions', value: '234', trend: 'up' },
                        { label: 'Error Rate', value: '0.02%', trend: 'down' }
                      */}
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </Fade>
      
      {/* Enhanced Loader */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(30,36,58,0.95)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CircularProgress size={80} thickness={4} sx={{ color: blue[400] }} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mt: 3, 
                color: 'white',
                fontWeight: 500,
                textAlign: 'center'
              }}
            >
              Loading Dashboard Data...
            </Typography>
          </motion.div>
        </Box>
      )}
      
      {/* Error Display with Retry Button */}
      {error && !loading && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(30,36,58,0.95)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Alert 
              severity="error" 
              variant="filled"
              sx={{ 
                fontSize: '1rem',
                mb: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}
            >
              {error}
            </Alert>
          </motion.div>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'white',
              mb: 3,
              textAlign: 'center',
              maxWidth: 500,
              px: 2
            }}
          >
            There was a problem loading the dashboard data. This could be due to an authentication issue.
            Please make sure you are logged in with a valid master account.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => window.location.href = '/'}
            sx={{
              mt: 2,
              boxShadow: '0 4px 12px rgba(30,136,229,0.5)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(30,136,229,0.7)',
              }
            }}
          >
            Go to Login
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default MasterDashboard;