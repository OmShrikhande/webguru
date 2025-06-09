import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  InputAdornment, 
  Card, 
  CardContent, 
  Grid,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  alpha
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Search as SearchIcon, 
  Add as AddIcon, 
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  Shield as ShieldIcon,
  SupervisorAccount as SupervisorIcon,
  Visibility as VisibilityIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Sample data
const generateUsers = (count) => {
  const roles = ['Admin', 'Manager', 'Employee', 'Guest'];
  const statuses = ['Active', 'Inactive', 'Pending', 'Suspended'];
  const names = [
    'John Smith', 'Emma Johnson', 'Michael Williams', 'Olivia Brown', 
    'William Jones', 'Sophia Miller', 'James Davis', 'Isabella Garcia', 
    'Robert Martinez', 'Mia Rodriguez', 'David Wilson', 'Charlotte Anderson',
    'Joseph Taylor', 'Amelia Thomas', 'Daniel Moore', 'Harper Jackson',
    'Matthew Martin', 'Evelyn Lee', 'Andrew Perez', 'Abigail Thompson'
  ];
  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length],
    email: names[i % names.length].replace(' ', '.').toLowerCase() + '@webguru.com',
    role: roles[Math.floor(Math.random() * roles.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    lastLogin: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

const Users = () => {
  const [users] = useState(generateUsers(20));
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  // Handle actions menu
  const handleActionClick = (event, user) => {
    setSelectedUser(user);
    setActionAnchorEl(event.currentTarget);
  };
  
  const handleActionClose = () => {
    setActionAnchorEl(null);
  };
  
  // Handle filter menu
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  
  // Handle dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleActionClose();
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Filter users based on search term and active tab
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tab
    switch (tabValue) {
      case 0: // All users
        return matchesSearch;
      case 1: // Admin
        return matchesSearch && user.role === 'Admin';
      case 2: // Active
        return matchesSearch && user.status === 'Active';
      case 3: // Inactive
        return matchesSearch && (user.status === 'Inactive' || user.status === 'Suspended');
      default:
        return matchesSearch;
    }
  });
  
  // DataGrid columns
  const columns = [
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: 
                params.row.role === 'Admin' ? '#1e88e5' : 
                params.row.role === 'Manager' ? '#43a047' : 
                params.row.role === 'Employee' ? '#fb8c00' : '#757575',
              mr: 1.5
            }}
          >
            {params.value.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>
              {params.value}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      )
    },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 140,
      renderCell: (params) => {
        const roleColors = {
          'Admin': { bg: alpha('#1e88e5', 0.15), color: '#42a5f5', icon: <ShieldIcon fontSize="small" /> },
          'Manager': { bg: alpha('#43a047', 0.15), color: '#66bb6a', icon: <SupervisorIcon fontSize="small" /> },
          'Employee': { bg: alpha('#fb8c00', 0.15), color: '#ffb74d', icon: <PersonIcon fontSize="small" /> },
          'Guest': { bg: alpha('#757575', 0.15), color: '#bdbdbd', icon: <VisibilityIcon fontSize="small" /> }
        };
        
        const roleStyle = roleColors[params.value] || roleColors['Guest'];
        
        return (
          <Chip
            icon={roleStyle.icon}
            label={params.value}
            size="small"
            sx={{
              bgcolor: roleStyle.bg,
              color: roleStyle.color,
              '& .MuiChip-icon': { color: roleStyle.color },
              fontWeight: 500,
              fontSize: '0.75rem',
            }}
          />
        );
      }
    },
    { 
      field: 'department', 
      headerName: 'Department', 
      width: 130,
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      renderCell: (params) => {
        const statusColors = {
          'Active': { bg: alpha('#43a047', 0.15), color: '#66bb6a' },
          'Inactive': { bg: alpha('#757575', 0.15), color: '#bdbdbd' },
          'Pending': { bg: alpha('#fb8c00', 0.15), color: '#ffb74d' },
          'Suspended': { bg: alpha('#e53935', 0.15), color: '#ef5350' }
        };
        
        const statusStyle = statusColors[params.value] || statusColors['Inactive'];
        
        return (
          <Chip
            label={params.value}
            size="small"
            sx={{
              bgcolor: statusStyle.bg,
              color: statusStyle.color,
              fontWeight: 500,
              fontSize: '0.75rem'
            }}
          />
        );
      }
    },
    { 
      field: 'lastLogin', 
      headerName: 'Last Login', 
      width: 160,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleString();
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          onClick={(e) => handleActionClick(e, params.row)}
          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          <MoreVertIcon />
        </IconButton>
      )
    }
  ];
  
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
            User Management
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            View and manage all user accounts and permissions.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          sx={{
            bgcolor: '#1e88e5',
            '&:hover': {
              bgcolor: '#1976d2',
            },
            borderRadius: 2,
            px: 2,
          }}
        >
          Add User
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ 
            bgcolor: 'rgba(25, 35, 60, 0.6)',
            borderRadius: 3,
            border: '1px solid rgba(100, 180, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
                    startIcon={<FilterListIcon />}
                    onClick={handleFilterClick}
                    sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1 }}
                  >
                    Filter
                  </Button>
                  <Button
                    startIcon={<DownloadIcon />}
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    Export
                  </Button>
                </Box>
              </Box>
              
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{
                  mb: 2,
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
                <Tab label={`All Users (${users.length})`} />
                <Tab label={`Admins (${users.filter(u => u.role === 'Admin').length})`} />
                <Tab label={`Active (${users.filter(u => u.status === 'Active').length})`} />
                <Tab label={`Inactive (${users.filter(u => u.status === 'Inactive' || u.status === 'Suspended').length})`} />
              </Tabs>
              
              <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                  rows={filteredUsers}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10 },
                    },
                    sorting: {
                      sortModel: [{ field: 'lastLogin', sort: 'desc' }],
                    },
                  }}
                  pageSizeOptions={[5, 10, 25]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  getRowClassName={() => 'data-grid-row'}
                  sx={{
                    border: 'none',
                    color: '#fff',
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                    },
                    '& .MuiDataGrid-cell': {
                      borderBottom: '1px solid rgba(100, 180, 255, 0.05)',
                    },
                    '& .MuiDataGrid-row:hover': {
                      backgroundColor: 'rgba(30, 136, 229, 0.08)',
                    },
                    '& .MuiDataGrid-footerContainer': {
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      borderTop: '1px solid rgba(100, 180, 255, 0.1)',
                    },
                    '& .MuiTablePagination-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiCheckbox-root': {
                      color: 'rgba(255, 255, 255, 0.5)',
                    },
                    '& .MuiDataGrid-columnSeparator': {
                      display: 'none',
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* User Action Menu */}
      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl)}
        onClose={handleActionClose}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(25, 35, 60, 0.95)',
            border: '1px solid rgba(100, 180, 255, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            borderRadius: 2,
          }
        }}
      >
        <MenuItem onClick={handleOpenDialog}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" sx={{ color: '#90caf9' }} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ color: '#fff' }}>View Details</Typography>
        </MenuItem>
        <MenuItem onClick={handleActionClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" sx={{ color: '#90caf9' }} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ color: '#fff' }}>Edit User</Typography>
        </MenuItem>
        <MenuItem onClick={handleActionClose}>
          <ListItemIcon>
            {selectedUser?.status === 'Active' ? (
              <LockIcon fontSize="small" sx={{ color: '#f48fb1' }} />
            ) : (
              <LockOpenIcon fontSize="small" sx={{ color: '#81c784' }} />
            )}
          </ListItemIcon>
          <Typography variant="body2" sx={{ color: '#fff' }}>
            {selectedUser?.status === 'Active' ? 'Deactivate' : 'Activate'}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleActionClose}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: '#f48fb1' }} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ color: '#fff' }}>Delete</Typography>
        </MenuItem>
      </Menu>
      
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
        <MenuItem onClick={handleFilterClose}>
          <Typography variant="body2" sx={{ color: '#fff' }}>All Departments</Typography>
        </MenuItem>
        <MenuItem onClick={handleFilterClose}>
          <Typography variant="body2" sx={{ color: '#fff' }}>IT Department</Typography>
        </MenuItem>
        <MenuItem onClick={handleFilterClose}>
          <Typography variant="body2" sx={{ color: '#fff' }}>HR Department</Typography>
        </MenuItem>
        <MenuItem onClick={handleFilterClose}>
          <Typography variant="body2" sx={{ color: '#fff' }}>Finance Department</Typography>
        </MenuItem>
        <MenuItem onClick={handleFilterClose}>
          <Typography variant="body2" sx={{ color: '#fff' }}>Marketing Department</Typography>
        </MenuItem>
      </Menu>
      
      {/* User Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
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
            }}>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: 
                    selectedUser.role === 'Admin' ? '#1e88e5' : 
                    selectedUser.role === 'Manager' ? '#43a047' : 
                    selectedUser.role === 'Employee' ? '#fb8c00' : '#757575',
                  mr: 2
                }}
              >
                {selectedUser.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6">{selectedUser.name}</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {selectedUser.email}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ px: 3, py: 2 }}>
              <Grid container spacing={2} sx={{ mt: 0 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                    Role
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedUser.role}
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
                    label={selectedUser.status}
                    size="small"
                    sx={{
                      bgcolor: 
                        selectedUser.status === 'Active' ? alpha('#43a047', 0.15) : 
                        selectedUser.status === 'Pending' ? alpha('#fb8c00', 0.15) : 
                        selectedUser.status === 'Suspended' ? alpha('#e53935', 0.15) : 
                        alpha('#757575', 0.15),
                      color: 
                        selectedUser.status === 'Active' ? '#66bb6a' : 
                        selectedUser.status === 'Pending' ? '#ffb74d' : 
                        selectedUser.status === 'Suspended' ? '#ef5350' : 
                        '#bdbdbd',
                      fontWeight: 500,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                    Last Login
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {new Date(selectedUser.lastLogin).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                    Account Created
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ 
                    mt: 1, 
                    p: 2, 
                    bgcolor: 'rgba(0, 0, 0, 0.2)', 
                    borderRadius: 2,
                    border: '1px solid rgba(100, 180, 255, 0.05)'
                  }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                      Permissions
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Chip label="View Users" size="small" sx={{ bgcolor: 'rgba(25, 118, 210, 0.15)', color: '#90caf9' }} />
                      <Chip label="Edit Users" size="small" sx={{ bgcolor: 'rgba(25, 118, 210, 0.15)', color: '#90caf9' }} />
                      <Chip label="Delete Users" size="small" sx={{ bgcolor: 'rgba(25, 118, 210, 0.15)', color: '#90caf9' }} />
                      <Chip label="View Reports" size="small" sx={{ bgcolor: 'rgba(25, 118, 210, 0.15)', color: '#90caf9' }} />
                      <Chip label="Manage Settings" size="small" sx={{ bgcolor: 'rgba(25, 118, 210, 0.15)', color: '#90caf9' }} />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(100, 180, 255, 0.1)' }}>
              <Button 
                onClick={handleCloseDialog} 
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Close
              </Button>
              <Button 
                variant="contained" 
                onClick={handleCloseDialog}
                startIcon={<EditIcon />}
                sx={{ bgcolor: '#1e88e5', '&:hover': { bgcolor: '#1976d2' } }}
              >
                Edit User
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </motion.div>
  );
};

export default Users;