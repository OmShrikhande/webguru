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
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
  alpha,
  Tooltip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BarChart as BarChartIcon,
  DonutLarge as DonutLargeIcon,
  Timeline as TimelineIcon,
  CalendarToday as CalendarTodayIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  DevicesOther as DevicesIcon,
  Public as PublicIcon,
  AccessTime as AccessTimeIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Dummy data for analytics
const generateAnalyticsData = () => {
  return {
    summary: {
      totalUsers: 1248,
      activeUsers: 856,
      userGrowth: 12.4,
      avgSessionTime: '3m 42s',
      totalSessions: 5672,
      bounceRate: 23.8,
      conversionRate: 8.6
    },
    devices: [
      { name: 'Desktop', value: 45, color: '#1e88e5' },
      { name: 'Mobile', value: 35, color: '#43a047' },
      { name: 'Tablet', value: 15, color: '#fb8c00' },
      { name: 'Other', value: 5, color: '#757575' }
    ],
    topPages: [
      { page: 'Dashboard', views: 3452, timeSpent: '2m 15s', bounceRate: 21.3 },
      { page: 'User Management', views: 2318, timeSpent: '4m 32s', bounceRate: 18.7 },
      { page: 'Analytics', views: 1984, timeSpent: '3m 08s', bounceRate: 25.2 },
      { page: 'Settings', views: 1245, timeSpent: '1m 45s', bounceRate: 35.1 },
      { page: 'Admin Panel', views: 986, timeSpent: '5m 24s', bounceRate: 15.8 }
    ],
    topUsers: [
      { name: 'John Smith', role: 'Admin', sessions: 48, timeSpent: '3h 24m', lastActive: '2 minutes ago' },
      { name: 'Emma Johnson', role: 'Manager', sessions: 35, timeSpent: '2h 12m', lastActive: '15 minutes ago' },
      { name: 'Michael Davis', role: 'User', sessions: 29, timeSpent: '1h 45m', lastActive: '32 minutes ago' },
      { name: 'Sophia Wilson', role: 'Admin', sessions: 27, timeSpent: '2h 02m', lastActive: '1 hour ago' },
      { name: 'William Brown', role: 'User', sessions: 24, timeSpent: '1h 18m', lastActive: '3 hours ago' }
    ],
    locations: [
      { country: 'United States', users: 548, percentage: 43.9 },
      { country: 'United Kingdom', users: 186, percentage: 14.9 },
      { country: 'Canada', users: 132, percentage: 10.6 },
      { country: 'Australia', users: 98, percentage: 7.9 },
      { country: 'Germany', users: 87, percentage: 7.0 },
      { country: 'Other', users: 197, percentage: 15.8 }
    ]
  };
};

// Chart Component Placeholders
const BarChartPlaceholder = ({ height = 250 }) => (
  <Box
    sx={{
      height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      bgcolor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: 2,
      border: '1px dashed rgba(100, 180, 255, 0.2)',
    }}
  >
    <BarChartIcon sx={{ fontSize: 40, color: 'rgba(100, 180, 255, 0.6)', mb: 1 }} />
    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
      Bar Chart Visualization
    </Typography>
  </Box>
);

const LineChartPlaceholder = ({ height = 250 }) => (
  <Box
    sx={{
      height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      bgcolor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: 2,
      border: '1px dashed rgba(100, 180, 255, 0.2)',
    }}
  >
    <TimelineIcon sx={{ fontSize: 40, color: 'rgba(100, 180, 255, 0.6)', mb: 1 }} />
    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
      Line Chart Visualization
    </Typography>
  </Box>
);

const DonutChartPlaceholder = ({ height = 250 }) => (
  <Box
    sx={{
      height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      bgcolor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: 2,
      border: '1px dashed rgba(100, 180, 255, 0.2)',
    }}
  >
    <DonutLargeIcon sx={{ fontSize: 40, color: 'rgba(100, 180, 255, 0.6)', mb: 1 }} />
    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
      Donut Chart Visualization
    </Typography>
  </Box>
);

