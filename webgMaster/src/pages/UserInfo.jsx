import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Avatar,
  Chip,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Tabs,
  Tab,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
  Tooltip,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  Fingerprint as FingerprintIcon,
  Badge as BadgeIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationOnIcon,
  Map as MapIcon,
  Close as CloseIcon,
  FilterAlt as FilterAltIcon,
  Today as TodayIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import UserMap from '../components/userInfo/UserMap';

// Helper component for displaying user information
const InfoItem = ({ icon, label, value }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Box sx={{ 
        mr: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: theme.palette.primary.main,
        width: 40
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
          {value || 'N/A'}
        </Typography>
      </Box>
    </Box>
  );
};

const UserInfo = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { getToken } = useAuth();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [locations, setLocations] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  // Map related state
  const [location, setLocation] = useState(null);
  const [routePositions, setRoutePositions] = useState([]);
  const [filteredRoutePositions, setFilteredRoutePositions] = useState([]);
  const [isDateFiltered, setIsDateFiltered] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  
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

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        });
        
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          setError('Failed to fetch user data');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Error connecting to the server');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, getToken]);

  // Fetch user locations
  const fetchUserLocations = async () => {
    try {
      setLocationLoading(true);
      
      const response = await axios.get(`http://localhost:5000/api/admin/users/${userId}/all-locations`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      
      if (response.data.success) {
        const locationData = response.data.locations || [];
        setLocations(locationData);
        
        // Set the most recent location as the current location
        if (locationData.length > 0) {
          const mostRecentLocation = locationData[0]; // Assuming the first one is the most recent
          setLocation({
            latitude: mostRecentLocation.location.latitude,
            longitude: mostRecentLocation.location.longitude,
            timestamp: mostRecentLocation.timestamp
          });
          
          // Extract coordinates for the route
          const coordinates = locationData.map(loc => [
            parseFloat(loc.location.latitude),
            parseFloat(loc.location.longitude)
          ]).filter(coord => !isNaN(coord[0]) && !isNaN(coord[1]));
          
          console.log(`Extracted ${coordinates.length} route coordinates from ${locationData.length} locations`);
          setRoutePositions(coordinates);
        } else {
          setLocation(null);
          setRoutePositions([]);
        }
      } else {
        console.error('Failed to fetch locations:', response.data.message);
        setLocations([]);
        setLocation(null);
        setRoutePositions([]);
      }
    } catch (err) {
      console.error('Error fetching locations:', err);
      setLocations([]);
      setLocation(null);
      setRoutePositions([]);
    } finally {
      setLocationLoading(false);
    }
  };

  // Load locations when tab changes to locations
  useEffect(() => {
    if (tabValue === 1 && locations.length === 0) {
      fetchUserLocations();
    }
  }, [tabValue, locations.length]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle password reset
  const handleResetPassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    
    if (!newPassword || !confirmPassword) {
      setPasswordError('Please fill in all fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    try {
      const response = await axios.post(`http://localhost:5000/api/admin/users/${userId}/reset-password`, 
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );
      
      if (response.data.success) {
        setPasswordSuccess('Password reset successfully');
        setTimeout(() => {
          setResetPasswordOpen(false);
          setNewPassword('');
          setConfirmPassword('');
          setPasswordSuccess('');
        }, 2000);
      } else {
        setPasswordError(response.data.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      setPasswordError('Server error occurred');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (err) {
      return 'Invalid Date';
    }
  };

  // Format date with time for display
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch (err) {
      return 'Invalid Date';
    }
  };

  // Format date for input value (YYYY-MM-DD)
  const formatDateForInput = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };
  
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return formatDateForInput(today);
  };

  // Filter locations by date
  const filterLocationsByDate = (date) => {
    if (!date || !locations.length) {
      setIsDateFiltered(false);
      setFilteredRoutePositions([]);
      return;
    }
    
    const selectedDateObj = new Date(date);
    selectedDateObj.setHours(0, 0, 0, 0); // Start of day
    
    const nextDay = new Date(selectedDateObj);
    nextDay.setDate(nextDay.getDate() + 1); // End of day (start of next day)
    
    // Filter locations that fall within the selected date
    const filtered = locations.filter(loc => {
      const locDate = new Date(loc.timestamp);
      return locDate >= selectedDateObj && locDate < nextDay;
    });
    
    if (filtered.length > 0) {
      // Extract coordinates for the filtered route
      const filteredCoordinates = filtered.map(loc => [
        parseFloat(loc.location.latitude),
        parseFloat(loc.location.longitude)
      ]).filter(coord => !isNaN(coord[0]) && !isNaN(coord[1]));
      
      setFilteredRoutePositions(filteredCoordinates);
      setIsDateFiltered(true);
    } else {
      setFilteredRoutePositions([]);
      setIsDateFiltered(true); // Still show it's active but with no results
    }
  };

  // Mask password for display
  const maskPassword = (password = '') => {
    if (!password) return '••••••';
    return '••••••••••';
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh' 
      }}>
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh',
        p: 3
      }}>
        <Typography variant="h5" sx={{ color: theme.palette.error.main, mb: 2 }}>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/userdata')}
          startIcon={<ArrowBackIcon />}
        >
          Back to User Data
        </Button>
      </Box>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <IconButton 
          onClick={() => navigate('/userdata')} 
          sx={{ mr: 2, color: 'rgba(255, 255, 255, 0.7)' }}
        >
          <ArrowBackIcon />
        </IconButton>
        <motion.div variants={itemVariants}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#fff',
              background: 'linear-gradient(90deg, #fff, #90caf9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            User Profile
          </Typography>
        </motion.div>
      </Box>

      <Grid container spacing={3}>
        {/* User Profile Card */}
        <Grid item xs={12} md={4}>
          <motion.div variants={itemVariants}>
            <Card sx={{ 
              bgcolor: 'rgba(25, 35, 60, 0.6)',
              borderRadius: 3,
              border: '1px solid rgba(100, 180, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              height: '100%'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                  <Avatar 
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      bgcolor: theme.palette.primary.main,
                      fontSize: '2.5rem',
                      mb: 2,
                      border: '4px solid',
                      borderColor: alpha(theme.palette.primary.main, 0.3)
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                  <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600, textAlign: 'center' }}>
                    {user?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, textAlign: 'center' }}>
                    {user?.email}
                  </Typography>
                  <Chip 
                    label={user?.is_active ? 'Active' : 'Inactive'} 
                    size="small"
                    sx={{
                      bgcolor: user?.is_active 
                        ? alpha(theme.palette.success.main, 0.2)
                        : alpha(theme.palette.error.main, 0.2),
                      color: user?.is_active 
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                      fontWeight: 500,
                      border: '1px solid',
                      borderColor: user?.is_active 
                        ? alpha(theme.palette.success.main, 0.3)
                        : alpha(theme.palette.error.main, 0.3),
                    }}
                  />
                </Box>

                <Divider sx={{ my: 3, borderColor: 'rgba(100, 180, 255, 0.1)' }} />

                <Box sx={{ mt: 2 }}>
                  <InfoItem icon={<EmailIcon />} label="Email" value={user?.email} />
                  <InfoItem icon={<PhoneIcon />} label="Mobile" value={user?.mobile} />
                  <InfoItem icon={<HomeIcon />} label="Address" value={user?.address} />
                  <InfoItem icon={<WorkIcon />} label="Department" value={user?.department} />
                  <InfoItem icon={<CalendarIcon />} label="Joining Date" value={formatDate(user?.joiningDate)} />
                  <InfoItem icon={<FingerprintIcon />} label="Aadhar" value={user?.adhar} />
                  <InfoItem icon={<BadgeIcon />} label="PAN" value={user?.pan} />
                  <InfoItem icon={<LockIcon />} label="Password" value={maskPassword(user?.password)} />
                </Box>

                <Box sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setResetPasswordOpen(true)}
                    sx={{
                      bgcolor: alpha(theme.palette.warning.main, 0.8),
                      color: '#fff',
                      '&:hover': {
                        bgcolor: theme.palette.warning.main,
                      },
                      mb: 2
                    }}
                  >
                    Reset Password
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/userdata')}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                        bgcolor: 'rgba(255, 255, 255, 0.05)'
                      }
                    }}
                  >
                    Back to User List
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* User Details Tabs */}
        <Grid item xs={12} md={8}>
          <motion.div variants={itemVariants}>
            <Card sx={{ 
              bgcolor: 'rgba(25, 35, 60, 0.6)',
              borderRadius: 3,
              border: '1px solid rgba(100, 180, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}>
              <Box sx={{ borderBottom: 1, borderColor: 'rgba(100, 180, 255, 0.1)' }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  sx={{
                    '& .MuiTabs-indicator': {
                      backgroundColor: theme.palette.primary.main,
                    },
                    '& .MuiTab-root': {
                      color: 'rgba(255, 255, 255, 0.5)',
                      '&.Mui-selected': {
                        color: theme.palette.primary.main,
                      },
                    },
                  }}
                >
                  <Tab label="Overview" />
                  <Tab label="Location History" />
                  <Tab label="Attendance" />
                </Tabs>
              </Box>

              <CardContent sx={{ p: 3 }}>
                {/* Overview Tab */}
                {tabValue === 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                      User Information
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Paper sx={{ 
                          p: 2, 
                          bgcolor: 'rgba(0, 0, 0, 0.2)', 
                          borderRadius: 2,
                          border: '1px solid rgba(100, 180, 255, 0.05)'
                        }}>
                          <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                            Personal Details
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                Full Name
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                                {user?.name}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                Email
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                                {user?.email}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                Mobile
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                                {user?.mobile}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                Address
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500, textAlign: 'right' }}>
                                {user?.address}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Paper sx={{ 
                          p: 2, 
                          bgcolor: 'rgba(0, 0, 0, 0.2)', 
                          borderRadius: 2,
                          border: '1px solid rgba(100, 180, 255, 0.05)'
                        }}>
                          <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                            Employment Details
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                Department
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                                {user?.department}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                Joining Date
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                                {formatDate(user?.joiningDate)}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                Status
                              </Typography>
                              <Chip 
                                label={user?.is_active ? 'Active' : 'Inactive'} 
                                size="small"
                                sx={{
                                  bgcolor: user?.is_active 
                                    ? alpha(theme.palette.success.main, 0.2)
                                    : alpha(theme.palette.error.main, 0.2),
                                  color: user?.is_active 
                                    ? theme.palette.success.main
                                    : theme.palette.error.main,
                                  fontWeight: 500,
                                  height: 20,
                                  fontSize: '0.7rem'
                                }}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                Account Created
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                                {formatDate(user?.created_at)}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Paper sx={{ 
                          p: 2, 
                          bgcolor: 'rgba(0, 0, 0, 0.2)', 
                          borderRadius: 2,
                          border: '1px solid rgba(100, 180, 255, 0.05)'
                        }}>
                          <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                            Identification Details
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                Aadhar Number
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                                {user?.adhar}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                PAN Number
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                                {user?.pan}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Location History Tab */}
                {tabValue === 1 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6" sx={{ color: '#fff' }}>
                        Location History
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          startIcon={<TodayIcon />}
                          onClick={() => setShowDateModal(true)}
                          sx={{ 
                            color: isDateFiltered ? theme.palette.secondary.main : 'rgba(255, 255, 255, 0.7)',
                            borderColor: isDateFiltered ? theme.palette.secondary.main : 'rgba(255, 255, 255, 0.2)',
                            border: '1px solid',
                            '&:hover': {
                              borderColor: isDateFiltered ? theme.palette.secondary.main : 'rgba(255, 255, 255, 0.4)',
                              bgcolor: 'rgba(255, 255, 255, 0.05)'
                            }
                          }}
                        >
                          Filter by Date
                        </Button>
                        <Button
                          startIcon={<RefreshIcon />}
                          onClick={fetchUserLocations}
                          disabled={locationLoading}
                          sx={{ color: theme.palette.primary.main }}
                        >
                          Refresh
                        </Button>
                      </Box>
                    </Box>
                    
                    {/* Date filter indicator */}
                    {isDateFiltered && (
                      <Box sx={{ 
                        mb: 3, 
                        p: 2, 
                        bgcolor: alpha(theme.palette.secondary.main, 0.1), 
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Box>
                          <Typography variant="body2" sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}>
                            Showing route for: {selectedDate ? new Date(selectedDate).toLocaleDateString(undefined, {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}) : ''}
                          </Typography>
                          {filteredRoutePositions.length === 0 && (
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', mt: 0.5 }}>
                              No location data available for this date.
                            </Typography>
                          )}
                        </Box>
                        <IconButton 
                          size="small"
                          onClick={() => {
                            setSelectedDate('');
                            setIsDateFiltered(false);
                            setFilteredRoutePositions([]);
                          }}
                          sx={{ color: theme.palette.secondary.main }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                    
                    {/* Map Section */}
                    <Box sx={{ mb: 3 }}>
                      <Paper sx={{ 
                        height: 400, 
                        width: '100%', 
                        bgcolor: 'rgba(0, 0, 0, 0.2)', 
                        borderRadius: 2,
                        border: '1px solid rgba(100, 180, 255, 0.05)',
                        overflow: 'hidden'
                      }}>
                        {locationLoading ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress size={40} sx={{ color: theme.palette.primary.main }} />
                          </Box>
                        ) : location ? (
                          <UserMap
                            latitude={location.latitude}
                            longitude={location.longitude}
                            routePositions={isDateFiltered ? filteredRoutePositions : routePositions}
                            locationData={locations}
                            loading={locationLoading}
                          />
                        ) : (
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            height: '100%',
                            color: 'rgba(255, 255, 255, 0.5)'
                          }}>
                            No location data available
                          </Box>
                        )}
                      </Paper>
                    </Box>
                    
                    {/* Location List */}
                    <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                      Location History
                    </Typography>
                    
                    {locationLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress size={30} sx={{ color: theme.palette.primary.main }} />
                      </Box>
                    ) : locations.length > 0 ? (
                      <Box sx={{ maxHeight: 400, overflow: 'auto', pr: 1 }}>
                        {(isDateFiltered ? 
                          locations.filter(loc => {
                            const locDate = new Date(loc.timestamp);
                            const selectedDateObj = new Date(selectedDate);
                            selectedDateObj.setHours(0, 0, 0, 0);
                            const nextDay = new Date(selectedDateObj);
                            nextDay.setDate(nextDay.getDate() + 1);
                            return locDate >= selectedDateObj && locDate < nextDay;
                          }) : 
                          locations
                        ).map((loc, index) => (
                          <Paper
                            key={index}
                            sx={{
                              p: 2,
                              mb: 2,
                              bgcolor: 'rgba(0, 0, 0, 0.2)',
                              borderRadius: 2,
                              border: '1px solid rgba(100, 180, 255, 0.05)',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <LocationOnIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                                Lat: {loc.location.latitude}, Lng: {loc.location.longitude}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                {formatDateTime(loc.timestamp)}
                              </Typography>
                            </Box>
                            <Tooltip title="View on Map">
                              <IconButton 
                                size="small" 
                                sx={{ color: theme.palette.info.main }}
                                onClick={() => window.open(`https://www.google.com/maps?q=${loc.location.latitude},${loc.location.longitude}`, '_blank')}
                              >
                                <MapIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Paper>
                        ))}
                      </Box>
                    ) : (
                      <Box sx={{ 
                        p: 4, 
                        textAlign: 'center', 
                        bgcolor: 'rgba(0, 0, 0, 0.2)', 
                        borderRadius: 2,
                        border: '1px solid rgba(100, 180, 255, 0.05)'
                      }}>
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          No location history available for this user
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}

                {/* Attendance Tab */}
                {tabValue === 2 && (
                  <Box>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                      Attendance History
                    </Typography>
                    
                    <Box sx={{ 
                      p: 4, 
                      textAlign: 'center', 
                      bgcolor: 'rgba(0, 0, 0, 0.2)', 
                      borderRadius: 2,
                      border: '1px solid rgba(100, 180, 255, 0.05)'
                    }}>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Attendance data will be available soon
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Date Filter Modal */}
      <Dialog
        open={showDateModal}
        onClose={() => setShowDateModal(false)}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(25, 35, 60, 0.95)',
            backgroundImage: 'linear-gradient(135deg, rgba(25, 35, 60, 0.95) 0%, rgba(15, 25, 50, 0.98) 100%)',
            border: '1px solid rgba(100, 180, 255, 0.1)',
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            color: '#fff',
            maxWidth: '400px',
            width: '100%'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid rgba(100, 180, 255, 0.1)', 
          px: 3, 
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant="h6">Filter by Date</Typography>
          <IconButton 
            onClick={() => setShowDateModal(false)}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
            Select a date to view the user's movement path for that specific day.
          </Typography>
          
          <TextField
            fullWidth
            label="Select Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ 
              shrink: true,
              sx: { color: 'rgba(255, 255, 255, 0.7)' } 
            }}
            inputProps={{
              max: getTodayDate()
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(100, 180, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(100, 180, 255, 0.1)' }}>
          <Button 
            onClick={() => {
              setSelectedDate('');
              setIsDateFiltered(false);
              setFilteredRoutePositions([]);
              setShowDateModal(false);
            }}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Clear Filter
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              if (selectedDate) {
                filterLocationsByDate(selectedDate);
                setShowDateModal(false);
              }
            }}
            disabled={!selectedDate}
            sx={{ bgcolor: theme.palette.secondary.main, '&:hover': { bgcolor: theme.palette.secondary.dark } }}
          >
            Apply Filter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog 
        open={resetPasswordOpen} 
        onClose={() => setResetPasswordOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(25, 35, 60, 0.95)',
            backgroundImage: 'linear-gradient(135deg, rgba(25, 35, 60, 0.95) 0%, rgba(15, 25, 50, 0.98) 100%)',
            border: '1px solid rgba(100, 180, 255, 0.1)',
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            color: '#fff',
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid rgba(100, 180, 255, 0.1)', 
          px: 3, 
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant="h6">Reset Password</Typography>
          <IconButton 
            onClick={() => setResetPasswordOpen(false)}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
            Enter a new password for {user?.name}
          </Typography>
          
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            variant="outlined"
            InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(100, 180, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
          
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            variant="outlined"
            InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(100, 180, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
          
          {passwordError && (
            <Box sx={{ 
              mt: 2, 
              p: 1.5, 
              bgcolor: alpha(theme.palette.error.main, 0.1), 
              borderRadius: 1,
              border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`
            }}>
              <Typography variant="body2" sx={{ color: theme.palette.error.main }}>
                {passwordError}
              </Typography>
            </Box>
          )}
          
          {passwordSuccess && (
            <Box sx={{ 
              mt: 2, 
              p: 1.5, 
              bgcolor: alpha(theme.palette.success.main, 0.1), 
              borderRadius: 1,
              border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`
            }}>
              <Typography variant="body2" sx={{ color: theme.palette.success.main }}>
                {passwordSuccess}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(100, 180, 255, 0.1)' }}>
          <Button 
            onClick={() => setResetPasswordOpen(false)} 
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleResetPassword}
            sx={{ bgcolor: theme.palette.warning.main, '&:hover': { bgcolor: theme.palette.warning.dark } }}
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default UserInfo;