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
  Avatar
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  Search as SearchIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

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

  // Fetch admin data
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const token = getToken();
        
        if (!token) {
          setError('Authentication token not found. Please login again.');
          // For demo purposes, use sample data if no token
          setAdmins(sampleAdmins);
          setLoading(false);
          return;
        }
        
        const response = await axios.get('http://localhost:5000/api/master/admins', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
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
  }, [getToken]);

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
        const token = getToken();
        
        if (!token) {
          setError('Authentication token not found. Please login again.');
          // For demo purposes, use sample data if no token
          setAdmins(sampleAdmins);
          setLoading(false);
          return;
        }
        
        const response = await axios.get('http://localhost:5000/api/master/admins', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
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
            sx={{
              bgcolor: '#1e88e5',
              '&:hover': {
                bgcolor: '#1976d2',
              },
              borderRadius: 2,
              px: 2,
            }}
          >
            Admin Actions
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
    </motion.div>
  );
};

export default Admin;