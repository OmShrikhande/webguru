import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  alpha
} from '@mui/material';
import { 
  People as PeopleIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  LocationOn as LocationOnIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';
// import Grid from '@mui/material/Unstable_Grid2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const MasterDashboard = () => {
  const theme = useTheme();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalCounts: {
      admins: 0,
      users: 0,
      attendance: 0,
      locations: 0,
      visitLocations: 0
    },
    todayCounts: {
      attendance: 0,
      locations: 0,
      visitLocations: 0,
      activeUsers: 0,
      presentUsers: 0,
      absentUsers: 0,
      lateUsers: 0
    },
    recentActivities: [],
    weeklyAttendance: []
  });

  // Fetch dashboard stats on component mount
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Fetch dashboard stats from API
  const fetchDashboardStats = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = getToken();
      const response = await axios.get('http://localhost:5000/api/master/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setStats(response.data.stats);
      } else {
        setError(response.data.message || 'Failed to fetch dashboard statistics');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError(error.response?.data?.message || 'An error occurred while fetching dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data for weekly attendance
  const chartData = {
    labels: stats.weeklyAttendance.map(day => day.date),
    datasets: [
      {
        label: 'Present',
        data: stats.weeklyAttendance.map(day => day.present),
        borderColor: '#4caf50',
        backgroundColor: alpha('#4caf50', 0.1),
        fill: true,
        tension: 0.4
      },
      {
        label: 'Absent',
        data: stats.weeklyAttendance.map(day => day.absent),
        borderColor: '#f44336',
        backgroundColor: alpha('#f44336', 0.1),
        fill: true,
        tension: 0.4
      },
      {
        label: 'Late',
        data: stats.weeklyAttendance.map(day => day.late),
        borderColor: '#ff9800',
        backgroundColor: alpha('#ff9800', 0.1),
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(25, 35, 60, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Box sx={{ mb: 4 }}>
        <motion.div variants={itemVariants}>
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
            Master Dashboard
          </Typography>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
            Overview of your entire system, including admins, users, and attendance
          </Typography>
        </motion.div>
      </Box>
      
      <Grid container spacing={3}>
        {/* Stats Cards - First Row */}
        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={itemVariants}>
            <Card sx={{ 
              bgcolor: 'rgba(25, 35, 60, 0.6)',
              borderRadius: 2,
              border: '1px solid rgba(100, 180, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: alpha('#1e88e5', 0.1),
                    zIndex: 0,
                  }} 
                />
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" gutterBottom>
                  Total Admins
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AdminPanelSettingsIcon sx={{ fontSize: 32, color: '#42a5f5', mr: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 600, color: '#fff' }}>
                    {stats.totalCounts.admins}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1, display: 'block' }}>
                  System administrators
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={itemVariants}>
            <Card sx={{ 
              bgcolor: 'rgba(25, 35, 60, 0.6)',
              borderRadius: 2,
              border: '1px solid rgba(100, 180, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: alpha('#4caf50', 0.1),
                    zIndex: 0,
                  }} 
                />
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" gutterBottom>
                  Total Users
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PeopleIcon sx={{ fontSize: 32, color: '#66bb6a', mr: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 600, color: '#fff' }}>
                    {stats.totalCounts.users}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1, display: 'block' }}>
                  Registered users
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={itemVariants}>
            <Card sx={{ 
              bgcolor: 'rgba(25, 35, 60, 0.6)',
              borderRadius: 2,
              border: '1px solid rgba(100, 180, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: alpha('#ff9800', 0.1),
                    zIndex: 0,
                  }} 
                />
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" gutterBottom>
                  Today's Attendance
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarTodayIcon sx={{ fontSize: 32, color: '#ffb74d', mr: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 600, color: '#fff' }}>
                    {stats.todayCounts.attendance}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1, display: 'block' }}>
                  Records today
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={itemVariants}>
            <Card sx={{ 
              bgcolor: 'rgba(25, 35, 60, 0.6)',
              borderRadius: 2,
              border: '1px solid rgba(100, 180, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: alpha('#f44336', 0.1),
                    zIndex: 0,
                  }} 
                />
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" gutterBottom>
                  Active Users
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ fontSize: 32, color: '#ef5350', mr: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 600, color: '#fff' }}>
                    {stats.todayCounts.activeUsers}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1, display: 'block' }}>
                  Users active today
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        
        {/* Stats Cards - Second Row */}
        <Grid item xs={12} sm={6} md={4}>
          <motion.div variants={itemVariants}>
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
                    Today's Attendance Breakdown
                  </Typography>
                }
                sx={{ pb: 0 }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Avatar sx={{ bgcolor: alpha('#4caf50', 0.2), mx: 'auto', mb: 1 }}>
                        <CheckCircleIcon sx={{ color: '#4caf50' }} />
                      </Avatar>
                      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600 }}>
                        {stats.todayCounts.presentUsers}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Present
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Avatar sx={{ bgcolor: alpha('#f44336', 0.2), mx: 'auto', mb: 1 }}>
                        <CancelIcon sx={{ color: '#f44336' }} />
                      </Avatar>
                      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600 }}>
                        {stats.todayCounts.absentUsers}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Absent
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Avatar sx={{ bgcolor: alpha('#ff9800', 0.2), mx: 'auto', mb: 1 }}>
                        <ScheduleIcon sx={{ color: '#ff9800' }} />
                      </Avatar>
                      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600 }}>
                        {stats.todayCounts.lateUsers}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Late
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <motion.div variants={itemVariants}>
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
                    Location Tracking
                  </Typography>
                }
                sx={{ pb: 0 }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Avatar sx={{ bgcolor: alpha('#2196f3', 0.2), mx: 'auto', mb: 1 }}>
                        <LocationOnIcon sx={{ color: '#2196f3' }} />
                      </Avatar>
                      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600 }}>
                        {stats.todayCounts.locations}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Locations Today
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Avatar sx={{ bgcolor: alpha('#9c27b0', 0.2), mx: 'auto', mb: 1 }}>
                        <EventIcon sx={{ color: '#9c27b0' }} />
                      </Avatar>
                      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600 }}>
                        {stats.todayCounts.visitLocations}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Visit Locations
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2, p: 1, bgcolor: alpha('#2196f3', 0.1), borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', textAlign: 'center' }}>
                    Total tracked locations: {stats.totalCounts.locations}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <motion.div variants={itemVariants}>
            <Card sx={{ 
              bgcolor: 'rgba(25, 35, 60, 0.6)',
              borderRadius: 2,
              border: '1px solid rgba(100, 180, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <CardHeader 
                title={
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    System Status
                  </Typography>
                }
                action={
                  <Tooltip title="Refresh Data">
                    <IconButton onClick={fetchDashboardStats} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                }
                sx={{ pb: 0 }}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Chip 
                    label="System Online" 
                    color="success" 
                    icon={<CheckCircleIcon />} 
                    sx={{ px: 2, py: 2.5, fontSize: '1rem' }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<TimelineIcon />}
                    sx={{ 
                      color: 'white',
                      borderColor: alpha('#fff', 0.3),
                      '&:hover': {
                        borderColor: '#fff',
                        bgcolor: alpha('#fff', 0.1)
                      }
                    }}
                  >
                    View Reports
                  </Button>
                  <Button 
                    variant="contained" 
                    startIcon={<PeopleIcon />}
                    sx={{ 
                      bgcolor: theme.palette.primary.main,
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark
                      }
                    }}
                  >
                    Manage Users
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        
        {/* Weekly Attendance Chart */}
        <Grid item xs={12} md={8}>
          <motion.div variants={itemVariants}>
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
                sx={{ pb: 0 }}
              />
              <CardContent>
                <Box sx={{ height: 300, p: 1 }}>
                  {stats.weeklyAttendance.length > 0 ? (
                    <Line data={chartData} options={chartOptions} />
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        No attendance data available for the past week
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        
        {/* Recent Activities */}
        <Grid item xs={12} md={4}>
          <motion.div variants={itemVariants}>
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
                    Recent Activities
                  </Typography>
                }
                sx={{ pb: 0 }}
              />
              <CardContent sx={{ maxHeight: 300, overflow: 'auto' }}>
                <List sx={{ p: 0 }}>
                  {stats.recentActivities.length > 0 ? (
                    stats.recentActivities.map((activity, index) => (
                      <React.Fragment key={activity.id}>
                        <ListItem alignItems="flex-start" sx={{ px: 1 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ 
                              bgcolor: activity.type === 'admin_login' 
                                ? alpha('#1e88e5', 0.2) 
                                : activity.type === 'attendance' 
                                  ? alpha('#4caf50', 0.2) 
                                  : alpha('#ff9800', 0.2),
                              color: activity.type === 'admin_login' 
                                ? '#1e88e5' 
                                : activity.type === 'attendance' 
                                  ? '#4caf50' 
                                  : '#ff9800'
                            }}>
                              {activity.type === 'admin_login' 
                                ? <AdminPanelSettingsIcon /> 
                                : activity.type === 'attendance' 
                                  ? <EventAvailableIcon /> 
                                  : <LocationOnIcon />}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="body1" sx={{ color: '#fff' }}>
                                {activity.user}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Typography variant="body2" component="span" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                  {activity.action}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                  {new Date(activity.time).toLocaleString()}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        {index < stats.recentActivities.length - 1 && (
                          <Divider variant="inset" component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', py: 4 }}>
                      No recent activities
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default MasterDashboard;