import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  Tooltip,
  alpha,
  useTheme
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  LockOpen as LockOpenIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function UserData() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filter state
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    userType: '',
    createdDate: '',
    lastActive: ''
  });

  // Dialog states
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  
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

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      
      if (response.data.success && Array.isArray(response.data.users)) {
        console.log('Users data loaded:', response.data.users);
        
        // Log the structure of the first user to see what properties are available
        if (response.data.users.length > 0) {
          console.log('First user object structure:', JSON.stringify(response.data.users[0], null, 2));
        }
        setUsers(response.data.users);
      } else {
        setError('Failed to fetch user data');
        console.error('Invalid user data format:', response.data);
        setUsers([]); // Ensure users is at least an empty array
      }
    } catch (err) {
      setError('Error connecting to the server');
      console.error('Error fetching users:', err);
      setUsers([]); // Ensure users is at least an empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle pagination changes
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    // If selecting the same value, clear the filter
    if (filters[field] === value && field !== 'department') {
      setFilters(prev => ({
        ...prev,
        [field]: ''
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [field]: value
      }));
    }
    setPage(0); // Reset to first page when filters change
  };

  // Handle dialog actions
  const handleOpenViewDialog = (user) => {
    setSelectedUser(user);
    setOpenViewDialog(true);
  };

  const handleOpenEditDialog = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      department: user.department,
      address: user.address,
      is_active: user.is_active
    });
    setOpenEditDialog(true);
  };
  
  // Handle navigation to user info page
  const handleViewUserInfo = (userId) => {
    navigate(`/userinfo/${userId}`);
  };

  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenViewDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setSelectedUser(null);
    setEditForm({});
  };

  // Handle form changes
  const handleEditFormChange = (e) => {
    const { name, value, checked, type } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle user actions
  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      
      await axios.put(`http://localhost:5000/api/admin/users/${selectedUser._id}`, editForm, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      
      fetchUsers();
      handleCloseDialogs();
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      
      await axios.delete(`http://localhost:5000/api/admin/users/${selectedUser._id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      
      fetchUsers();
      handleCloseDialogs();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (user) => {
    try {
      setLoading(true);
      
      await axios.put(`http://localhost:5000/api/admin/users/${user._id}`, 
        { is_active: !user.is_active }, 
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );
      
      fetchUsers();
    } catch (err) {
      console.error('Error toggling user status:', err);
      setError('Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin
  const isAdminUser = (user) => {
    if (!user) return false;
    
    // Check for common admin indicators with more flexible matching
    const isAdmin = 
      // Check role field (could be role, userRole, user_role)
      (user.role && typeof user.role === 'string' && user.role.toLowerCase().includes('admin')) || 
      (user.userRole && typeof user.userRole === 'string' && user.userRole.toLowerCase().includes('admin')) ||
      (user.user_role && typeof user.user_role === 'string' && user.user_role.toLowerCase().includes('admin')) ||
      
      // Check boolean flags
      (user.isAdmin === true) || 
      (user.is_admin === true) ||
      
      // Check type fields (could be type, userType, user_type)
      (user.type && typeof user.type === 'string' && user.type.toLowerCase().includes('admin')) ||
      (user.userType && typeof user.userType === 'string' && user.userType.toLowerCase().includes('admin')) ||
      (user.user_type && typeof user.user_type === 'string' && user.user_type.toLowerCase().includes('admin')) ||
      
      // Check access level fields
      (user.access_level && (user.access_level === 'admin' || user.access_level >= 9)) ||
      (user.accessLevel && (user.accessLevel === 'admin' || user.accessLevel >= 9)) ||
      
      // Check permissions or capabilities
      (user.permissions && user.permissions.includes('admin')) ||
      (user.capabilities && user.capabilities.includes('admin')) ||
      
      // Check email domain for admin emails
      (user.email && typeof user.email === 'string' && user.email.includes('admin'));
    
    // Manual override for specific users we know should be admins
    // This is a temporary solution until we fix the data structure
    const knownAdmins = ['om', 'Kuldeep', 'admin'];
    const nameMatch = user.name && knownAdmins.some(adminName => 
      user.name.toLowerCase().includes(adminName.toLowerCase())
    );
    const emailMatch = user.email && knownAdmins.some(adminName => 
      user.email.toLowerCase().includes(adminName.toLowerCase())
    );
    
    const manualOverride = nameMatch || emailMatch;
    
    // Final admin status combining automatic detection and manual override
    const finalAdminStatus = isAdmin || manualOverride;
    
    // Log the result for debugging
    console.log(`User ${user.name || user.email || 'unknown'} admin status:`, 
      { automatic: isAdmin, manualOverride, final: finalAdminStatus });
    
    return finalAdminStatus;
  };

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    // Advanced search across multiple fields
    const matchesSearch = searchTerm === '' || 
      (user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user?.mobile || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user?.department || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user?.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user?.employee_id || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Department filter
    const matchesDepartment = !filters.department || user?.department === filters.department;
    
    // Status filter
    const matchesStatus = !filters.status || 
      (filters.status === 'active' && user?.is_active) ||
      (filters.status === 'inactive' && !user?.is_active);
    
    // User type filter (admin vs regular user)
    const matchesUserType = !filters.userType || 
      (filters.userType === 'admin' && isAdminUser(user)) ||
      (filters.userType === 'regular' && !isAdminUser(user));
    
    // Date filters could be implemented here if needed
    const matchesCreatedDate = !filters.createdDate || true; // Placeholder for date filtering
    const matchesLastActive = !filters.lastActive || true; // Placeholder for last active filtering
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesUserType && 
           matchesCreatedDate && matchesLastActive;
  });

  // Get unique departments for filter dropdown
  const departments = [...new Set(users.map(user => user.department).filter(Boolean))];

  // Paginate users
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid Date';
    }
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Box sx={{ mb: 3 }}>
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
            User Management
          </Typography>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
            View and manage all user accounts in the system.
          </Typography>
        </motion.div>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <motion.div variants={itemVariants}>
            <Card sx={{ 
              bgcolor: 'rgba(25, 35, 60, 0.6)',
              borderRadius: 3,
              border: '1px solid rgba(100, 180, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
                  {/* Search, filters and action buttons row */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                    {/* Search and action buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                          placeholder="Search users..."
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
                            width: 300,
                            mr: 1,
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
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                          <Tooltip title="Filter by Department">
                            <FormControl size="small" sx={{ minWidth: 130 }}>
                              <Select
                                displayEmpty
                                value={filters.department}
                                onChange={(e) => handleFilterChange('department', e.target.value)}
                                renderValue={(selected) => selected ? selected : "Department"}
                                MenuProps={{
                                  PaperProps: {
                                    sx: {
                                      bgcolor: 'rgba(25, 35, 60, 0.95)',
                                      color: '#fff',
                                      '& .MuiMenuItem-root:hover': {
                                        bgcolor: 'rgba(100, 180, 255, 0.1)',
                                      },
                                    }
                                  }
                                }}
                                sx={{
                                  color: '#fff',
                                  bgcolor: filters.department ? 'rgba(100, 180, 255, 0.15)' : 'rgba(0, 0, 0, 0.2)',
                                  height: '40px',
                                  '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: filters.department ? 'rgba(100, 180, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)',
                                  },
                                  '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(100, 180, 255, 0.3)',
                                  },
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#1e88e5',
                                  },
                                  '.MuiSvgIcon-root': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                  }
                                }}
                              >
                                <MenuItem value="">All Departments</MenuItem>
                                {departments.map((dept) => (
                                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Tooltip>

                          <Tooltip title="Filter by User Status">
                            <FormControl size="small" sx={{ ml: 1, minWidth: 120 }}>
                              <Select
                                displayEmpty
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                renderValue={(selected) => selected ? (selected === 'active' ? 'Active' : 'Inactive') : "Status"}
                                MenuProps={{
                                  PaperProps: {
                                    sx: {
                                      bgcolor: 'rgba(25, 35, 60, 0.95)',
                                      color: '#fff',
                                      '& .MuiMenuItem-root:hover': {
                                        bgcolor: 'rgba(100, 180, 255, 0.1)',
                                      },
                                    }
                                  }
                                }}
                                sx={{
                                  color: '#fff',
                                  bgcolor: filters.status ? (
                                    filters.status === 'active' ? 'rgba(46, 125, 50, 0.15)' : 'rgba(211, 47, 47, 0.15)'
                                  ) : 'rgba(0, 0, 0, 0.2)',
                                  height: '40px',
                                  '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: filters.status ? (
                                      filters.status === 'active' ? 'rgba(46, 125, 50, 0.5)' : 'rgba(211, 47, 47, 0.5)'
                                    ) : 'rgba(255, 255, 255, 0.2)',
                                  },
                                  '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(100, 180, 255, 0.3)',
                                  },
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#1e88e5',
                                  },
                                  '.MuiSvgIcon-root': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                  }
                                }}
                              >
                                <MenuItem value="">All Status</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                              </Select>
                            </FormControl>
                          </Tooltip>
                          
                          <Tooltip title="Clear All Filters">
                            <IconButton 
                              onClick={() => {
                                setFilters({ department: '', status: '', userType: '', createdDate: '', lastActive: '' });
                                setSearchTerm('');
                              }}
                              sx={{
                                ml: 1,
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&:hover': { color: '#fff', bgcolor: 'rgba(255, 255, 255, 0.05)' },
                              }}
                              size="small"
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      <Box>
                        <Button
                          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
                          onClick={fetchUsers}
                          disabled={loading}
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)', 
                            '&:hover': { color: '#fff' },
                            mr: 1
                          }}
                        >
                          {loading ? 'Loading...' : 'Refresh'}
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => navigate('/adduser')}
                          sx={{
                            bgcolor: '#1e88e5',
                            '&:hover': { bgcolor: '#1976d2' },
                            borderRadius: 2,
                            boxShadow: '0 4px 12px rgba(30, 136, 229, 0.25)',
                            transition: 'all 0.2s ease',
                            '&:active': {
                              boxShadow: '0 2px 6px rgba(30, 136, 229, 0.3)',
                              transform: 'translateY(1px)'
                            }
                          }}
                        >
                          Add User
                        </Button>
                      </Box>
                    </Box>
                    
                    {/* Filter chips */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 1, 
                      mb: 2,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: 'rgba(0, 0, 0, 0.15)',
                      border: '1px solid rgba(100, 180, 255, 0.08)'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                        <FilterListIcon sx={{ color: theme.palette.primary.main, fontSize: 20, mr: 0.5 }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>
                          Quick Filters:
                        </Typography>
                      </Box>

                      <Chip
                        label="All Users"
                        size="small"
                        clickable
                        onClick={() => setFilters(prev => ({ ...prev, userType: '' }))}
                        sx={{
                          height: 28,
                          bgcolor: filters.userType === '' ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.2)',
                          color: filters.userType === '' ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            bgcolor: filters.userType === '' ? theme.palette.primary.dark : 'rgba(30, 136, 229, 0.15)',
                          },
                          transition: 'all 0.2s ease'
                        }}
                      />
                      <Chip
                        label="Administrators"
                        size="small"
                        icon={<PersonIcon sx={{ color: filters.userType === 'admin' ? '#fff' : 'rgba(255, 255, 255, 0.5)', fontSize: 16 }} />}
                        clickable
                        onClick={() => setFilters(prev => ({ ...prev, userType: 'admin' }))}
                        sx={{
                          height: 28,
                          bgcolor: filters.userType === 'admin' ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.2)',
                          color: filters.userType === 'admin' ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            bgcolor: filters.userType === 'admin' ? theme.palette.primary.dark : 'rgba(30, 136, 229, 0.15)',
                          },
                          transition: 'all 0.2s ease',
                          '& .MuiChip-icon': { 
                            color: filters.userType === 'admin' ? '#fff' : 'rgba(255, 255, 255, 0.5)' 
                          }
                        }}
                      />
                      <Chip
                        label="Regular Users"
                        size="small"
                        clickable
                        onClick={() => setFilters(prev => ({ ...prev, userType: 'regular' }))}
                        sx={{
                          height: 28,
                          bgcolor: filters.userType === 'regular' ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.2)',
                          color: filters.userType === 'regular' ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            bgcolor: filters.userType === 'regular' ? theme.palette.primary.dark : 'rgba(30, 136, 229, 0.15)',
                          },
                          transition: 'all 0.2s ease'
                        }}
                      />
                      <Chip
                        label="Active Users"
                        size="small"
                        icon={<LockOpenIcon sx={{ color: filters.status === 'active' ? '#fff' : 'rgba(255, 255, 255, 0.5)', fontSize: 16 }} />}
                        clickable
                        onClick={() => setFilters(prev => ({ ...prev, status: 'active' }))}
                        sx={{
                          height: 28,
                          bgcolor: filters.status === 'active' ? theme.palette.success.main : 'rgba(0, 0, 0, 0.2)',
                          color: filters.status === 'active' ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            bgcolor: filters.status === 'active' ? theme.palette.success.dark : 'rgba(46, 125, 50, 0.15)',
                          },
                          transition: 'all 0.2s ease',
                          '& .MuiChip-icon': { 
                            color: filters.status === 'active' ? '#fff' : 'rgba(255, 255, 255, 0.5)' 
                          }
                        }}
                      />
                      <Chip
                        label="Inactive Users"
                        size="small"
                        icon={<LockIcon sx={{ color: filters.status === 'inactive' ? '#fff' : 'rgba(255, 255, 255, 0.5)', fontSize: 16 }} />}
                        clickable
                        onClick={() => setFilters(prev => ({ ...prev, status: 'inactive' }))}
                        sx={{
                          height: 28,
                          bgcolor: filters.status === 'inactive' ? theme.palette.error.main : 'rgba(0, 0, 0, 0.2)',
                          color: filters.status === 'inactive' ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            bgcolor: filters.status === 'inactive' ? theme.palette.error.dark : 'rgba(211, 47, 47, 0.15)',
                          },
                          transition: 'all 0.2s ease',
                          '& .MuiChip-icon': { 
                            color: filters.status === 'inactive' ? '#fff' : 'rgba(255, 255, 255, 0.5)' 
                          }
                        }}
                      />
                    </Box>
                    
                    {/* Active filters indicators and search tips */}
                    {(filters.department || filters.status || filters.userType) && (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 1,
                        p: 1,
                        borderRadius: 2,
                        bgcolor: 'rgba(30, 136, 229, 0.1)',
                      }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>
                          Active Filters:
                        </Typography>
                        {filters.department && (
                          <Chip
                            size="small"
                            label={`Department: ${filters.department}`}
                            onDelete={() => setFilters(prev => ({ ...prev, department: '' }))}
                            sx={{ ml: 1, height: 24, bgcolor: 'rgba(30, 136, 229, 0.2)' }}
                          />
                        )}
                        {filters.status && (
                          <Chip
                            size="small"
                            label={`Status: ${filters.status === 'active' ? 'Active' : 'Inactive'}`}
                            onDelete={() => setFilters(prev => ({ ...prev, status: '' }))}
                            sx={{ 
                              ml: 1, 
                              height: 24, 
                              bgcolor: filters.status === 'active' ? 'rgba(46, 125, 50, 0.2)' : 'rgba(211, 47, 47, 0.2)'
                            }}
                          />
                        )}
                        {filters.userType && (
                          <Chip
                            size="small"
                            label={`Type: ${filters.userType === 'admin' ? 'Admin' : 'Regular'}`}
                            onDelete={() => setFilters(prev => ({ ...prev, userType: '' }))}
                            sx={{ ml: 1, height: 24, bgcolor: 'rgba(30, 136, 229, 0.2)' }}
                          />
                        )}
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        Search by name, email, mobile, department, address, or ID
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* User Statistics Summary */}
                <Box sx={{ 
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  mb: 3
                }}>
                  <Card sx={{ 
                    minWidth: 200, 
                    bgcolor: 'rgba(25, 35, 75, 0.6)',
                    borderRadius: 2,
                    border: '1px solid rgba(100, 180, 255, 0.15)'
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                        Total Users
                      </Typography>
                      <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
                        {users.length}
                      </Typography>
                    </CardContent>
                  </Card>
                  
                  <Card sx={{ 
                    minWidth: 200, 
                    bgcolor: 'rgba(25, 35, 75, 0.6)',
                    borderRadius: 2,
                    border: '1px solid rgba(100, 180, 255, 0.15)'
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                        Active Users
                      </Typography>
                      <Typography variant="h4" sx={{ color: theme.palette.success.main, fontWeight: 700 }}>
                        {users.filter(user => user.is_active).length}
                      </Typography>
                    </CardContent>
                  </Card>
                  
                  <Card sx={{ 
                    minWidth: 200, 
                    bgcolor: 'rgba(25, 35, 75, 0.6)',
                    borderRadius: 2,
                    border: '1px solid rgba(100, 180, 255, 0.15)'
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                        Admins
                      </Typography>
                      <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
                        {(() => {
                          // Get all admin users
                          const adminUsers = users.filter(user => isAdminUser(user));
                          
                          // Log detailed information
                          console.log('Admin count in UI:', adminUsers.length);
                          console.log('Admin users:', adminUsers.map(u => u.name || u.email));
                          
                          // Return the count
                          return adminUsers.length || '0';
                        })()}
                      </Typography>
                    </CardContent>
                  </Card>
                  
                  <Card sx={{ 
                    minWidth: 200, 
                    bgcolor: 'rgba(25, 35, 75, 0.6)',
                    borderRadius: 2,
                    border: '1px solid rgba(100, 180, 255, 0.15)'
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                        Regular Users
                      </Typography>
                      <Typography variant="h4" sx={{ color: theme.palette.secondary.main, fontWeight: 700 }}>
                        {users.filter(user => !isAdminUser(user)).length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>

                {/* Users Table */}
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress sx={{ color: theme.palette.primary.main }} />
                  </Box>
                ) : error ? (
                  <Box sx={{ 
                    p: 3, 
                    textAlign: 'center', 
                    color: theme.palette.error.main,
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    borderRadius: 2
                  }}>
                    <Typography>{error}</Typography>
                    <Button 
                      variant="outlined" 
                      onClick={fetchUsers}
                      sx={{ mt: 2, color: theme.palette.error.main, borderColor: theme.palette.error.main }}
                    >
                      Retry
                    </Button>
                  </Box>
                ) : (
                  <>
                    <TableContainer component={Paper} sx={{ 
                      bgcolor: 'transparent',
                      backgroundImage: 'none',
                      boxShadow: 'none',
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid rgba(100, 180, 255, 0.08)'
                    }}>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ 
                            bgcolor: 'rgba(0, 0, 0, 0.2)',
                            '& th': { borderBottom: '1px solid rgba(100, 180, 255, 0.1)' }
                          }}>
                            <TableCell sx={{ color: '#fff', fontWeight: 600 }}>User</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Contact</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Department</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 600 }}>User Type</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Joined</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedUsers.length > 0 ? (
                            paginatedUsers.map((user) => (
                              <TableRow key={user._id} sx={{ 
                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
                                '& td': { borderBottom: '1px solid rgba(100, 180, 255, 0.05)' }
                              }}>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar 
                                      sx={{ 
                                        bgcolor: theme.palette.primary.main,
                                        color: '#fff',
                                        width: 36,
                                        height: 36,
                                        mr: 2
                                      }}
                                    >
                                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </Avatar>
                                    <Box>
                                      <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                                        {user.name}
                                      </Typography>
                                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                        {user.email}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                  {user.mobile}
                                </TableCell>
                                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                  {user.department}
                                </TableCell>
                                <TableCell>
                                  <Chip 
                                    label={isAdminUser(user) ? 'Admin' : 'Regular User'} 
                                    size="small"
                                    sx={{
                                      bgcolor: isAdminUser(user)
                                        ? alpha(theme.palette.primary.main, 0.2)
                                        : alpha(theme.palette.secondary.main, 0.2),
                                      color: isAdminUser(user)
                                        ? theme.palette.primary.main
                                        : theme.palette.secondary.main,
                                      fontWeight: 500,
                                      border: '1px solid',
                                      borderColor: isAdminUser(user)
                                        ? alpha(theme.palette.primary.main, 0.3)
                                        : alpha(theme.palette.secondary.main, 0.3),
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Chip 
                                    label={user.is_active ? 'Active' : 'Inactive'} 
                                    size="small"
                                    sx={{
                                      bgcolor: user.is_active 
                                        ? alpha(theme.palette.success.main, 0.2)
                                        : alpha(theme.palette.error.main, 0.2),
                                      color: user.is_active 
                                        ? theme.palette.success.main
                                        : theme.palette.error.main,
                                      fontWeight: 500,
                                      border: '1px solid',
                                      borderColor: user.is_active 
                                        ? alpha(theme.palette.success.main, 0.3)
                                        : alpha(theme.palette.error.main, 0.3),
                                    }}
                                  />
                                </TableCell>
                                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                  {formatDate(user.joiningDate)}
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex' }}>
                                    <Tooltip title="View Details">
                                      <IconButton 
                                        size="small" 
                                        onClick={() => handleOpenViewDialog(user)}
                                        sx={{ color: theme.palette.info.main }}
                                      >
                                        <VisibilityIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="View Complete Info">
                                      <IconButton 
                                        size="small" 
                                        onClick={() => handleViewUserInfo(user._id)}
                                        sx={{ color: theme.palette.secondary.main }}
                                      >
                                        <PersonIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit User">
                                      <IconButton 
                                        size="small" 
                                        onClick={() => handleOpenEditDialog(user)}
                                        sx={{ color: theme.palette.primary.main }}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title={user.is_active ? "Deactivate" : "Activate"}>
                                      <IconButton 
                                        size="small" 
                                        onClick={() => handleToggleUserStatus(user)}
                                        sx={{ 
                                          color: user.is_active 
                                            ? theme.palette.warning.main
                                            : theme.palette.success.main
                                        }}
                                      >
                                        {user.is_active ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete User">
                                      <IconButton 
                                        size="small" 
                                        onClick={() => handleOpenDeleteDialog(user)}
                                        sx={{ color: theme.palette.error.main }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
                                No users found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    
                    <TablePagination
                      component="div"
                      count={filteredUsers.length}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        '.MuiTablePagination-selectIcon': {
                          color: 'rgba(255, 255, 255, 0.7)'
                        },
                        '.MuiTablePagination-select': {
                          color: '#fff'
                        },
                        '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                          color: 'rgba(255, 255, 255, 0.7)'
                        }
                      }}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* View User Dialog */}
      <Dialog 
        open={openViewDialog} 
        onClose={handleCloseDialogs}
        maxWidth="sm"
        fullWidth
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
        {selectedUser && (
          <>
            <DialogTitle sx={{ 
              borderBottom: '1px solid rgba(100, 180, 255, 0.1)', 
              px: 3, 
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    bgcolor: theme.palette.primary.main,
                    mr: 2
                  }}
                >
                  {selectedUser.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6">{selectedUser.name}</Typography>
                    <Chip
                      label={isAdminUser(selectedUser) ? 'Admin' : 'Regular User'}
                      size="small"
                      sx={{
                        ml: 1,
                        bgcolor: isAdminUser(selectedUser)
                          ? alpha(theme.palette.primary.main, 0.2)
                          : alpha(theme.palette.secondary.main, 0.2),
                        color: isAdminUser(selectedUser)
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
                        fontWeight: 500,
                        border: '1px solid',
                        borderColor: isAdminUser(selectedUser)
                          ? alpha(theme.palette.primary.main, 0.3)
                          : alpha(theme.palette.secondary.main, 0.3),
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {selectedUser.email}
                  </Typography>
                </Box>
              </Box>
              <IconButton 
                onClick={handleCloseDialogs}
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ px: 3, py: 2 }}>
              <Grid container spacing={2} sx={{ mt: 0 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                    Mobile
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedUser.mobile}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                    Department
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedUser.department}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                    Status
                  </Typography>
                  <Chip
                    label={selectedUser.is_active ? 'Active' : 'Inactive'}
                    size="small"
                    sx={{
                      bgcolor: selectedUser.is_active 
                        ? alpha(theme.palette.success.main, 0.2)
                        : alpha(theme.palette.error.main, 0.2),
                      color: selectedUser.is_active 
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                      fontWeight: 500,
                      border: '1px solid',
                      borderColor: selectedUser.is_active 
                        ? alpha(theme.palette.success.main, 0.3)
                        : alpha(theme.palette.error.main, 0.3),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                    Joining Date
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {formatDate(selectedUser.joiningDate)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                    Address
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedUser.address}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                    Aadhar Number
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedUser.adhar}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                    PAN Number
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedUser.pan}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(100, 180, 255, 0.1)' }}>
              <Button 
                onClick={handleCloseDialogs} 
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Close
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => handleViewUserInfo(selectedUser._id)}
                startIcon={<PersonIcon />}
                sx={{ 
                  mr: 1,
                  borderColor: alpha(theme.palette.secondary.main, 0.5),
                  color: theme.palette.secondary.main,
                  '&:hover': { 
                    borderColor: theme.palette.secondary.main,
                    bgcolor: alpha(theme.palette.secondary.main, 0.1)
                  } 
                }}
              >
                View Complete Info
              </Button>
              <Button 
                variant="contained" 
                onClick={() => {
                  handleCloseDialogs();
                  handleOpenEditDialog(selectedUser);
                }}
                startIcon={<EditIcon />}
                sx={{ bgcolor: '#1e88e5', '&:hover': { bgcolor: '#1976d2' } }}
              >
                Edit User
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={handleCloseDialogs}
        maxWidth="sm"
        fullWidth
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
        {selectedUser && (
          <>
            <DialogTitle sx={{ 
              borderBottom: '1px solid rgba(100, 180, 255, 0.1)', 
              px: 3, 
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EditIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6">Edit User</Typography>
              </Box>
              <IconButton 
                onClick={handleCloseDialogs}
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ px: 3, py: 2 }}>
              <Grid container spacing={2} sx={{ mt: 0 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={editForm.name || ''}
                    onChange={handleEditFormChange}
                    variant="outlined"
                    margin="normal"
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
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={editForm.email || ''}
                    onChange={handleEditFormChange}
                    variant="outlined"
                    margin="normal"
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
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mobile"
                    name="mobile"
                    value={editForm.mobile || ''}
                    onChange={handleEditFormChange}
                    variant="outlined"
                    margin="normal"
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
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    name="department"
                    value={editForm.department || ''}
                    onChange={handleEditFormChange}
                    variant="outlined"
                    margin="normal"
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
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={editForm.address || ''}
                    onChange={handleEditFormChange}
                    variant="outlined"
                    margin="normal"
                    multiline
                    rows={2}
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
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset" variant="standard">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip
                        label={editForm.is_active ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          bgcolor: editForm.is_active 
                            ? alpha(theme.palette.success.main, 0.2)
                            : alpha(theme.palette.error.main, 0.2),
                          color: editForm.is_active 
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                          fontWeight: 500,
                          mr: 2
                        }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setEditForm(prev => ({ ...prev, is_active: !prev.is_active }))}
                        startIcon={editForm.is_active ? <LockIcon /> : <LockOpenIcon />}
                        sx={{
                          borderColor: editForm.is_active 
                            ? alpha(theme.palette.warning.main, 0.5)
                            : alpha(theme.palette.success.main, 0.5),
                          color: editForm.is_active 
                            ? theme.palette.warning.main
                            : theme.palette.success.main,
                          '&:hover': {
                            borderColor: editForm.is_active 
                              ? theme.palette.warning.main
                              : theme.palette.success.main,
                            bgcolor: editForm.is_active 
                              ? alpha(theme.palette.warning.main, 0.1)
                              : alpha(theme.palette.success.main, 0.1),
                          }
                        }}
                      >
                        {editForm.is_active ? 'Deactivate' : 'Activate'} User
                      </Button>
                    </Box>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(100, 180, 255, 0.1)' }}>
              <Button 
                onClick={handleCloseDialogs} 
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleUpdateUser}
                sx={{ bgcolor: '#1e88e5', '&:hover': { bgcolor: '#1976d2' } }}
              >
                Save Changes
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={handleCloseDialogs}
        maxWidth="xs"
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
        {selectedUser && (
          <>
            <DialogTitle sx={{ 
              borderBottom: '1px solid rgba(100, 180, 255, 0.1)', 
              px: 3, 
              py: 2,
              color: theme.palette.error.main
            }}>
              Confirm Delete
            </DialogTitle>
            <DialogContent sx={{ px: 3, py: 3 }}>
              <Typography variant="body1">
                Are you sure you want to delete the user <strong>{selectedUser.name}</strong>?
              </Typography>
              <Typography variant="body2" sx={{ mt: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                This action cannot be undone. All data associated with this user will be permanently removed.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(100, 180, 255, 0.1)' }}>
              <Button 
                onClick={handleCloseDialogs} 
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleDeleteUser}
                sx={{ bgcolor: theme.palette.error.main, '&:hover': { bgcolor: theme.palette.error.dark } }}
              >
                Delete
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </motion.div>
  );
}