const Analytics = () => {
  const [data] = useState(generateAnalyticsData());
  const [timeRange, setTimeRange] = useState('7d');
  const [tabValue, setTabValue] = useState(0);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    handleFilterClose();
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Determine label for time range
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '24h': return 'Last 24 Hours';
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 90 Days';
      default: return 'Custom Range';
    }
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
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            User activity insights and system performance metrics.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
              }
            }}
          >
            {getTimeRangeLabel()}
          </Button>
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
          <Tooltip title="Export Data">
            <IconButton 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                bgcolor: 'rgba(0, 0, 0, 0.2)',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.3)' },
              }}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Time Range Menu */}
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
        <MenuItem onClick={() => handleTimeRangeChange('24h')} selected={timeRange === '24h'}>
          <Typography variant="body2" sx={{ color: '#fff' }}>Last 24 Hours</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleTimeRangeChange('7d')} selected={timeRange === '7d'}>
          <Typography variant="body2" sx={{ color: '#fff' }}>Last 7 Days</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleTimeRangeChange('30d')} selected={timeRange === '30d'}>
          <Typography variant="body2" sx={{ color: '#fff' }}>Last 30 Days</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleTimeRangeChange('90d')} selected={timeRange === '90d'}>
          <Typography variant="body2" sx={{ color: '#fff' }}>Last 90 Days</Typography>
        </MenuItem>
        <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        <MenuItem onClick={handleFilterClose}>
          <Typography variant="body2" sx={{ color: '#fff' }}>Custom Range...</Typography>
        </MenuItem>
      </Menu>
      
      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: 'rgba(25, 35, 60, 0.6)',
            borderRadius: 2,
            border: '1px solid rgba(100, 180, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
            },
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                    Total Users
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#fff', fontWeight: 600 }}>
                    {data.summary.totalUsers.toLocaleString()}
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    bgcolor: alpha('#1e88e5', 0.15), 
                    p: 1, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PersonIcon sx={{ color: '#42a5f5', fontSize: 28 }} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Chip 
                  icon={<TrendingUpIcon fontSize="small" />} 
                  label={`+${data.summary.userGrowth}%`} 
                  size="small"
                  sx={{ 
                    bgcolor: alpha('#4caf50', 0.15), 
                    color: '#81c784', 
                    borderRadius: 1,
                    '& .MuiChip-icon': { color: '#81c784' }
                  }}
                />
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', ml: 1 }}>
                  vs. previous period
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
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
            },
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                    Active Users
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#fff', fontWeight: 600 }}>
                    {data.summary.activeUsers.toLocaleString()}
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    bgcolor: alpha('#4caf50', 0.15), 
                    p: 1, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <VisibilityIcon sx={{ color: '#81c784', fontSize: 28 }} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {Math.round((data.summary.activeUsers / data.summary.totalUsers) * 100)}% of total users
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
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
            },
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                    Avg. Session Time
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#fff', fontWeight: 600 }}>
                    {data.summary.avgSessionTime}
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    bgcolor: alpha('#ff9800', 0.15), 
                    p: 1, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AccessTimeIcon sx={{ color: '#ffb74d', fontSize: 28 }} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Chip 
                  icon={<TrendingUpIcon fontSize="small" />} 
                  label="+18.2%" 
                  size="small"
                  sx={{ 
                    bgcolor: alpha('#4caf50', 0.15), 
                    color: '#81c784', 
                    borderRadius: 1,
                    '& .MuiChip-icon': { color: '#81c784' }
                  }}
                />
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', ml: 1 }}>
                  vs. previous period
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
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
            },
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                    Bounce Rate
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#fff', fontWeight: 600 }}>
                    {data.summary.bounceRate}%
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    bgcolor: alpha('#f44336', 0.15), 
                    p: 1, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TrendingDownIcon sx={{ color: '#ef5350', fontSize: 28 }} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Chip 
                  icon={<TrendingDownIcon fontSize="small" />} 
                  label="-2.3%" 
                  size="small"
                  sx={{ 
                    bgcolor: alpha('#4caf50', 0.15), 
                    color: '#81c784', 
                    borderRadius: 1,
                    '& .MuiChip-icon': { color: '#81c784' }
                  }}
                />
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', ml: 1 }}>
                  vs. previous period
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Tabs for different analytics views */}
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
          <Tab label="Overview" />
          <Tab label="User Activity" />
          <Tab label="Content" />
          <Tab label="Devices" />
          <Tab label="Locations" />
        </Tabs>
      </Box>
      
      {/* Overview Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
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
                    User Activity Trends
                  </Typography>
                } 
                action={
                  <Box sx={{ display: 'flex' }}>
                    <Button
                      size="small"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1 }}
                    >
                      Daily
                    </Button>
                    <Button
                      size="small"
                      sx={{ color: '#42a5f5' }}
                    >
                      Weekly
                    </Button>
                    <Button
                      size="small"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)', ml: 1 }}
                    >
                      Monthly
                    </Button>
                    <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)', ml: 1 }}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                }
                sx={{ 
                  borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                  pb: 1,
                }}
              />
              <CardContent>
                <LineChartPlaceholder height={300} />
              </CardContent>
            </Card>
          </Grid>
          
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
                    Device Distribution
                  </Typography>
                } 
                action={
                  <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                }
                sx={{ 
                  borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                  pb: 1,
                }}
              />
              <CardContent>
                <DonutChartPlaceholder height={300} />
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={1}>
                    {data.devices.map((device) => (
                      <Grid item xs={6} key={device.name}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box 
                            sx={{ 
                              width: 12, 
                              height: 12, 
                              borderRadius: '50%', 
                              bgcolor: device.color,
                              mr: 1 
                            }} 
                          />
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {device.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#fff', ml: 'auto', fontWeight: 600 }}>
                            {device.value}%
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
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
                    Top Pages
                  </Typography>
                } 
                action={
                  <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                }
                sx={{ 
                  borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                  pb: 1,
                }}
              />
              <CardContent>
                <Box sx={{ width: '100%', overflow: 'auto' }}>
                  <Box sx={{ minWidth: 600 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      p: 1.5, 
                      borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                      bgcolor: 'rgba(0, 0, 0, 0.2)',
                    }}>
                      <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', width: '40%' }}>
                        Page
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', width: '20%', textAlign: 'center' }}>
                        Views
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', width: '20%', textAlign: 'center' }}>
                        Avg. Time
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', width: '20%', textAlign: 'center' }}>
                        Bounce Rate
                      </Typography>
                    </Box>
                    
                    {data.topPages.map((page, index) => (
                      <Box 
                        key={index}
                        sx={{ 
                          display: 'flex', 
                          p: 1.5, 
                          borderBottom: '1px solid rgba(100, 180, 255, 0.05)',
                          '&:hover': {
                            bgcolor: 'rgba(100, 180, 255, 0.05)',
                          }
                        }}
                      >
                        <Typography variant="body2" sx={{ color: '#fff', width: '40%', fontWeight: 500 }}>
                          {page.page}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#fff', width: '20%', textAlign: 'center' }}>
                          {page.views.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#fff', width: '20%', textAlign: 'center' }}>
                          {page.timeSpent}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#fff', width: '20%', textAlign: 'center' }}>
                          {page.bounceRate}%
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* User Activity Tab */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
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
                    User Sessions Over Time
                  </Typography>
                } 
                action={
                  <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                }
                sx={{ 
                  borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                  pb: 1,
                }}
              />
              <CardContent>
                <BarChartPlaceholder height={300} />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={5}>
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
                    Top Active Users
                  </Typography>
                } 
                action={
                  <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                }
                sx={{ 
                  borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                  pb: 1,
                }}
              />
              <CardContent sx={{ px: 1 }}>
                <List>
                  {data.topUsers.map((user, index) => (
                    <ListItem 
                      key={index}
                      sx={{ 
                        borderBottom: index !== data.topUsers.length - 1 ? '1px solid rgba(100, 180, 255, 0.05)' : 'none',
                        py: 1.5,
                      }}
                    >
                      <ListItemIcon>
                        <Avatar 
                          sx={{ 
                            bgcolor: user.role === 'Admin' ? '#1e88e5' : 
                                    user.role === 'Manager' ? '#43a047' : '#ff9800',
                            width: 40,
                            height: 40,
                          }}
                        >
                          {user.name.charAt(0)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                              {user.name}
                            </Typography>
                            <Chip 
                              label={user.role} 
                              size="small"
                              sx={{ 
                                ml: 1, 
                                bgcolor: user.role === 'Admin' ? alpha('#1e88e5', 0.15) : 
                                        user.role === 'Manager' ? alpha('#43a047', 0.15) : 
                                        alpha('#ff9800', 0.15),
                                color: user.role === 'Admin' ? '#42a5f5' : 
                                       user.role === 'Manager' ? '#66bb6a' : 
                                       '#ffb74d',
                                height: 20,
                                fontSize: '0.7rem',
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            {user.sessions} sessions • {user.timeSpent} total time
                          </Typography>
                        }
                      />
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        {user.lastActive}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Display placeholder for other tabs */}
      {tabValue > 1 && (
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
            {tabValue === 2 ? (
              <BarChartIcon sx={{ color: '#42a5f5', fontSize: 48 }} />
            ) : tabValue === 3 ? (
              <DevicesIcon sx={{ color: '#42a5f5', fontSize: 48 }} />
            ) : (
              <PublicIcon sx={{ color: '#42a5f5', fontSize: 48 }} />
            )}
          </Box>
          <Typography variant="h5" sx={{ color: '#fff', mb: 1 }}>
            {tabValue === 2 ? 'Content Analytics' : 
             tabValue === 3 ? 'Device Analytics' : 
             'Geographic Analytics'}
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3, textAlign: 'center', maxWidth: 500 }}>
            This analytics section is coming soon. We're working on bringing you detailed insights about 
            {tabValue === 2 ? ' your content performance.' : 
             tabValue === 3 ? ' user devices and browsers.' : 
             ' user locations and geographic trends.'}
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
            Explore Available Analytics
          </Button>
        </Box>
      )}
    </motion.div>
  );
};

export default Analytics;