import React, { useState, useEffect } from 'react';
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
  IconButton,
  Button,
  Tooltip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Grid
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  Search as SearchIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { adminApi } from '../services/api';

// Sample admin data (will be replaced with API data)
const sampleAdmins = [
  {
    _id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    department: 'IT',
    position: 'System Administrator',
    isActive: true,
    lastLogin: new Date().toISOString(),
    loginHistory: [
      {
        loginTime: new Date(Date.now() - 3600000).toISOString(),
        logoutTime: new Date().toISOString(),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      {
        loginTime: new Date(Date.now() - 86400000).toISOString(),
        logoutTime: new Date(Date.now() - 82800000).toISOString(),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    ]
  },
  {
    _id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    department: 'HR',
    position: 'HR Manager',
    isActive: true,
    lastLogin: new Date(Date.now() - 7200000).toISOString(),
    loginHistory: [
      {
        loginTime: new Date(Date.now() - 7200000).toISOString(),
        logoutTime: null,
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
      }
    ]
  },
  {
    _id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@example.com',
    department: 'Finance',
    position: 'Financial Analyst',
    isActive: false,
    lastLogin: new Date(Date.now() - 604800000).toISOString(),
    loginHistory: []
  }
];

const Admin = () => {
  const { user, getToken } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add Admin Modal State
  const [openAddAdminModal, setOpenAddAdminModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    department: 'IT',
    position: 'Administrator',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch admin data
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        
        try {
          const response = await adminApi.getAllAdmins();
          
          if (response.data.success) {
            setAdmins(response.data.admins);
          } else {
            setError('Failed to fetch admin data');
            // For demo purposes, use sample data if API fails
            setAdmins(sampleAdmins);
          }
        } catch (error) {
          console.error('Error fetching admins:', error);
          setError(error.response?.data?.message || 'Failed to fetch admin data');
          // For demo purposes, use sample data if API fails
          setAdmins(sampleAdmins);
        } finally {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in fetchAdmins:', error);
        setAdmins(sampleAdmins);
        setLoading(false);
      }
    };
    
    fetchAdmins();
  }, []);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Handle refresh
  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    const fetchAdmins = async () => {
      try {
        const response = await adminApi.getAllAdmins();
        
        if (response.data.success) {
          setAdmins(response.data.admins);
        } else {
          setError('Failed to fetch admin data');
          // For demo purposes, use sample data if API fails
          setAdmins(sampleAdmins);
        }
      } catch (error) {
        console.error('Error fetching admins:', error);
        setError(error.response?.data?.message || 'Failed to fetch admin data');
        // For demo purposes, use sample data if API fails
        setAdmins(sampleAdmins);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdmins();
  };
  
  // Handle input change for new admin form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin({
      ...newAdmin,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!newAdmin.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!newAdmin.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!newAdmin.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newAdmin.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!newAdmin.password.trim()) {
      errors.password = 'Password is required';
    } else if (newAdmin.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!newAdmin.department.trim()) {
      errors.department = 'Department is required';
    }
    
    if (!newAdmin.position.trim()) {
      errors.position = 'Position is required';
    }
    
    return errors;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await adminApi.createAdmin(newAdmin);
      
      if (response.data.success) {
        // Add the new admin to the list
        setAdmins([response.data.admin, ...admins]);
        
        // Close modal and reset form
        setOpenAddAdminModal(false);
        setNewAdmin({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          department: 'IT',
          position: 'Administrator',
          phone: ''
        });
        
        // Show success message
        setSnackbar({
          open: true,
          message: 'Admin created successfully',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: response.data.message || 'Failed to create admin',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to create admin',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Filter admins based on search term
  const filteredAdmins = admins.filter(admin => 
    admin.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
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
            Admin Management
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            View and manage administrator accounts and their login activities.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
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
          <Button
            variant="contained"
            startIcon={<AdminPanelSettingsIcon />}
            onClick={() => setOpenAddAdminModal(true)}
            sx={{
              bgcolor: '#1e88e5',
              '&:hover': {
                bgcolor: '#1976d2',
              },
              borderRadius: 2,
              px: 2,
            }}
          >
            Add Admin
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search admins by name, email, department..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1e88e5',
              }
            }
          }}
        />
      </Box>
      
      {/* Admin Data Table */}
      <Paper 
        sx={{ 
          width: '100%', 
          overflow: 'hidden',
          bgcolor: 'rgba(25, 35, 60, 0.6)',
          borderRadius: 2,
          border: '1px solid rgba(100, 180, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell 
                      sx={{ 
                        bgcolor: 'rgba(30, 136, 229, 0.2)', 
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        bgcolor: 'rgba(30, 136, 229, 0.2)', 
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      Email
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        bgcolor: 'rgba(30, 136, 229, 0.2)', 
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      Last Check-In Time
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        bgcolor: 'rgba(30, 136, 229, 0.2)', 
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      Last Check-Out Time
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        bgcolor: 'rgba(30, 136, 229, 0.2)', 
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAdmins
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((admin) => {
                      // Get the most recent login history entry
                      const lastLogin = admin.loginHistory && admin.loginHistory.length > 0 
                        ? admin.loginHistory[0] 
                        : null;
                      
                      return (
                        <TableRow 
                          key={admin._id}
                          hover
                          sx={{ 
                            '&:hover': { 
                              bgcolor: 'rgba(30, 136, 229, 0.1)' 
                            }
                          }}
                        >
                          <TableCell sx={{ color: 'white' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                sx={{ 
                                  bgcolor: admin.isActive ? '#1e88e5' : 'grey',
                                  mr: 2,
                                  width: 36,
                                  height: 36
                                }}
                              >
                                {admin.firstName?.charAt(0) || admin.lastName?.charAt(0) || admin.email?.charAt(0)}
                              </Avatar>
                              <Typography>
                                {`${admin.firstName || ''} ${admin.lastName || ''}`.trim()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: 'white' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <EmailIcon sx={{ mr: 1, fontSize: 18, color: '#90caf9' }} />
                              {admin.email}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: 'white' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTimeIcon sx={{ mr: 1, fontSize: 18, color: '#4caf50' }} />
                              {lastLogin ? formatDate(lastLogin.loginTime) : 'Never logged in'}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: 'white' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTimeIcon sx={{ mr: 1, fontSize: 18, color: '#f44336' }} />
                              {lastLogin && lastLogin.logoutTime ? formatDate(lastLogin.logoutTime) : 'Still active or never logged out'}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={admin.isActive ? 'Active' : 'Inactive'} 
                              size="small"
                              icon={admin.isActive ? <CheckCircleIcon /> : <CancelIcon />}
                              sx={{ 
                                bgcolor: admin.isActive ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                                color: admin.isActive ? '#4caf50' : '#f44336',
                                borderColor: admin.isActive ? '#4caf50' : '#f44336',
                                '& .MuiChip-icon': {
                                  color: admin.isActive ? '#4caf50' : '#f44336',
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {filteredAdmins.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ color: 'white', py: 3 }}>
                        {searchTerm ? 'No admins match your search criteria' : 'No admins found'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredAdmins.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ 
                color: 'white',
                '.MuiTablePagination-selectIcon': { color: 'white' },
                '.MuiTablePagination-select': { color: 'white' },
                '.MuiTablePagination-selectLabel': { color: 'white' },
                '.MuiTablePagination-displayedRows': { color: 'white' },
                '.MuiTablePagination-actions': { color: 'white' },
              }}
            />
          </>
        )}
      </Paper>
      {/* Add Admin Modal */}
      <Dialog 
        open={openAddAdminModal} 
        onClose={() => setOpenAddAdminModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(25, 35, 60, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            border: '1px solid rgba(100, 180, 255, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <AddIcon sx={{ mr: 1 }} /> Add New Admin
            </Typography>
            <IconButton 
              onClick={() => setOpenAddAdminModal(false)}
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={newAdmin.firstName}
                  onChange={handleInputChange}
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1e88e5',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiFormHelperText-root': {
                      color: '#f44336',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={newAdmin.lastName}
                  onChange={handleInputChange}
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1e88e5',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiFormHelperText-root': {
                      color: '#f44336',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={newAdmin.email}
                  onChange={handleInputChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1e88e5',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiFormHelperText-root': {
                      color: '#f44336',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={newAdmin.password}
                  onChange={handleInputChange}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1e88e5',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiFormHelperText-root': {
                      color: '#f44336',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl 
                  fullWidth
                  error={!!formErrors.department}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1e88e5',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiFormHelperText-root': {
                      color: '#f44336',
                    },
                    '& .MuiSelect-icon': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                >
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="department"
                    value={newAdmin.department}
                    onChange={handleInputChange}
                    label="Department"
                  >
                    <MenuItem value="IT">IT</MenuItem>
                    <MenuItem value="HR">HR</MenuItem>
                    <MenuItem value="Finance">Finance</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                    <MenuItem value="Operations">Operations</MenuItem>
                    <MenuItem value="Sales">Sales</MenuItem>
                    <MenuItem value="Customer Support">Customer Support</MenuItem>
                  </Select>
                  {formErrors.department && (
                    <Typography variant="caption" color="error">
                      {formErrors.department}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Position"
                  name="position"
                  value={newAdmin.position}
                  onChange={handleInputChange}
                  error={!!formErrors.position}
                  helperText={formErrors.position}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1e88e5',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiFormHelperText-root': {
                      color: '#f44336',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={newAdmin.phone}
                  onChange={handleInputChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1e88e5',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button 
            onClick={() => setOpenAddAdminModal(false)}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': { color: 'white' }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <AddIcon />}
            sx={{
              bgcolor: '#1e88e5',
              '&:hover': {
                bgcolor: '#1976d2',
              },
              '&.Mui-disabled': {
                bgcolor: 'rgba(30, 136, 229, 0.5)',
              }
            }}
          >
            {isSubmitting ? 'Creating...' : 'Create Admin'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          sx: {
            bgcolor: snackbar.severity === 'success' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
            color: 'white',
            fontWeight: 'medium',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          }
        }}
      />
    </motion.div>
  );
};

export default Admin;