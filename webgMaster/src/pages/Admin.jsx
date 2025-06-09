import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardHeader, 
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Button,
  Divider,
  LinearProgress,
  Tooltip,
  Alert,
  Badge,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  Avatar,
  alpha
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  BackupTable as BackupIcon,
  Code as CodeIcon,
  BugReport as BugIcon,
  NetworkCheck as NetworkIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  Search as SearchIcon,
  PowerSettingsNew as PowerIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  Dns as DnsIcon,
  People as PeopleIcon,
  ManageAccounts as ManageAccountsIcon,
  ViewList as ViewListIcon,
  LibraryAddCheck as LibraryAddCheckIcon,
  AdminPanelSettings as AdminPanelSettingsIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const serverMetrics = {
  cpu: 42,
  memory: 63,
  disk: 78,
  network: 34,
  uptime: '23 days, 4 hours, 12 minutes',
  lastRestart: '2023-04-10 02:14:36',
  activeSessions: 187,
};

const recentLogs = [
  { id: 1, type: 'error', message: 'Failed login attempt - IP: 192.168.1.34', timestamp: '2023-05-01 14:23:45' },
  { id: 2, type: 'warning', message: 'Unusual traffic detected - Rate limiting applied', timestamp: '2023-05-01 13:45:12' },
  { id: 3, type: 'info', message: 'System backup completed successfully', timestamp: '2023-05-01 12:00:00' },
  { id: 4, type: 'info', message: 'User "admin" changed system settings', timestamp: '2023-05-01 11:34:22' },
  { id: 5, type: 'error', message: 'Database connection timeout - Reconnected after 3 attempts', timestamp: '2023-05-01 10:12:56' },
  { id: 6, type: 'warning', message: 'CPU usage exceeded 80% for 5 minutes', timestamp: '2023-05-01 09:45:23' },
];

