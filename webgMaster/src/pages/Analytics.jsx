import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  Button,
  TextField,
  InputAdornment,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
  alpha,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BarChart as BarChartIcon,
  DonutLarge as DonutLargeIcon,
  Timeline as TimelineIcon,
  CalendarToday as CalendarTodayIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  DevicesOther as DevicesIcon,
  Public as PublicIcon,
  AccessTime as AccessTimeIcon,
  Visibility as VisibilityIcon,
  LocationOn as LocationOnIcon,
  Work as WorkIcon,
  Event as EventIcon,
  Group as GroupIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

// Chart Components
const AttendanceBarChart = ({ data, height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          bgcolor: 'rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          border: '1px dashed rgba(100, 180, 255, 0.2)',
        }}
      >
        <BarChartIcon sx={{ fontSize: 40, color: 'rgba(100, 180, 255, 0.6)', mb: 1 }} />
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          No attendance data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="date" 
            stroke="rgba(255, 255, 255, 0.6)"
            tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
          />
          <YAxis 
            stroke="rgba(255, 255, 255, 0.6)"
            tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
          />
          <RechartsTooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(25, 35, 60, 0.95)', 
              border: '1px solid rgba(100, 180, 255, 0.2)',
              color: '#fff',
              borderRadius: '4px'
            }} 
          />
          <Legend 
            wrapperStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
          />
          <Bar dataKey="present" name="Present" fill="#4caf50" />
          <Bar dataKey="absent" name="Absent" fill="#f44336" />
          <Bar dataKey="late" name="Late" fill="#ff9800" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

const StatusPieChart = ({ data, height = 300 }) => {
  if (!data) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          bgcolor: 'rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          border: '1px dashed rgba(100, 180, 255, 0.2)',
        }}
      >
        <DonutLargeIcon sx={{ fontSize: 40, color: 'rgba(100, 180, 255, 0.6)', mb: 1 }} />
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          No status data available
        </Typography>
      </Box>
    );
  }

  const pieData = [
    { name: 'Present', value: data.presentUsers || 0, color: '#4caf50' },
    { name: 'Absent', value: data.absentUsers || 0, color: '#f44336' },
    { name: 'Late', value: data.lateUsers || 0, color: '#ff9800' }
  ];

  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <RechartsTooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(25, 35, 60, 0.95)', 
              border: '1px solid rgba(100, 180, 255, 0.2)',
              color: '#fff',
              borderRadius: '4px'
            }} 
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

const DepartmentDistributionChart = ({ users, height = 300 }) => {
  if (!users || users.length === 0) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          bgcolor: 'rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          border: '1px dashed rgba(100, 180, 255, 0.2)',
        }}
      >
        <WorkIcon sx={{ fontSize: 40, color: 'rgba(100, 180, 255, 0.6)', mb: 1 }} />
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          No department data available
        </Typography>
      </Box>
    );
  }

  // Group users by department
  const departmentCounts = users.reduce((acc, user) => {
    const dept = user.department || 'Unknown';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  // Convert to array for chart
  const departmentData = Object.entries(departmentCounts).map(([name, value], index) => ({
    name,
    value,
    color: [
      '#1e88e5', '#4caf50', '#ff9800', '#f44336', '#9c27b0', 
      '#00bcd4', '#ffeb3b', '#795548', '#607d8b', '#e91e63'
    ][index % 10]
  }));

  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={departmentData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {departmentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <RechartsTooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(25, 35, 60, 0.95)', 
              border: '1px solid rgba(100, 180, 255, 0.2)',
              color: '#fff',
              borderRadius: '4px'
            }} 
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

const UserActivityLineChart = ({ data, height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          bgcolor: 'rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          border: '1px dashed rgba(100, 180, 255, 0.2)',
        }}
      >
        <TimelineIcon sx={{ fontSize: 40, color: 'rgba(100, 180, 255, 0.6)', mb: 1 }} />
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          No activity data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="date" 
            stroke="rgba(255, 255, 255, 0.6)"
            tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
          />
          <YAxis 
            stroke="rgba(255, 255, 255, 0.6)"
            tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
          />
          <RechartsTooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(25, 35, 60, 0.95)', 
              border: '1px solid rgba(100, 180, 255, 0.2)',
              color: '#fff',
              borderRadius: '4px'
            }} 
          />
          <Legend 
            wrapperStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
          />
          <Line type="monotone" dataKey="total" name="Total Users" stroke="#1e88e5" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="active" name="Active Users" stroke="#4caf50" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

