import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  alpha,
  useTheme
} from '@mui/material';
import { 
  People as PeopleIcon, 
  Bolt as BoltIcon, 
  AccessTime as AccessTimeIcon, 
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Computer as ComputerIcon,
  Assignment as AssignmentIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import StatCard from '../components/dashboard/StatCard';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import UserPerformanceChart from '../components/dashboard/UserPerformanceChart';
import UserLocationMap from '../components/dashboard/UserLocationMap';
import AttendanceTable from '../components/dashboard/AttendanceTable';

// Mock data for user performance chart
const generatePerformanceData = () => {
  return {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active Users',
        data: [65, 59, 80, 81, 56, 55, 70],
        borderColor: '#2196f3',
        backgroundColor: alpha('#2196f3', 0.2),
        pointBackgroundColor: '#fff',
        pointBorderColor: '#2196f3',
        fill: true,
      },
      {
        label: 'Admin Activity',
        data: [28, 48, 40, 19, 45, 27, 32],
        borderColor: '#ff9800',
        backgroundColor: alpha('#ff9800', 0.1),
        pointBackgroundColor: '#fff',
        pointBorderColor: '#ff9800',
        fill: true,
      },
    ],
  };
};

// Mock data for user activities
const generateActivities = () => {
  return [
    {
      title: 'John Doe logged in',
      description: 'User logged in from a new device',
      time: '10 mins ago',
      icon: <PersonIcon fontSize="small" />,
      color: '#2196f3',
      location: 'New York, NY'
    },
    {
      title: 'Admin Updated Settings',
      description: 'Security settings were updated by admin',
      time: '1 hour ago',
      icon: <ComputerIcon fontSize="small" />,
      color: '#f44336'
    },
    {
      title: 'New User Registered',
      description: 'Alice Smith completed registration',
      time: '2 hours ago',
      icon: <AccountCircleIcon fontSize="small" />,
      color: '#4caf50',
      location: 'Chicago, IL'
    },
    {
      title: 'Report Generated',
      description: 'Monthly performance report was generated',
      time: '5 hours ago',
      icon: <AssignmentIcon fontSize="small" />,
      color: '#ff9800'
    },
  ];
};

// Mock data for user locations
const generateUserLocations = () => {
  return [
    { x: 25, y: 30, id: 1, online: true },
    { x: 70, y: 40, id: 2, online: true },
    { x: 40, y: 70, id: 3, online: false },
    { x: 60, y: 20, id: 4, online: true },
    { x: 80, y: 65, id: 5, online: false },
  ];
};

// Mock data for attendance
const generateAttendanceData = () => {
  return [
    {
      id: 1,
      user: { name: 'John Doe', role: 'Developer', avatar: '' },
      checkInTime: '09:00 AM',
      checkOutTime: '05:30 PM',
      location: 'New York Office',
      status: 'Present',
      workHours: 8.5,
    },
    {
      id: 2,
      user: { name: 'Jane Smith', role: 'Designer', avatar: '' },
      checkInTime: '09:45 AM',
      checkOutTime: '06:15 PM',
      location: 'Remote - San Francisco',
      status: 'Late',
      workHours: 7.5,
    },
    {
      id: 3,
      user: { name: 'Mark Johnson', role: 'Manager', avatar: '' },
      checkInTime: '08:30 AM',
      checkOutTime: '05:45 PM',
      location: 'Chicago Office',
      status: 'Present',
      workHours: 9.25,
    },
    {
      id: 4,
      user: { name: 'Sarah Williams', role: 'Content Writer', avatar: '' },
      checkInTime: '10:15 AM',
      checkOutTime: null,
      location: 'Remote - Austin',
      status: 'Late',
      workHours: 4.75,
    },
    {
      id: 5,
      user: { name: 'Alex Brown', role: 'QA Engineer', avatar: '' },
      checkInTime: '09:05 AM',
      checkOutTime: '04:30 PM',
      location: 'Seattle Office',
      status: 'Present',
      workHours: 7.4,
    },
  ];
};

const Dashboard = () => {
  const theme = useTheme();
  
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
            Welcome back! Here's what's happening with your platform today.
          </Typography>
        </motion.div>
      </Box>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={itemVariants}>
            <StatCard 
              title="Total Users" 
              value="1,234" 
              icon={<PeopleIcon />} 
              color={theme.palette.primary.main}
              trendValue="12%"
              trendDirection="up"
              description="vs. last month"
            />
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={itemVariants}>
            <StatCard 
              title="Active Sessions" 
              value="425" 
              icon={<BoltIcon />} 
              color={theme.palette.success.main}
              trendValue="5%"
              trendDirection="up"
              description="vs. yesterday"
            />
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={itemVariants}>
            <StatCard 
              title="Avg. Session Time" 
              value="24 min" 
              icon={<AccessTimeIcon />} 
              color={theme.palette.warning.main}
              trendValue="3%"
              trendDirection="down"
              description="vs. last week"
            />
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={itemVariants}>
            <StatCard 
              title="Active Locations" 
              value="42" 
              icon={<LocationIcon />} 
              color={theme.palette.info.main}
              trendValue="8%"
              trendDirection="up"
              description="new locations"
            />
          </motion.div>
        </Grid>
        
        {/* Activity Timeline */}
        <Grid item xs={12} md={4}>
          <motion.div variants={itemVariants}>
            <ActivityTimeline activities={generateActivities()} />
          </motion.div>
        </Grid>
        
        {/* User Performance Chart */}
        <Grid item xs={12} md={8}>
          <motion.div variants={itemVariants}>
            <UserPerformanceChart data={generatePerformanceData()} />
          </motion.div>
        </Grid>
        
        {/* User Location Map */}
        <Grid item xs={12} md={6}>
          <motion.div variants={itemVariants}>
            <UserLocationMap userLocations={generateUserLocations()} />
          </motion.div>
        </Grid>
        
        {/* Attendance Table */}
        <Grid item xs={12} md={6}>
          <motion.div variants={itemVariants}>
            <AttendanceTable data={generateAttendanceData()} />
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default Dashboard;