const Admin = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [searchLog, setSearchLog] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [apiLogs, setApiLogs] = useState(true);
  const [userTracking, setUserTracking] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredLogs = recentLogs.filter(log => 
    log.message.toLowerCase().includes(searchLog.toLowerCase()) ||
    log.type.toLowerCase().includes(searchLog.toLowerCase()) ||
    log.timestamp.includes(searchLog)
  );
  
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
            Admin Control Panel
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Advanced system administration and monitoring tools.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Refresh Data">
            <IconButton 
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
          <Tab label="Dashboard" icon={<SpeedIcon />} iconPosition="start" />
          <Tab label="System" icon={<StorageIcon />} iconPosition="start" />
          <Tab label="Security" icon={<SecurityIcon />} iconPosition="start" />
          <Tab label="Logs" icon={<ViewListIcon />} iconPosition="start" />
          <Tab label="Permissions" icon={<ManageAccountsIcon />} iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* Dashboard Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Server Stats */}
          <Grid item xs={12} md={8}>
            <Card sx={{ 
              bgcolor: 'rgba(25, 35, 60, 0.6)',
              borderRadius: 2,
              border: '1px solid rgba(100, 180, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              height: '100%',
            }}>
              <CardHeader 
                title={
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    Server Status
                  </Typography>
                } 
                action={
                  <Tooltip title="Refresh Server Status">
                    <IconButton sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                }
                sx={{ 
                  borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                  pb: 1,
                }}
              />
              <CardContent>
                <Grid container spacing={3}>
                  {/* Server Uptime Card */}
                  <Grid item xs={12}>
                    <Paper sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(30, 136, 229, 0.1)', 
                      border: '1px solid rgba(100, 180, 255, 0.1)',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}>
                      <Box sx={{ 
                        bgcolor: 'rgba(30, 136, 229, 0.2)', 
                        p: 1.5, 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <PowerIcon sx={{ color: '#42a5f5', fontSize: 28 }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                          Server Uptime
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                          {serverMetrics.uptime}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          Last restart: {serverMetrics.lastRestart}
                        </Typography>
                      </Box>
                      <Box sx={{ ml: 'auto' }}>
                        <Button 
                          variant="outlined" 
                          size="small"
                          sx={{ 
                            color: '#f44336', 
                            borderColor: 'rgba(244, 67, 54, 0.5)',
                            '&:hover': {
                              borderColor: '#f44336',
                              bgcolor: 'rgba(244, 67, 54, 0.1)',
                            }
                          }}
                        >
                          Restart
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  {/* CPU Usage */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <SpeedIcon sx={{ color: '#42a5f5', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          CPU Usage
                        </Typography>
                      </Box>
                      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
                        {serverMetrics.cpu}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={serverMetrics.cpu} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: serverMetrics.cpu > 80 ? '#f44336' : serverMetrics.cpu > 60 ? '#ff9800' : '#4caf50',
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  {/* Memory Usage */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <MemoryIcon sx={{ color: '#42a5f5', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Memory Usage
                        </Typography>
                      </Box>
                      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
                        {serverMetrics.memory}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={serverMetrics.memory} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: serverMetrics.memory > 80 ? '#f44336' : serverMetrics.memory > 60 ? '#ff9800' : '#4caf50',
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  {/* Disk Usage */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <StorageIcon sx={{ color: '#42a5f5', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Disk Usage
                        </Typography>
                      </Box>
                      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
                        {serverMetrics.disk}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={serverMetrics.disk} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: serverMetrics.disk > 80 ? '#f44336' : serverMetrics.disk > 60 ? '#ff9800' : '#4caf50',
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  {/* Network Usage */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <NetworkIcon sx={{ color: '#42a5f5', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Network
                        </Typography>
                      </Box>
                      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
                        {serverMetrics.network}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={serverMetrics.network} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: serverMetrics.network > 80 ? '#f44336' : serverMetrics.network > 60 ? '#ff9800' : '#4caf50',
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  {/* Active Sessions */}
                  <Grid item xs={12}>
                    <Paper sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(0, 0, 0, 0.2)', 
                      border: '1px solid rgba(100, 180, 255, 0.1)',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}>
                      <Box sx={{ 
                        bgcolor: 'rgba(76, 175, 80, 0.2)', 
                        p: 1.5, 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <PeopleIcon sx={{ color: '#81c784', fontSize: 28 }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                          Active User Sessions
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                          {serverMetrics.activeSessions} users online
                        </Typography>
                      </Box>
                      <Box sx={{ ml: 'auto' }}>
                        <Button 
                          variant="outlined" 
                          size="small"
                          sx={{ 
                            color: '#42a5f5', 
                            borderColor: 'rgba(66, 165, 245, 0.5)',
                            '&:hover': {
                              borderColor: '#42a5f5',
                              bgcolor: 'rgba(66, 165, 245, 0.1)',
                            }
                          }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              bgcolor: 'rgba(25, 35, 60, 0.6)',
              borderRadius: 2,
              border: '1px solid rgba(100, 180, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              height: '100%',
            }}>
              <CardHeader 
                title={
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    Quick Actions
                  </Typography>
                } 
                sx={{ 
                  borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                  pb: 1,
                }}
              />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <LibraryAddCheckIcon sx={{ color: '#42a5f5' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Run System Check" 
                      secondary="Verify system integrity and security" 
                      primaryTypographyProps={{ color: '#fff' }}
                      secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                    />
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ 
                        color: '#42a5f5', 
                        borderColor: 'rgba(66, 165, 245, 0.5)',
                        '&:hover': {
                          borderColor: '#42a5f5',
                          bgcolor: 'rgba(66, 165, 245, 0.1)',
                        }
                      }}
                    >
                      Run
                    </Button>
                  </ListItem>
                  <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <ListItem>
                    <ListItemIcon>
                      <BackupIcon sx={{ color: '#42a5f5' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Backup System" 
                      secondary="Create full system backup" 
                      primaryTypographyProps={{ color: '#fff' }}
                      secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                    />
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ 
                        color: '#42a5f5', 
                        borderColor: 'rgba(66, 165, 245, 0.5)',
                        '&:hover': {
                          borderColor: '#42a5f5',
                          bgcolor: 'rgba(66, 165, 245, 0.1)',
                        }
                      }}
                    >
                      Backup
                    </Button>
                  </ListItem>
                  <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <ListItem>
                    <ListItemIcon>
                      <BugIcon sx={{ color: '#ff9800' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Debug Mode" 
                      secondary="Enable detailed system logging" 
                      primaryTypographyProps={{ color: '#fff' }}
                      secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                    />
                    <Switch 
                      checked={debugMode} 
                      onChange={() => setDebugMode(!debugMode)} 
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#ff9800',
                          '&:hover': {
                            backgroundColor: alpha('#ff9800', 0.1),
                          },
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#ff9800',
                        },
                      }}
                    />
                  </ListItem>
                  <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <ListItem>
                    <ListItemIcon>
                      <LockIcon sx={{ color: maintenanceMode ? '#f44336' : '#42a5f5' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Maintenance Mode" 
                      secondary={maintenanceMode ? "System in maintenance mode" : "System accessible to users"} 
                      primaryTypographyProps={{ color: '#fff' }}
                      secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                    />
                    <Switch 
                      checked={maintenanceMode} 
                      onChange={() => setMaintenanceMode(!maintenanceMode)} 
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#f44336',
                          '&:hover': {
                            backgroundColor: alpha('#f44336', 0.1),
                          },
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#f44336',
                        },
                      }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Recent Logs */}
          <Grid item xs={12}>
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
                    Recent System Logs
                  </Typography>
                } 
                action={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      placeholder="Search logs..."
                      variant="outlined"
                      size="small"
                      value={searchLog}
                      onChange={(e) => setSearchLog(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        width: 200,
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
                    <IconButton sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      <RefreshIcon />
                    </IconButton>
                  </Box>
                }
                sx={{ 
                  borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                  pb: 1,
                }}
              />
              <CardContent>
                <List>
                  {filteredLogs.map((log) => (
                    <ListItem key={log.id} sx={{ py: 1 }}>
                      <ListItemIcon>
                        {log.type === 'error' ? (
                          <Badge color="error" variant="dot" sx={{ '& .MuiBadge-dot': { width: 10, height: 10 } }}>
                            <BugIcon sx={{ color: '#f44336' }} />
                          </Badge>
                        ) : log.type === 'warning' ? (
                          <Badge color="warning" variant="dot" sx={{ '& .MuiBadge-dot': { width: 10, height: 10 } }}>
                            <WarningIcon sx={{ color: '#ff9800' }} />
                          </Badge>
                        ) : (
                          <Badge color="info" variant="dot" sx={{ '& .MuiBadge-dot': { width: 10, height: 10 } }}>
                            <InfoIcon sx={{ color: '#2196f3' }} />
                          </Badge>
                        )}
                      </ListItemIcon>
                      <ListItemText 
                        primary={log.message}
                        secondary={log.timestamp}
                        primaryTypographyProps={{ 
                          color: '#fff',
                          fontSize: '0.9rem',
                        }}
                        secondaryTypographyProps={{ 
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontSize: '0.8rem',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* System Tab */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert 
              severity="info" 
              variant="outlined"
              sx={{
                bgcolor: 'rgba(30, 136, 229, 0.1)',
                borderColor: 'rgba(30, 136, 229, 0.3)',
                color: '#90caf9',
                mb: 3,
              }}
            >
              The System tab provides tools for managing server configuration, backups, and maintenance.
            </Alert>
          </Grid>
          
          <Grid item xs={12} md={6}>
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
                    System Configuration
                  </Typography>
                } 
                sx={{ 
                  borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                  pb: 1,
                }}
              />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <DnsIcon sx={{ color: '#42a5f5' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="API Logging" 
                      secondary="Log all API requests and responses" 
                      primaryTypographyProps={{ color: '#fff' }}
                      secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                    />
                    <Switch 
                      checked={apiLogs} 
                      onChange={() => setApiLogs(!apiLogs)} 
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#42a5f5',
                          '&:hover': {
                            backgroundColor: alpha('#42a5f5', 0.1),
                          },
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#42a5f5',
                        },
                      }}
                    />
                  </ListItem>
                  <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <ListItem>
                    <ListItemIcon>
                      <PeopleIcon sx={{ color: '#42a5f5' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="User Activity Tracking" 
                      secondary="Track detailed user behavior and actions" 
                      primaryTypographyProps={{ color: '#fff' }}
                      secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                    />
                    <Switch 
                      checked={userTracking} 
                      onChange={() => setUserTracking(!userTracking)} 
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#42a5f5',
                          '&:hover': {
                            backgroundColor: alpha('#42a5f5', 0.1),
                          },
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#42a5f5',
                        },
                      }}
                    />
                  </ListItem>
                  <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <ListItem>
                    <ListItemIcon>
                      <SettingsIcon sx={{ color: '#42a5f5' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="UI Settings" 
                      secondary="Configure user interface preferences" 
                      primaryTypographyProps={{ color: '#fff' }}
                      secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                    />
                    <Switch 
                      checked={darkMode} 
                      onChange={() => setDarkMode(!darkMode)} 
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#42a5f5',
                          '&:hover': {
                            backgroundColor: alpha('#42a5f5', 0.1),
                          },
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#42a5f5',
                        },
                      }}
                    />
                  </ListItem>
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{
                      bgcolor: '#1e88e5',
                      '&:hover': {
                        bgcolor: '#1976d2',
                      },
                    }}
                  >
                    Save Configuration
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
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
                    Backup & Restore
                  </Typography>
                } 
                sx={{ 
                  borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                  pb: 1,
                }}
              />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CloudUploadIcon sx={{ color: '#42a5f5' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Create System Backup" 
                      secondary="Last backup: 2023-04-30 14:22:45" 
                      primaryTypographyProps={{ color: '#fff' }}
                      secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ 
                        color: '#42a5f5', 
                        borderColor: 'rgba(66, 165, 245, 0.5)',
                        '&:hover': {
                          borderColor: '#42a5f5',
                          bgcolor: 'rgba(66, 165, 245, 0.1)',
                        }
                      }}
                    >
                      Backup
                    </Button>
                  </ListItem>
                  <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <ListItem>
                    <ListItemIcon>
                      <CloudDownloadIcon sx={{ color: '#42a5f5' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Restore from Backup" 
                      secondary="Select a backup file to restore" 
                      primaryTypographyProps={{ color: '#fff' }}
                      secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ 
                        color: '#ff9800', 
                        borderColor: 'rgba(255, 152, 0, 0.5)',
                        '&:hover': {
                          borderColor: '#ff9800',
                          bgcolor: 'rgba(255, 152, 0, 0.1)',
                        }
                      }}
                    >
                      Restore
                    </Button>
                  </ListItem>
                  <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <ListItem>
                    <ListItemIcon>
                      <DeleteIcon sx={{ color: '#f44336' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Clean Old Backups" 
                      secondary="Remove backups older than 30 days" 
                      primaryTypographyProps={{ color: '#fff' }}
                      secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ 
                        color: '#f44336', 
                        borderColor: 'rgba(244, 67, 54, 0.5)',
                        '&:hover': {
                          borderColor: '#f44336',
                          bgcolor: 'rgba(244, 67, 54, 0.1)',
                        }
                      }}
                    >
                      Clean
                    </Button>
                  </ListItem>
                </List>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                    Available Backup Schedule
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Switch 
                        checked={true} 
                        size="small"
                        sx={{
                          mr: 1,
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#42a5f5',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#42a5f5',
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ color: '#fff' }}>
                        Daily backup at 3:00 AM
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Switch 
                        checked={true} 
                        size="small"
                        sx={{
                          mr: 1,
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#42a5f5',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#42a5f5',
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ color: '#fff' }}>
                        Weekly backup on Sunday at 2:00 AM
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Switch 
                        checked={false} 
                        size="small"
                        sx={{
                          mr: 1,
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#42a5f5',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#42a5f5',
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ color: '#fff' }}>
                        Monthly backup on 1st day at 1:00 AM
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Only render other tabs as placeholders with alerts */}
      {tabValue > 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert 
              severity="info" 
              variant="filled"
              sx={{
                bgcolor: 'rgba(30, 136, 229, 0.6)',
                color: '#fff',
                mb: 3,
              }}
            >
              This tab is currently under development. More features coming soon!
            </Alert>
            
            <Card sx={{ 
              bgcolor: 'rgba(25, 35, 60, 0.6)',
              borderRadius: 2,
              border: '1px solid rgba(100, 180, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Box sx={{ 
                p: 3, 
                bgcolor: alpha('#1e88e5', 0.1), 
                borderRadius: '50%',
                mb: 3,
              }}>
                {tabValue === 2 ? (
                  <SecurityIcon sx={{ color: '#42a5f5', fontSize: 48 }} />
                ) : tabValue === 3 ? (
                  <ViewListIcon sx={{ color: '#42a5f5', fontSize: 48 }} />
                ) : (
                  <ManageAccountsIcon sx={{ color: '#42a5f5', fontSize: 48 }} />
                )}
              </Box>
              <Typography variant="h5" sx={{ color: '#fff', mb: 2, textAlign: 'center' }}>
                {tabValue === 2 ? "Security Management" : 
                 tabValue === 3 ? "System Logs" : 
                 "User Permissions"}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', mb: 3 }}>
                This section is under active development. Check back soon for advanced controls.
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
                {tabValue === 2 ? "Configure Security" : 
                 tabValue === 3 ? "View Available Logs" : 
                 "Manage Permissions"}
              </Button>
            </Card>
          </Grid>
        </Grid>
      )}
    </motion.div>
  );
};

export default Admin;