const LoadingPlaceholder = ({ height = 300, message = "Loading data..." }) => (
  <Box
    sx={{
      height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      bgcolor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: 2,
      border: '1px dashed rgba(100, 180, 255, 0.2)',
    }}
  >
    <CircularProgress size={40} sx={{ color: 'rgba(100, 180, 255, 0.6)', mb: 2 }} />
    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
      {message}
    </Typography>
  </Box>
);

const Analytics = () => {
  const { getToken } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [tabValue, setTabValue] = useState(0);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = getToken();
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        // Fetch dashboard stats and users in parallel
        const [statsResponse, usersResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/dashboard/stats', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        if (statsResponse.data.success) {
          setDashboardData(statsResponse.data.stats);
        }
        
        if (usersResponse.data.success) {
          setUsers(usersResponse.data.users || []);
        }
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(err.response?.data?.message || 'Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [getToken]);
  
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    handleFilterClose();
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Fetch dashboard stats and users in parallel
      const [statsResponse, usersResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      if (statsResponse.data.success) {
        setDashboardData(statsResponse.data.stats);
      }
      
      if (usersResponse.data.success) {
        setUsers(usersResponse.data.users || []);
      }
    } catch (err) {
      console.error('Error refreshing analytics data:', err);
      setError(err.response?.data?.message || 'Failed to refresh analytics data');
    } finally {
      setLoading(false);
    }
  };
  
  // Determine label for time range
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '24h': return 'Last 24 Hours';
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 90 Days';
      default: return 'Custom Range';
    }
  };
  
  // Generate user activity data for the line chart
  const generateUserActivityData = () => {
    if (!dashboardData?.weeklyAttendance) return [];
    
    return dashboardData.weeklyAttendance.map(day => ({
      date: day.date,
      total: day.total,
      active: day.present + day.late
    }));
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 1, 
              color: '#fff',
              background: 'linear-gradient(90deg, #fff, #90caf9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            User activity insights and attendance metrics.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }
            }}
          >
            {getTimeRangeLabel()}
          </Button>
          <Tooltip title="Refresh Data">
            <IconButton 
              onClick={handleRefresh}
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                bgcolor: 'rgba(0, 0, 0, 0.2)',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.3)' },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export Data">
            <IconButton 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                bgcolor: 'rgba(0, 0, 0, 0.2)',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.3)' },
              }}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Error message if any */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            bgcolor: 'rgba(244, 67, 54, 0.1)', 
            color: '#ef5350',
            border: '1px solid rgba(244, 67, 54, 0.2)',
            '& .MuiAlert-icon': { color: '#ef5350' }
          }}
        >
          {error}
        </Alert>
      )}
      
      {/* Time Range Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(25, 35, 60, 0.95)',
            border: '1px solid rgba(100, 180, 255, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            borderRadius: 2,
            minWidth: 180,
          }
        }}
      >
        <MenuItem onClick={() => handleTimeRangeChange('24h')} selected={timeRange === '24h'}>
          <Typography variant="body2" sx={{ color: '#fff' }}>Last 24 Hours</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleTimeRangeChange('7d')} selected={timeRange === '7d'}>
          <Typography variant="body2" sx={{ color: '#fff' }}>Last 7 Days</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleTimeRangeChange('30d')} selected={timeRange === '30d'}>
          <Typography variant="body2" sx={{ color: '#fff' }}>Last 30 Days</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleTimeRangeChange('90d')} selected={timeRange === '90d'}>
          <Typography variant="body2" sx={{ color: '#fff' }}>Last 90 Days</Typography>
        </MenuItem>
        <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        <MenuItem onClick={handleFilterClose}>
          <Typography variant="body2" sx={{ color: '#fff' }}>Custom Range...</Typography>
        </MenuItem>
      </Menu>
      
      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: 'rgba(25, 35, 60, 0.6)',
            borderRadius: 2,
            border: '1px solid rgba(100, 180, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
            },
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                    Total Users
                  </Typography>
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: '#42a5f5', my: 1 }} />
                  ) : (
                    <Typography variant="h4" sx={{ color: '#fff', fontWeight: 600 }}>
                      {dashboardData?.totalCounts?.users || 0}
                    </Typography>
                  )}
                </Box>
                <Box 
                  sx={{ 
                    bgcolor: alpha('#1e88e5', 0.15), 
                    p: 1, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PersonIcon sx={{ color: '#42a5f5', fontSize: 28 }} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Total registered users
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: 'rgba(25, 35, 60, 0.6)',
            borderRadius: 2,
            border: '1px solid rgba(100, 180, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
            },
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                    Active Users
                  </Typography>
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: '#81c784', my: 1 }} />
                  ) : (
                    <Typography variant="h4" sx={{ color: '#fff', fontWeight: 600 }}>
                      {dashboardData?.todayCounts?.activeUsers || 0}
                    </Typography>
                  )}
                </Box>
                <Box 
                  sx={{ 
                    bgcolor: alpha('#4caf50', 0.15), 
                    p: 1, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <VisibilityIcon sx={{ color: '#81c784', fontSize: 28 }} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {dashboardData?.totalCounts?.users ? 
                    `${Math.round((dashboardData.todayCounts.activeUsers / dashboardData.totalCounts.users) * 100)}% of total users` : 
                    'Active in last 24 hours'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: 'rgba(25, 35, 60, 0.6)',
            borderRadius: 2,
            border: '1px solid rgba(100, 180, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
            },
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                    Today's Attendance
                  </Typography>
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: '#ffb74d', my: 1 }} />
                  ) : (
                    <Typography variant="h4" sx={{ color: '#fff', fontWeight: 600 }}>
                      {dashboardData?.todayCounts?.attendance || 0}
                    </Typography>
                  )}
                </Box>
                <Box 
                  sx={{ 
                    bgcolor: alpha('#ff9800', 0.15), 
                    p: 1, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <EventIcon sx={{ color: '#ffb74d', fontSize: 28 }} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {dashboardData?.todayCounts?.presentUsers || 0} present, {dashboardData?.todayCounts?.lateUsers || 0} late
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: 'rgba(25, 35, 60, 0.6)',
            borderRadius: 2,
            border: '1px solid rgba(100, 180, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
            },
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                    Location Updates
                  </Typography>
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: '#ef5350', my: 1 }} />
                  ) : (
                    <Typography variant="h4" sx={{ color: '#fff', fontWeight: 600 }}>
                      {dashboardData?.todayCounts?.locations || 0}
                    </Typography>
                  )}
                </Box>
                <Box 
                  sx={{ 
                    bgcolor: alpha('#f44336', 0.15), 
                    p: 1, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LocationOnIcon sx={{ color: '#ef5350', fontSize: 28 }} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Today's location check-ins
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Tabs for different analytics views */}
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{
            mb: 3,
            '& .MuiTabs-indicator': {
              backgroundColor: '#1e88e5',
            },
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.5)',
              '&.Mui-selected': {
                color: '#90caf9',
              },
            },
          }}
        >
          <Tab label="Attendance" />
          <Tab label="User Activity" />
          <Tab label="Departments" />
          <Tab label="Locations" />
        </Tabs>
      </Box>
      
      {/* Attendance Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ 
              bgcolor: 'rgba(25, 35, 60, 0.6)',
              borderRadius: 2,
              border: '1px solid rgba(100, 180, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              height: '100%',
            }}>
              <CardHeader 
                title={
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    Weekly Attendance Trends
                  </Typography>
                } 
                action={
                  <Box sx={{ display: 'flex' }}>
                    <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)', ml: 1 }}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                }
                sx={{ 
                  borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                  pb: 1,
                }}
              />
              <CardContent>
                {loading ? (
                  <LoadingPlaceholder height={300} message="Loading attendance data..." />
                ) : dashboardData?.weeklyAttendance ? (
                  <AttendanceBarChart data={dashboardData.weeklyAttendance} height={300} />
                ) : (
                  <Box
                    sx={{
                      height: 300,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      bgcolor: 'rgba(0, 0, 0, 0.1)',
                      borderRadius: 2,
                      border: '1px dashed rgba(100, 180, 255, 0.2)',
                    }}
                  >
                    <ErrorIcon sx={{ fontSize: 40, color: 'rgba(100, 180, 255, 0.6)', mb: 1 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      No attendance data available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              bgcolor: 'rgba(25, 35, 60, 0.6)',
              borderRadius: 2,
              border: '1px solid rgba(100, 180, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              height: '100%',
            }}>
              <CardHeader 
                title={
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    Today's Attendance Status
                  </Typography>
                } 
                action={
                  <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                }
                sx={{ 
                  borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                  pb: 1,
                }}
              />
              <CardContent>
                {loading ? (
                  <LoadingPlaceholder height={300} message="Loading status data..." />
                ) : dashboardData?.todayCounts ? (
                  <StatusPieChart data={dashboardData.todayCounts} height={300} />
                ) : (
                  <Box
                    sx={{
                      height: 300,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      bgcolor: 'rgba(0, 0, 0, 0.1)',
                      borderRadius: 2,
                      border: '1px dashed rgba(100, 180, 255, 0.2)',
                    }}
                  >
                    <ErrorIcon sx={{ fontSize: 40, color: 'rgba(100, 180, 255, 0.6)', mb: 1 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      No status data available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card sx={{ 
              bgcolor: 'rgba(25, 35, 60, 0.6)',
              borderRadius: 2,
              border: '1px solid rgba(100, 180, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}>
              <CardHeader 
                title={
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    Recent Activities
                  </Typography>
                } 
                action={
                  <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                }
                sx={{ 
                  borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                  pb: 1,
                }}
              />
              <CardContent>
                {loading ? (
                  <LoadingPlaceholder height={200} message="Loading activities..." />
                ) : dashboardData?.recentActivities && dashboardData.recentActivities.length > 0 ? (
                  <Box sx={{ width: '100%', overflow: 'auto' }}>
                    <Box sx={{ minWidth: 600 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        p: 1.5, 
                        borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                        bgcolor: 'rgba(0, 0, 0, 0.2)',
                      }}>
                        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', width: '30%' }}>
                          User
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', width: '30%' }}>
                          Action
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', width: '20%' }}>
                          Type
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', width: '20%', textAlign: 'right' }}>
                          Time
                        </Typography>
                      </Box>
                      
                      {dashboardData.recentActivities.map((activity, index) => (
                        <Box 
                          key={activity.id || index}
                          sx={{ 
                            display: 'flex', 
                            p: 1.5, 
                            borderBottom: '1px solid rgba(100, 180, 255, 0.05)',
                            '&:hover': {
                              bgcolor: 'rgba(100, 180, 255, 0.05)',
                            }
                          }}
                        >
                          <Typography variant="body2" sx={{ color: '#fff', width: '30%', fontWeight: 500 }}>
                            {activity.user}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#fff', width: '30%' }}>
                            {activity.action}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#fff', width: '20%' }}>
                            <Chip 
                              label={activity.type} 
                              size="small"
                              sx={{ 
                                bgcolor: activity.type === 'admin_login' ? alpha('#1e88e5', 0.15) : 
                                        activity.type === 'attendance' ? alpha('#4caf50', 0.15) : 
                                        alpha('#ff9800', 0.15),
                                color: activity.type === 'admin_login' ? '#42a5f5' : 
                                       activity.type === 'attendance' ? '#66bb6a' : 
                                       '#ffb74d',
                                height: 20,
                                fontSize: '0.7rem',
                              }}
                            />
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#fff', width: '20%', textAlign: 'right' }}>
                            {new Date(activity.time).toLocaleString()}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      bgcolor: 'rgba(0, 0, 0, 0.1)',
                      borderRadius: 2,
                      border: '1px dashed rgba(100, 180, 255, 0.2)',
                    }}
                  >
                    <ErrorIcon sx={{ fontSize: 40, color: 'rgba(100, 180, 255, 0.6)', mb: 1 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      No recent activities found
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* User Activity Tab */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Card sx={{ 
              bgcolor: 'rgba(25, 35, 60, 0.6)',
              borderRadius: 2,
              border: '1px solid rgba(100, 180, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}>
              <CardHeader 
                title={
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    User Activity Over Time
                  </Typography>
                } 
                action={
                  <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                }
                sx={{ 
                  borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                  pb: 1,
                }}
              />
              <CardContent>
                {loading ? (
                  <LoadingPlaceholder height={300} message="Loading activity data..." />
                ) : (
                  <UserActivityLineChart data={generateUserActivityData()} height={300} />
                )}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Card sx={{ 
              bgcolor: 'rgba(25, 35, 60, 0.6)',
              borderRadius: 2,
              border: '1px solid rgba(100, 180, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}>
              <CardHeader 
                title={
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    Active Users
                  </Typography>
                } 
                action={
                  <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                }
                sx={{ 
                  borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                  pb: 1,
                }}
              />
              <CardContent sx={{ px: 1 }}>
                {loading ? (
                  <LoadingPlaceholder height={300} message="Loading user data..." />
                ) : users && users.length > 0 ? (
                  <List>
                    {users.slice(0, 5).map((user, index) => (
                      <ListItem 
                        key={user._id || index}
                        sx={{ 
                          borderBottom: index !== Math.min(users.length, 5) - 1 ? '1px solid rgba(100, 180, 255, 0.05)' : 'none',
                          py: 1.5,
                        }}
                      >
                        <ListItemIcon>
                          <Avatar 
                            sx={{ 
                              bgcolor: user.is_active ? '#4caf50' : '#f44336',
                              width: 40,
                              height: 40,
                            }}
                          >
                            {user.name.charAt(0)}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                                {user.name}
                              </Typography>
                              <Chip 
                                label={user.is_active ? 'Active' : 'Inactive'} 
                                size="small"
                                sx={{ 
                                  ml: 1, 
                                  bgcolor: user.is_active ? alpha('#4caf50', 0.15) : alpha('#f44336', 0.15),
                                  color: user.is_active ? '#66bb6a' : '#ef5350',
                                  height: 20,
                                  fontSize: '0.7rem',
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              {user.department} • {user.mobile}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box
                    sx={{
                      height: 300,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      bgcolor: 'rgba(0, 0, 0, 0.1)',
                      borderRadius: 2,
                      border: '1px dashed rgba(100, 180, 255, 0.2)',
                    }}
                  >
                    <ErrorIcon sx={{ fontSize: 40, color: 'rgba(100, 180, 255, 0.6)', mb: 1 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      No user data available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Departments Tab */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              bgcolor: 'rgba(25, 35, 60, 0.6)',
              borderRadius: 2,
              border: '1px solid rgba(100, 180, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              height: '100%',
            }}>
              <CardHeader 
                title={
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    Department Distribution
                  </Typography>
                } 
                action={
                  <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                }
                sx={{ 
                  borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                  pb: 1,
                }}
              />
              <CardContent>
                {loading ? (
                  <LoadingPlaceholder height={300} message="Loading department data..." />
                ) : (
                  <DepartmentDistributionChart users={users} height={300} />
                )}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              bgcolor: 'rgba(25, 35, 60, 0.6)',
              borderRadius: 2,
              border: '1px solid rgba(100, 180, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              height: '100%',
            }}>
              <CardHeader 
                title={
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    Department Statistics
                  </Typography>
                } 
                action={
                  <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                }
                sx={{ 
                  borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                  pb: 1,
                }}
              />
              <CardContent>
                {loading ? (
                  <LoadingPlaceholder height={300} message="Loading statistics..." />
                ) : users && users.length > 0 ? (
                  <Box sx={{ width: '100%', overflow: 'auto' }}>
                    <Box sx={{ minWidth: 400 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        p: 1.5, 
                        borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                        bgcolor: 'rgba(0, 0, 0, 0.2)',
                      }}>
                        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', width: '40%' }}>
                          Department
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', width: '20%', textAlign: 'center' }}>
                          Users
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', width: '20%', textAlign: 'center' }}>
                          Active
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', width: '20%', textAlign: 'center' }}>
                          % Active
                        </Typography>
                      </Box>
                      
                      {/* Group users by department */}
                      {Object.entries(users.reduce((acc, user) => {
                        const dept = user.department || 'Unknown';
                        if (!acc[dept]) {
                          acc[dept] = { total: 0, active: 0 };
                        }
                        acc[dept].total++;
                        if (user.is_active) {
                          acc[dept].active++;
                        }
                        return acc;
                      }, {})).map(([dept, stats], index) => (
                        <Box 
                          key={index}
                          sx={{ 
                            display: 'flex', 
                            p: 1.5, 
                            borderBottom: '1px solid rgba(100, 180, 255, 0.05)',
                            '&:hover': {
                              bgcolor: 'rgba(100, 180, 255, 0.05)',
                            }
                          }}
                        >
                          <Typography variant="body2" sx={{ color: '#fff', width: '40%', fontWeight: 500 }}>
                            {dept}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#fff', width: '20%', textAlign: 'center' }}>
                            {stats.total}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#fff', width: '20%', textAlign: 'center' }}>
                            {stats.active}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#fff', width: '20%', textAlign: 'center' }}>
                            {Math.round((stats.active / stats.total) * 100)}%
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: 300,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      bgcolor: 'rgba(0, 0, 0, 0.1)',
                      borderRadius: 2,
                      border: '1px dashed rgba(100, 180, 255, 0.2)',
                    }}
                  >
                    <ErrorIcon sx={{ fontSize: 40, color: 'rgba(100, 180, 255, 0.6)', mb: 1 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      No department data available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Locations Tab */}
      {tabValue === 3 && (
        <Box sx={{ 
          height: 400, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          bgcolor: 'rgba(25, 35, 60, 0.6)',
          borderRadius: 2,
          border: '1px solid rgba(100, 180, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}>
          <Box sx={{ 
            p: 2, 
            bgcolor: alpha('#1e88e5', 0.1), 
            borderRadius: '50%',
            mb: 2,
          }}>
            <LocationOnIcon sx={{ color: '#42a5f5', fontSize: 48 }} />
          </Box>
          <Typography variant="h5" sx={{ color: '#fff', mb: 1 }}>
            Location Analytics
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3, textAlign: 'center', maxWidth: 500 }}>
            This analytics section is coming soon. We're working on bringing you detailed insights about user locations and geographic trends.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 3, textAlign: 'center', maxWidth: 500 }}>
            Total location updates today: {dashboardData?.todayCounts?.locations || 0}
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#1e88e5',
              '&:hover': {
                bgcolor: '#1976d2',
              },
              borderRadius: 2,
              px: 3,
            }}
          >
            Explore Available Analytics
          </Button>
        </Box>
      )}
    </motion.div>
  );
};

export default Analytics;