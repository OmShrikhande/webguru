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
    status: ''
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
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
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

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user?.mobile || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user?.department || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !filters.department || user?.department === filters.department;
    const matchesStatus = !filters.status || 
      (filters.status === 'active' && user?.is_active) ||
      (filters.status === 'inactive' && !user?.is_active);
    
    return matchesSearch && matchesDepartment && matchesStatus;
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
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
                  <Box>
                    <Button
                      startIcon={<RefreshIcon />}
                      onClick={fetchUsers}
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)', 
                        '&:hover': { color: '#fff' },
                        mr: 1
                      }}
                    >
                      Refresh
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      sx={{
                        bgcolor: '#1e88e5',
                        '&:hover': { bgcolor: '#1976d2' },
                        borderRadius: 2
                      }}
                    >
                      Add User
                    </Button>
                  </Box>
                </Box>

                {/* Filters */}
                <Box sx={{ 
                  p: 2, 
                  mb: 3, 
                  bgcolor: 'rgba(0, 0, 0, 0.15)', 
                  borderRadius: 2,
                  border: '1px solid rgba(100, 180, 255, 0.08)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FilterListIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 500 }}>
                      Filter Users
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel id="department-select-label" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Department
                        </InputLabel>
                        <Select
                          labelId="department-select-label"
                          value={filters.department}
                          label="Department"
                          onChange={(e) => handleFilterChange('department', e.target.value)}
                          sx={{
                            color: '#fff',
                            '.MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(255, 255, 255, 0.2)',
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
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel id="status-select-label" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Status
                        </InputLabel>
                        <Select
                          labelId="status-select-label"
                          value={filters.status}
                          label="Status"
                          onChange={(e) => handleFilterChange('status', e.target.value)}
                          sx={{
                            color: '#fff',
                            '.MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(255, 255, 255, 0.2)',
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
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setFilters({ department: '', status: '' });
                          setSearchTerm('');
                        }}
                        sx={{
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            borderColor: 'rgba(255, 255, 255, 0.4)',
                            bgcolor: 'rgba(255, 255, 255, 0.05)'
                          }
                        }}
                      >
                        Clear Filters
                      </Button>
                    </Grid>
                  </Grid>
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
                  <Typography variant="h6">{selectedUser.name}</Typography>
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