import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  alpha,
  useTheme
} from '@mui/material';
import { 
  CalendarMonth as CalendarIcon,
  AccessTime as ClockIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function Attendance() {
  const { getToken } = useAuth();
  const theme = useTheme();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  
  // Filter state
  const [filters, setFilters] = useState({
    userId: '',
    startDate: null,
    endDate: null,
    status: '',
    viewMode: 'user' // 'user' or 'admin'
  });
  
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

  // Fetch attendance data
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      
      // Convert dates to ISO string if they exist
      const startDateParam = filters.startDate ? filters.startDate.toISOString().split('T')[0] : '';
      const endDateParam = filters.endDate ? filters.endDate.toISOString().split('T')[0] : '';
      
      const response = await axios.get('http://localhost:5000/api/attendance', {
        headers: {
          Authorization: `Bearer ${getToken()}`
        },
        params: {
          page: page + 1, // API uses 1-based indexing
          limit: rowsPerPage,
          userId: filters.userId || undefined,
          startDate: startDateParam || undefined,
          endDate: endDateParam || undefined,
          status: filters.status || undefined
        }
      });
      
      if (response.data.success) {
        setAttendance(response.data.data);
        setTotalRows(response.data.pagination.total);
      } else {
        setError('Failed to fetch attendance data');
      }
    } catch (err) {
      setError('Error connecting to the server');
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users for filter dropdown
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      
      if (response.data.success && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
        console.log('Users fetched successfully:', response.data.users);
      } else {
        console.error('Invalid user data format:', response.data);
        setUsers([]); // Ensure users is at least an empty array
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]); // Ensure users is at least an empty array on error
    }
  };

  // Load data on component mount and when filters or pagination changes
  useEffect(() => {
    fetchAttendance();
  }, [page, rowsPerPage, filters]);

  // Load users on component mount
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
    
    // If changing view mode, also reset other filters
    if (field === 'viewMode') {
      setFilters(prev => ({
        userId: '',
        startDate: prev.startDate,
        endDate: prev.endDate,
        status: '',
        viewMode: value
      }));
    }
    
    setPage(0); // Reset to first page when filters change
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid Date';
    }
  };

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'error';
      case 'late':
        return 'warning';
      case 'half-day':
        return 'info';
      default:
        return 'default';
    }
  };

  // Filter attendance data based on search term
  const filteredAttendance = Array.isArray(attendance) 
    ? attendance.filter(record => {
        if (!searchTerm) return true;
        
        const searchLower = searchTerm.toLowerCase();
        return (
          (record?.userId?.name || '').toLowerCase().includes(searchLower) ||
          (record?.status || '').toLowerCase().includes(searchLower) ||
          (record?.location?.address || '').toLowerCase().includes(searchLower)
        );
      })
    : [];

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
            Attendance Management
          </Typography>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
            Track and manage employee attendance records and time logs.
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
                    placeholder="Search attendance records..."
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
                  <Button
                    startIcon={<RefreshIcon />}
                    onClick={fetchAttendance}
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      '&:hover': { color: '#fff' } 
                    }}
                  >
                    Refresh Data
                  </Button>
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
                      Filter Attendance Records
                    </Typography>
                  </Box>
                  
                  {/* View Mode Toggle */}
                  <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Grid item xs={12}>
                      <Box sx={{ 
                        display: 'flex', 
                        bgcolor: 'rgba(0, 0, 0, 0.2)', 
                        borderRadius: 2,
                        p: 0.5,
                        width: 'fit-content'
                      }}>
                        <Button
                          variant={filters.viewMode === 'user' ? 'contained' : 'text'}
                          onClick={() => handleFilterChange('viewMode', 'user')}
                          sx={{
                            borderRadius: 1.5,
                            minWidth: 120,
                            color: filters.viewMode === 'user' ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                            bgcolor: filters.viewMode === 'user' ? 'primary.main' : 'transparent',
                            '&:hover': {
                              bgcolor: filters.viewMode === 'user' ? 'primary.dark' : 'rgba(255, 255, 255, 0.05)',
                            }
                          }}
                        >
                          User View
                        </Button>
                        <Button
                          variant={filters.viewMode === 'admin' ? 'contained' : 'text'}
                          onClick={() => handleFilterChange('viewMode', 'admin')}
                          sx={{
                            borderRadius: 1.5,
                            minWidth: 120,
                            color: filters.viewMode === 'admin' ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                            bgcolor: filters.viewMode === 'admin' ? 'primary.main' : 'transparent',
                            '&:hover': {
                              bgcolor: filters.viewMode === 'admin' ? 'primary.dark' : 'rgba(255, 255, 255, 0.05)',
                            }
                          }}
                        >
                          Admin View
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Grid container spacing={2} alignItems="center">
                    {filters.viewMode === 'user' && (
                      <>
                        <Grid item xs={12} sm={6} md={3}>
                          <FormControl fullWidth variant="outlined" size="small">
                            <InputLabel id="user-select-label" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              User
                            </InputLabel>
                            <Select
                              labelId="user-select-label"
                              value={filters.userId}
                              label="User"
                              onChange={(e) => handleFilterChange('userId', e.target.value)}
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
                              <MenuItem value="">
                                <em>All Users</em>
                              </MenuItem>
                              {Array.isArray(users) && users.map((user) => (
                                <MenuItem key={user?._id || 'unknown'} value={user?._id || ''}>
                                  {user?.name || 'Unknown User'}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={2}>
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
                              <MenuItem value="">
                                <em>All Statuses</em>
                              </MenuItem>
                              <MenuItem value="present">Present</MenuItem>
                              <MenuItem value="absent">Absent</MenuItem>
                              <MenuItem value="late">Late</MenuItem>
                              <MenuItem value="half-day">Half Day</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </>
                    )}
                    
                    <Grid item xs={12} sm={6} md={filters.viewMode === 'admin' ? 4 : 3}>
                      <TextField
                        label="Start Date"
                        type="date"
                        fullWidth
                        size="small"
                        InputLabelProps={{
                          shrink: true,
                          sx: { color: 'rgba(255, 255, 255, 0.7)' }
                        }}
                        value={filters.startDate ? filters.startDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => handleFilterChange('startDate', e.target.value ? new Date(e.target.value) : null)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
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
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={filters.viewMode === 'admin' ? 4 : 3}>
                      <TextField
                        label="End Date"
                        type="date"
                        fullWidth
                        size="small"
                        InputLabelProps={{
                          shrink: true,
                          sx: { color: 'rgba(255, 255, 255, 0.7)' }
                        }}
                        value={filters.endDate ? filters.endDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => handleFilterChange('endDate', e.target.value ? new Date(e.target.value) : null)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
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
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={filters.viewMode === 'admin' ? 4 : 1}>
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        fullWidth
                        onClick={() => setFilters({
                          userId: '',
                          startDate: null,
                          endDate: null,
                          status: '',
                          viewMode: filters.viewMode // Preserve the view mode
                        })}
                        sx={{
                          borderColor: 'rgba(100, 180, 255, 0.3)',
                          color: '#90caf9',
                          '&:hover': {
                            borderColor: '#1e88e5',
                            backgroundColor: 'rgba(30, 136, 229, 0.08)',
                          }
                        }}
                      >
                        Clear Filters
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                {/* Attendance Table */}
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                    <CircularProgress sx={{ color: theme.palette.primary.main }} />
                  </Box>
                ) : error ? (
                  <Box sx={{ p: 5, textAlign: 'center', bgcolor: 'rgba(244, 67, 54, 0.1)', borderRadius: 2 }}>
                    <Typography sx={{ color: '#ef5350', fontWeight: 500 }}>{error}</Typography>
                  </Box>
                ) : (
                  <>
                    <TableContainer sx={{ 
                      maxHeight: 500,
                      overflowX: 'auto',
                      '&::-webkit-scrollbar': {
                        width: '8px',
                        height: '8px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(100, 180, 255, 0.2)',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-track': {
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      },
                    }}>
                      <Table stickyHeader aria-label="attendance table">
                        <TableHead>
                          <TableRow>
                            <TableCell 
                              sx={{ 
                                backgroundColor: 'rgba(0, 0, 0, 0.2)', 
                                color: 'rgba(255, 255, 255, 0.8)',
                                borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PeopleIcon sx={{ mr: 1, fontSize: 18, color: theme.palette.primary.main }} />
                                User
                              </Box>
                            </TableCell>
                            <TableCell 
                              sx={{ 
                                backgroundColor: 'rgba(0, 0, 0, 0.2)', 
                                color: 'rgba(255, 255, 255, 0.8)',
                                borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CalendarIcon sx={{ mr: 1, fontSize: 18, color: theme.palette.primary.main }} />
                                Date
                              </Box>
                            </TableCell>
                            <TableCell 
                              sx={{ 
                                backgroundColor: 'rgba(0, 0, 0, 0.2)', 
                                color: 'rgba(255, 255, 255, 0.8)',
                                borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ClockIcon sx={{ mr: 1, fontSize: 18, color: theme.palette.primary.main }} />
                                Login Time
                              </Box>
                            </TableCell>
                            <TableCell 
                              sx={{ 
                                backgroundColor: 'rgba(0, 0, 0, 0.2)', 
                                color: 'rgba(255, 255, 255, 0.8)',
                                borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ClockIcon sx={{ mr: 1, fontSize: 18, color: theme.palette.primary.main }} />
                                Logout Time
                              </Box>
                            </TableCell>
                            
                            {/* Only show Status column in User view */}
                            {filters.viewMode === 'user' && (
                              <TableCell 
                                sx={{ 
                                  backgroundColor: 'rgba(0, 0, 0, 0.2)', 
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                                }}
                              >
                                Status
                              </TableCell>
                            )}
                            
                            {/* Only show Location column in User view */}
                            {filters.viewMode === 'user' && (
                              <TableCell 
                                sx={{ 
                                  backgroundColor: 'rgba(0, 0, 0, 0.2)', 
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <LocationIcon sx={{ mr: 1, fontSize: 18, color: theme.palette.primary.main }} />
                                  Location
                                </Box>
                              </TableCell>
                            )}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredAttendance.length > 0 ? (
                            filteredAttendance.map((record) => (
                              <TableRow 
                                key={record?._id || `record-${Math.random()}`} 
                                hover
                                sx={{ 
                                  '&:hover': { 
                                    backgroundColor: 'rgba(30, 136, 229, 0.08)' 
                                  },
                                  '& .MuiTableCell-root': {
                                    borderBottom: '1px solid rgba(100, 180, 255, 0.05)',
                                    color: '#fff',
                                  }
                                }}
                              >
                                <TableCell>
                                  <Box sx={{ fontWeight: 500 }}>
                                    {record?.userId?.name || 'Unknown User'}
                                  </Box>
                                </TableCell>
                                <TableCell>{record?.date || 'N/A'}</TableCell>
                                <TableCell>{formatDate(record?.loginTime)}</TableCell>
                                <TableCell>{formatDate(record?.logoutTime)}</TableCell>
                                
                                {/* Only show Status cell in User view */}
                                {filters.viewMode === 'user' && (
                                  <TableCell>
                                    {record?.status ? (
                                      <Chip 
                                        label={record.status.charAt(0).toUpperCase() + record.status.slice(1)} 
                                        color={getStatusColor(record.status)}
                                        size="small"
                                        sx={{ 
                                          fontWeight: 500,
                                          fontSize: '0.75rem'
                                        }}
                                      />
                                    ) : (
                                      'N/A'
                                    )}
                                  </TableCell>
                                )}
                                
                                {/* Only show Location cell in User view */}
                                {filters.viewMode === 'user' && (
                                  <TableCell>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        maxWidth: 200,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                      }}
                                      title={record?.location?.address || 'No location data'}
                                    >
                                      {record?.location?.address || 'No location data'}
                                    </Typography>
                                  </TableCell>
                                )}
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell 
                                colSpan={filters.viewMode === 'user' ? 6 : 4} 
                                align="center"
                                sx={{ 
                                  py: 4, 
                                  color: 'rgba(255, 255, 255, 0.5)',
                                  borderBottom: '1px solid rgba(100, 180, 255, 0.05)'
                                }}
                              >
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="body1" sx={{ mb: 1 }}>
                                    No attendance records found
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                                    Try adjusting your filters or search criteria
                                  </Typography>
                                </Box>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      component="div"
                      count={totalRows}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        '& .MuiTablePagination-selectIcon': {
                          color: 'rgba(255, 255, 255, 0.5)'
                        },
                        '& .MuiTablePagination-select': {
                          color: '#fff'
                        },
                        '& .MuiTablePagination-selectLabel': {
                          color: 'rgba(255, 255, 255, 0.7)'
                        },
                        '& .MuiTablePagination-displayedRows': {
                          color: 'rgba(255, 255, 255, 0.7)'
                        },
                        '& .MuiIconButton-root.Mui-disabled': {
                          color: 'rgba(255, 255, 255, 0.3)'
                        },
                        '& .MuiIconButton-root': {
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
    </motion.div>
  );
}
