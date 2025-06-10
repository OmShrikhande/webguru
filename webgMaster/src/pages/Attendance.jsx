import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 

  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  Avatar,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
  Button
} from '@mui/material';
import { 
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  EventBusy as EventBusyIcon,
  EventAvailable as EventAvailableIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AttendanceSummary = ({ data }) => {
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];
  
  // Filter today's attendance
  const todayAttendance = data.filter(record => 
    new Date(record.date).toISOString().split('T')[0] === todayFormatted
  );
  
  // Calculate statistics
  const totalEmployees = [...new Set(data.map(record => record.userId))].length;
  const presentToday = todayAttendance.filter(record => record.status === 'present').length;
  const absentToday = todayAttendance.filter(record => record.status === 'absent').length;
  const lateToday = todayAttendance.filter(record => record.status === 'late').length;
  const onLeaveToday = todayAttendance.filter(record => record.status === 'half-day').length;
  
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
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }
        const response = await axios.get('http://localhost:5000/api/users-attendance', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Transform API response to match table structure
      const transformedData = response.data.usersWithAttendance.flatMap(item =>
  item.weekAttendance.map(att => ({
    id: `${item.user.id}_${att.checkInTime || new Date().toISOString()}`,
    userId: item.user.id,
    userName: item.user.name,
    userEmail: item.user.email,
    userDepartment: item.user.department || 'N/A',
    userRole: 'Employee',
    date: new Date(att.date),
    status: att.status,
    statusColor: {
      present: { color: '#66bb6a', bg: alpha('#4caf50', 0.15) },
      absent: { color: '#ef5350', bg: alpha('#f44336', 0.15) },
      late: { color: '#ffb74d', bg: alpha('#ff9800', 0.15) },
      'half-day': { color: '#9575cd', bg: alpha('#673ab7', 0.15) }
    }[att.status] || { color: '#fff', bg: 'transparent' },
    checkInTime: att.checkInTime ? new Date(att.checkInTime) : null,
    checkOutTime: att.checkOutTime ? new Date(att.checkOutTime) : null,
    workHours: att.checkInTime && att.checkOutTime 
      ? ((new Date(att.checkOutTime) - new Date(att.checkInTime)) / (1000 * 60 * 60)).toFixed(2)
      : 0,
    notes: att.status !== 'present' ? `Employee ${att.status}` : ''
  }))
);

        setAttendanceData(transformedData);
      } catch (err) {
        console.error('Error fetching attendance data:', err);
        setError(err.message || 'Failed to fetch attendance data');
        // if (err.message.includes('token') || err.response?.status === 401) {
        //   navigate('/login');
        
        setAttendanceData([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [navigate]);

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
      </Box>

      {/* Error Display */}
      {error && (
        <Box sx={{ mb: 3 }}>
          <Alert 
            severity="error" 
            action={
              error.includes('token') ? (
                <Button color="inherit" size="small" onClick={() => navigate('/login')}>
                  Go to Login
                </Button>
              ) : null
            }
          >
            {error}
          </Alert>
        </Box>
      )}

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Attendance Summary */}
      {!loading && !error && (
        <Box sx={{ mb: 3 }}>
          <AttendanceSummary data={attendanceData} />
        </Box>
      )}

      {/* Daily Attendance Table */}
      {!loading && !error && (
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
                  {attendanceData.map((record, index) => (
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
                              bgcolor: record.userRole === 'Admin' ? '#1e88e5' : 
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
            
            {attendanceData.length === 0 && !loading && !error && (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  No attendance records found.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Commented out filter and tab-related code */}
      {/*
      const [searchTerm, setSearchTerm] = useState('');
      const [tabValue, setTabValue] = useState(0);
      const [date, setDate] = useState(new Date());
      const [filterAnchorEl, setFilterAnchorEl] = useState(null);
      const [statusFilter, setStatusFilter] = useState('All');
      const [departmentFilter, setDepartmentFilter] = useState('All');
      
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
      
      const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
      };
      
      const getFilteredAttendance = () => {
        let filtered = [...attendanceData];
        
        if (searchTerm) {
          filtered = filtered.filter(record => 
            record.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.userDepartment.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        if (date) {
          const dateString = date.toISOString().split('T')[0];
          filtered = filtered.filter(record => 
            new Date(record.date).toISOString().split('T')[0] === dateString
          );
        }
        
        if (statusFilter !== 'All') {
          filtered = filtered.filter(record => record.status === statusFilter);
        }
        
        if (departmentFilter !== 'All') {
          filtered = filtered.filter(record => record.userDepartment === departmentFilter);
        }
        
        return filtered;
      };
      
      const departments = ['All', ...new Set(attendanceData.map(record => record.userDepartment))];
      
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
      
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{
            mb: 3,
            '& .MuiTabs-indicator': { backgroundColor: '#1e88e5' },
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.5)',
              '&.Mui-selected': { color: '#90caf9' },
            },
          }}
        >
          <Tab label="Daily Attendance" icon={<TodayIcon />} iconPosition="start" />
          <Tab label="Monthly View" icon={<DateRangeIcon />} iconPosition="start" />
          <Tab label="Reports" icon={<ScheduleIcon />} iconPosition="start" />
        </Tabs>
      </Box>
      
      {tabValue === 1 && (
        <Box sx={{ ... }}>
          <Box sx={{ ... }}>
            <DateRangeIcon sx={{ color: '#42a5f5', fontSize: 48 }} />
          </Box>
          <Typography variant="h5" sx={{ color: '#fff', mb: 1 }}>
            Monthly Attendance Calendar
          </Typography>
          <Typography variant="body1" sx={{ ... }}>
            View attendance patterns and trends across the entire month with our calendar view. Coming soon.
          </Typography>
          <Button variant="contained" sx={{ ... }}>
            View Daily Attendance
          </Button>
        </Box>
      )}
      
      {tabValue === 2 && (
        <Box sx={{ ... }}>
          <Box sx={{ ... }}>
            <ScheduleIcon sx={{ color: '#42a5f5', fontSize: 48 }} />
          </Box>
          <Typography variant="h5" sx={{ color: '#fff', mb: 1 }}>
            Attendance Reports
          </Typography>
          <Typography variant="body1" sx={{ ... }}>
            Generate detailed attendance reports, analyze trends, and export data for HR purposes. Coming soon.
          </Typography>
          <Button variant="contained" sx={{ ... }}>
            View Sample Report
          </Button>
        </Box>
      )}
      
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
          sx={{ ... }}
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
          sx={{ ... }}
        />
        
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={handleFilterClick}
          sx={{ ... }}
        >
          Filter
        </Button>
        
        <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1 }}>
          <RefreshIcon fontSize="small" />
        </IconButton>
        
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
          PaperProps={{ sx: { ... } }}
        >
          <Typography variant="subtitle2" sx={{ ... }}>
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
                  sx={{ ... }}
                />
              ) : (
                <Typography variant="body2" sx={{ color: '#fff' }}>All Statuses</Typography>
              )}
            </MenuItem>
          ))}
          
          <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          
          <Typography variant="subtitle2" sx={{ ... }}>
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
      </Box>
      */}
    </motion.div>
  );
};

export default Attendance;
