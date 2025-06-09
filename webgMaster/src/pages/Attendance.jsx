import React, { useState } from 'react';
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
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Avatar,
  Tooltip,
  Alert,
  Badge,
  alpha,
  CircularProgress,
  Divider
} from '@mui/material';
import { 
  AccessTime as AccessTimeIcon,
  Today as TodayIcon,
  Event as EventIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  DateRange as DateRangeIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Save as SaveIcon,
  PersonAdd as PersonAddIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Dummy data generator for attendance records
const generateAttendanceData = () => {
  const users = [
    { id: 1, name: 'John Smith', email: 'john.smith@example.com', department: 'IT', role: 'Employee' },
    { id: 2, name: 'Emma Johnson', email: 'emma.johnson@example.com', department: 'HR', role: 'Manager' },
    { id: 3, name: 'Michael Williams', email: 'michael.williams@example.com', department: 'Finance', role: 'Employee' },
    { id: 4, name: 'Olivia Brown', email: 'olivia.brown@example.com', department: 'Marketing', role: 'Admin' },
    { id: 5, name: 'William Jones', email: 'william.jones@example.com', department: 'Sales', role: 'Employee' },
    { id: 6, name: 'Sophia Miller', email: 'sophia.miller@example.com', department: 'IT', role: 'Employee' },
    { id: 7, name: 'James Davis', email: 'james.davis@example.com', department: 'Operations', role: 'Manager' },
    { id: 8, name: 'Isabella Garcia', email: 'isabella.garcia@example.com', department: 'Customer Support', role: 'Employee' },
  ];
  
  const statuses = ['Present', 'Absent', 'Late', 'Half Day', 'Vacation', 'Sick Leave'];
  const statusColors = {
    'Present': { color: '#66bb6a', bg: alpha('#4caf50', 0.15) },
    'Absent': { color: '#ef5350', bg: alpha('#f44336', 0.15) },
    'Late': { color: '#ffb74d', bg: alpha('#ff9800', 0.15) },
    'Half Day': { color: '#9575cd', bg: alpha('#673ab7', 0.15) },
    'Vacation': { color: '#42a5f5', bg: alpha('#2196f3', 0.15) },
    'Sick Leave': { color: '#f06292', bg: alpha('#e91e63', 0.15) }
  };
  
  // Generate a month's worth of attendance for each user
  const attendance = [];
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  for (const user of users) {
    for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
      // Skip weekends
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      
      // If date is in the future, skip
      if (d > today) continue;
      
      const randomIndex = Math.floor(Math.random() * 100);
      let status;
      
      // Weighted distribution
      if (randomIndex < 70) {
        status = 'Present';
      } else if (randomIndex < 75) {
        status = 'Absent';
      } else if (randomIndex < 85) {
        status = 'Late';
      } else if (randomIndex < 90) {
        status = 'Half Day';
      } else if (randomIndex < 95) {
        status = 'Vacation';
      } else {
        status = 'Sick Leave';
      }
      
      const checkInTime = status === 'Present' || status === 'Late' || status === 'Half Day' ? 
        new Date(new Date(d).setHours(8 + (status === 'Late' ? 1 : 0), Math.floor(Math.random() * 30), 0)) : null;
      
      const checkOutTime = status === 'Present' || status === 'Half Day' ? 
        new Date(new Date(d).setHours(status === 'Half Day' ? 12 : 17, 30 + Math.floor(Math.random() * 30), 0)) : null;
      
      // Calculate work hours
      const workHours = checkInTime && checkOutTime ? 
        ((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(2) : 0;
      
      attendance.push({
        id: attendance.length + 1,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userDepartment: user.department,
        userRole: user.role,
        date: new Date(d),
        status,
        statusColor: statusColors[status],
        checkInTime,
        checkOutTime,
        workHours: parseFloat(workHours),
        notes: status !== 'Present' ? `Employee ${status.toLowerCase()}` : '',
      });
    }
  }
  
  return attendance;
};

const AttendanceSummary = ({ data }) => {
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];
  
  // Filter today's attendance
  const todayAttendance = data.filter(record => 
    new Date(record.date).toISOString().split('T')[0] === todayFormatted
  );
  
  // Calculate statistics
  const totalEmployees = [...new Set(data.map(record => record.userId))].length;
  const presentToday = todayAttendance.filter(record => record.status === 'Present').length;
  const absentToday = todayAttendance.filter(record => record.status === 'Absent').length;
  const lateToday = todayAttendance.filter(record => record.status === 'Late').length;
  const onLeaveToday = todayAttendance.filter(record => 
    record.status === 'Vacation' || record.status === 'Sick Leave'
  ).length;
  
  // Calculate attendance rate
  const attendanceRate = totalEmployees > 0 ? 
    Math.round((presentToday / totalEmployees) * 100) : 0;
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
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
              Total Employees
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleIcon sx={{ fontSize: 32, color: '#42a5f5', mr: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#fff' }}>
                {totalEmployees}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1, display: 'block' }}>
              Last updated: {today.toLocaleTimeString()}
            </Typography>
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
              Present Today
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 32, color: '#66bb6a', mr: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#fff' }}>
                {presentToday}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                <CircularProgress
                  variant="determinate"
                  value={attendanceRate}
                  size={36}
                  thickness={4}
                  sx={{ color: '#66bb6a' }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
                    {attendanceRate}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Attendance Rate
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
              Absent / Late
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EventBusyIcon sx={{ fontSize: 32, color: '#ef5350', mr: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#fff' }}>
                {absentToday + lateToday}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', mt: 1 }}>
              <Chip 
                label={`${absentToday} Absent`} 
                size="small" 
                sx={{ 
                  bgcolor: alpha('#f44336', 0.15), 
                  color: '#ef5350',
                  fontSize: '0.7rem',
                  mr: 1,
                }} 
              />
              <Chip 
                label={`${lateToday} Late`} 
                size="small" 
                sx={{ 
                  bgcolor: alpha('#ff9800', 0.15), 
                  color: '#ffb74d',
                  fontSize: '0.7rem',
                }} 
              />
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
                bgcolor: alpha('#2196f3', 0.1),
                zIndex: 0,
              }} 
            />
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" gutterBottom>
              On Leave
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EventAvailableIcon sx={{ fontSize: 32, color: '#42a5f5', mr: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#fff' }}>
                {onLeaveToday}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1, display: 'block' }}>
              {today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

const Attendance = () => {
  const [attendanceData] = useState(generateAttendanceData());
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [date, setDate] = useState(new Date());
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  
  // Handle filter menu
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    handleFilterClose();
  };
  
  const handleDepartmentFilterChange = (dept) => {
    setDepartmentFilter(dept);
    handleFilterClose();
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Filter attendance data
  const getFilteredAttendance = () => {
    let filtered = [...attendanceData];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.userDepartment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by date
    if (date) {
      const dateString = date.toISOString().split('T')[0];
      filtered = filtered.filter(record => 
        new Date(record.date).toISOString().split('T')[0] === dateString
      );
    }
    
    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }
    
    // Filter by department
    if (departmentFilter !== 'All') {
      filtered = filtered.filter(record => record.userDepartment === departmentFilter);
    }
    
    return filtered;
  };
  
  // Get unique departments from data
  const departments = ['All', ...new Set(attendanceData.map(record => record.userDepartment))];
  
  // Statuses with their colors
  const statuses = [
    { name: 'All', color: '#fff', bg: 'transparent' },
    { name: 'Present', color: '#66bb6a', bg: alpha('#4caf50', 0.15) },
    { name: 'Absent', color: '#ef5350', bg: alpha('#f44336', 0.15) },
    { name: 'Late', color: '#ffb74d', bg: alpha('#ff9800', 0.15) },
    { name: 'Half Day', color: '#9575cd', bg: alpha('#673ab7', 0.15) },
    { name: 'Vacation', color: '#42a5f5', bg: alpha('#2196f3', 0.15) },
    { name: 'Sick Leave', color: '#f06292', bg: alpha('#e91e63', 0.15) }
  ];
  
  const filteredAttendance = getFilteredAttendance();
  
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
            Attendance Management
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Track employee attendance and manage time records.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: '#1e88e5',
              '&:hover': {
                bgcolor: '#1976d2',
              },
              borderRadius: 2,
            }}
          >
            Record Attendance
          </Button>
        </Box>
      </Box>
      
      {/* Attendance Summary */}
      <Box sx={{ mb: 3 }}>
        <AttendanceSummary data={attendanceData} />
      </Box>
      
      {/* Tabs for different views */}
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
          <Tab label="Daily Attendance" icon={<TodayIcon />} iconPosition="start" />
          <Tab label="Monthly View" icon={<DateRangeIcon />} iconPosition="start" />
          <Tab label="Reports" icon={<ScheduleIcon />} iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* Daily Attendance View */}
      {tabValue === 0 && (
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
                Daily Attendance Record
              </Typography>
            } 
            action={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField 
                  type="date"
                  value={date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(new Date(e.target.value))}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TodayIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: 180,
                    mr: 2,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(0, 0, 0, 0.2)',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(100, 180, 255, 0.3)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1e88e5',
                      },
                      '& .MuiOutlinedInput-input': {
                        color: '#fff',
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    }
                  }}
                />
                
                <TextField
                  placeholder="Search employees..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: 200,
                    mr: 2,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(0, 0, 0, 0.2)',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(100, 180, 255, 0.3)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1e88e5',
                      },
                      '& .MuiOutlinedInput-input': {
                        color: '#fff',
                      }
                    },
                  }}
                />
                
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
                    },
                    mr: 1,
                  }}
                >
                  Filter
                </Button>
                
                <IconButton 
                  size="small" 
                  sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1 }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Box>
            }
            sx={{ 
              borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
              pb: 1,
            }}
          />
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th': { borderBottom: '1px solid rgba(100, 180, 255, 0.1)' } }}>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Employee</TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Department</TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Status</TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Check In</TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Check Out</TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Work Hours</TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Notes</TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAttendance.map((record, index) => (
                    <TableRow 
                      key={index}
                      sx={{ 
                        '& td': { borderBottom: '1px solid rgba(100, 180, 255, 0.05)' },
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)' },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              width: 30, 
                              height: 30, 
                              mr: 1,
                              bgcolor: 
                                record.userRole === 'Admin' ? '#1e88e5' : 
                                record.userRole === 'Manager' ? '#43a047' : '#ff9800',
                            }}
                          >
                            {record.userName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                              {record.userName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              {record.userEmail}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                          {record.userDepartment}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={record.status} 
                          size="small"
                          sx={{ 
                            bgcolor: record.statusColor.bg,
                            color: record.statusColor.color,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                          {record.checkInTime ? record.checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                          {record.checkOutTime ? record.checkOutTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                          {record.workHours ? record.workHours.toFixed(2) : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                          {record.notes || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {filteredAttendance.length === 0 && (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  No attendance records found for the selected criteria.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Monthly View Tab - Placeholder */}
      {tabValue === 1 && (
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
            <DateRangeIcon sx={{ color: '#42a5f5', fontSize: 48 }} />
          </Box>
          <Typography variant="h5" sx={{ color: '#fff', mb: 1 }}>
            Monthly Attendance Calendar
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3, textAlign: 'center', maxWidth: 500 }}>
            View attendance patterns and trends across the entire month with our calendar view. Coming soon.
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
            View Daily Attendance
          </Button>
        </Box>
      )}
      
      {/* Reports Tab - Placeholder */}
      {tabValue === 2 && (
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
            <ScheduleIcon sx={{ color: '#42a5f5', fontSize: 48 }} />
          </Box>
          <Typography variant="h5" sx={{ color: '#fff', mb: 1 }}>
            Attendance Reports
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3, textAlign: 'center', maxWidth: 500 }}>
            Generate detailed attendance reports, analyze trends, and export data for HR purposes. Coming soon.
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
            View Sample Report
          </Button>
        </Box>
      )}
      
      {/* Filter Menu */}
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
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
          Filter by Status
        </Typography>
        {statuses.map((status) => (
          <MenuItem 
            key={status.name} 
            onClick={() => handleStatusFilterChange(status.name)}
            selected={statusFilter === status.name}
          >
            {status.name !== 'All' ? (
              <Chip 
                label={status.name} 
                size="small"
                sx={{ 
                  bgcolor: status.bg,
                  color: status.color,
                }}
              />
            ) : (
              <Typography variant="body2" sx={{ color: '#fff' }}>All Statuses</Typography>
            )}
          </MenuItem>
        ))}
        
        <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
          Filter by Department
        </Typography>
        {departments.map((dept) => (
          <MenuItem 
            key={dept} 
            onClick={() => handleDepartmentFilterChange(dept)}
            selected={departmentFilter === dept}
          >
            <Typography variant="body2" sx={{ color: '#fff' }}>{dept}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </motion.div>
  );
};

export default Attendance;