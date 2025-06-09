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
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Tooltip,
  Badge,
  alpha
} from '@mui/material';
import { 
  LocationOn as LocationIcon,
  Public as PublicIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  MyLocation as MyLocationIcon,
  Explore as ExploreIcon,
  Map as MapIcon,
  Language as LanguageIcon,
  Place as PlaceIcon,
  Navigation as NavigationIcon,
  Business as BusinessIcon,
  HomeWork as HomeWorkIcon,
  DirectionsWalk as DirectionsWalkIcon,
  AccessTime as AccessTimeIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  History as HistoryIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
  ViewList as ViewListIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Generate dummy location data
const generateLocationData = () => {
  const users = [
    { id: 1, name: 'John Smith', email: 'john.smith@example.com', role: 'Employee' },
    { id: 2, name: 'Emma Johnson', email: 'emma.johnson@example.com', role: 'Manager' },
    { id: 3, name: 'Michael Williams', email: 'michael.williams@example.com', role: 'Employee' },
    { id: 4, name: 'Olivia Brown', email: 'olivia.brown@example.com', role: 'Admin' },
    { id: 5, name: 'William Jones', email: 'william.jones@example.com', role: 'Employee' },
    { id: 6, name: 'Sophia Miller', email: 'sophia.miller@example.com', role: 'Employee' },
    { id: 7, name: 'James Davis', email: 'james.davis@example.com', role: 'Manager' },
    { id: 8, name: 'Isabella Garcia', email: 'isabella.garcia@example.com', role: 'Employee' },
  ];
  
  const locations = [
    { lat: 40.7128, lng: -74.0060, address: "New York, NY", type: "Office" },
    { lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA", type: "Office" },
    { lat: 41.8781, lng: -87.6298, address: "Chicago, IL", type: "Office" },
    { lat: 29.7604, lng: -95.3698, address: "Houston, TX", type: "Remote" },
    { lat: 33.4484, lng: -112.0740, address: "Phoenix, AZ", type: "Remote" },
    { lat: 39.9526, lng: -75.1652, address: "Philadelphia, PA", type: "Field" },
    { lat: 32.7157, lng: -117.1611, address: "San Diego, CA", type: "Field" },
    { lat: 29.4241, lng: -98.4936, address: "San Antonio, TX", type: "Remote" },
  ];
  
  // Generate check-ins
  return users.map((user, index) => {
    const location = locations[index % locations.length];
    return {
      id: index + 1,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      latitude: location.lat,
      longitude: location.lng,
      address: location.address,
      locationType: location.type,
      checkInTime: new Date(Date.now() - Math.floor(Math.random() * 24) * 60 * 60 * 1000).toISOString(),
      status: Math.random() > 0.2 ? 'Active' : 'Inactive',
      lastSeen: `${Math.floor(Math.random() * 60)} minutes ago`,
      accuracy: `${Math.floor(Math.random() * 30) + 5}m`,
      deviceType: Math.random() > 0.7 ? 'Mobile' : 'Desktop',
    };
  });
};

// Map placeholder component
const MapPlaceholder = ({ height = 400 }) => (
  <Box
    sx={{
      height,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      bgcolor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: 2,
      border: '1px dashed rgba(100, 180, 255, 0.2)',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        backgroundImage: 'url("https://i.imgur.com/hX4WnYp.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(1px)',
      }}
    />
    <MapIcon sx={{ fontSize: 48, color: 'rgba(100, 180, 255, 0.6)', mb: 2, position: 'relative' }} />
    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', position: 'relative' }}>
      Interactive Map Visualization
    </Typography>
    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', position: 'relative', mt: 1 }}>
      (Map loading placeholder)
    </Typography>
  </Box>
);

const Locations = () => {
  const [locationData] = useState(generateLocationData());
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [locationType, setLocationType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // Handle filter menu
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  
  const handleLocationTypeFilter = (type) => {
    setLocationType(type);
    handleFilterClose();
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle row click to select a location
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };
  
  // Filter location data
  const filteredLocations = locationData.filter(location => {
    const matchesSearch = 
      location.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.locationType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = locationType === 'All' || location.locationType === locationType;
    
    return matchesSearch && matchesType;
  });
  
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
            Location Tracking
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Monitor user locations and activity in real-time.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
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
            {locationType} Locations
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
        </Box>
      </Box>
      
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
        <MenuItem onClick={() => handleLocationTypeFilter('All')} selected={locationType === 'All'}>
          <ListItemIcon>
            <PublicIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
          </ListItemIcon>
          <ListItemText primary="All Locations" primaryTypographyProps={{ color: '#fff' }} />
        </MenuItem>
        <MenuItem onClick={() => handleLocationTypeFilter('Office')} selected={locationType === 'Office'}>
          <ListItemIcon>
            <BusinessIcon sx={{ color: '#42a5f5' }} />
          </ListItemIcon>
          <ListItemText primary="Office Locations" primaryTypographyProps={{ color: '#fff' }} />
        </MenuItem>
        <MenuItem onClick={() => handleLocationTypeFilter('Remote')} selected={locationType === 'Remote'}>
          <ListItemIcon>
            <HomeWorkIcon sx={{ color: '#66bb6a' }} />
          </ListItemIcon>
          <ListItemText primary="Remote Locations" primaryTypographyProps={{ color: '#fff' }} />
        </MenuItem>
        <MenuItem onClick={() => handleLocationTypeFilter('Field')} selected={locationType === 'Field'}>
          <ListItemIcon>
            <DirectionsWalkIcon sx={{ color: '#ffb74d' }} />
          </ListItemIcon>
          <ListItemText primary="Field Locations" primaryTypographyProps={{ color: '#fff' }} />
        </MenuItem>
      </Menu>
      
      {/* Tabs for different location views */}
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
          <Tab label="Map View" icon={<MapIcon />} iconPosition="start" />
          <Tab label="List View" icon={<ViewListIcon />} iconPosition="start" />
          <Tab label="History" icon={<HistoryIcon />} iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* Map View Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
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
                    Live Location Map
                  </Typography>
                } 
                action={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      placeholder="Search locations..."
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
                        width: 200,
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
                    <Tooltip title="My Location">
                      <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        <MyLocationIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
                sx={{ 
                  borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                  pb: 1,
                }}
              />
              <CardContent sx={{ p: 2 }}>
                <MapPlaceholder height={400} />
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
                    {selectedLocation ? 'Location Details' : 'Recent Check-ins'}
                  </Typography>
                } 
                action={
                  selectedLocation ? (
                    <IconButton 
                      size="small" 
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                      onClick={() => setSelectedLocation(null)}
                    >
                      <Typography variant="caption" sx={{ mr: 0.5 }}>Back</Typography>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  ) : (
                    <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  )
                }
                sx={{ 
                  borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                  pb: 1,
                }}
              />
              <CardContent sx={{ p: 0, height: 400, overflow: 'auto' }}>
                {selectedLocation ? (
                  <Box sx={{ p: 2 }}>
                    <Box sx={{ 
                      mb: 2, 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: 'rgba(0, 0, 0, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}>
                      <Avatar 
                        sx={{ 
                          width: 60, 
                          height: 60,
                          bgcolor: 
                            selectedLocation.userRole === 'Admin' ? '#1e88e5' : 
                            selectedLocation.userRole === 'Manager' ? '#43a047' : '#ff9800',
                        }}
                      >
                        {selectedLocation.userName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ color: '#fff' }}>
                          {selectedLocation.userName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {selectedLocation.userEmail}
                        </Typography>
                        <Chip 
                          label={selectedLocation.userRole} 
                          size="small"
                          sx={{ 
                            mt: 0.5, 
                            bgcolor: 
                              selectedLocation.userRole === 'Admin' ? alpha('#1e88e5', 0.2) : 
                              selectedLocation.userRole === 'Manager' ? alpha('#43a047', 0.2) : 
                              alpha('#ff9800', 0.2),
                            color: 
                              selectedLocation.userRole === 'Admin' ? '#42a5f5' : 
                              selectedLocation.userRole === 'Manager' ? '#66bb6a' : 
                              '#ffb74d',
                          }}
                        />
                      </Box>
                    </Box>
                    
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                      Location Details
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PlaceIcon sx={{ color: '#ef5350', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                          {selectedLocation.address}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip 
                          icon={<BusinessIcon />}
                          label={selectedLocation.locationType} 
                          size="small"
                          sx={{ 
                            bgcolor: 
                              selectedLocation.locationType === 'Office' ? alpha('#1e88e5', 0.2) : 
                              selectedLocation.locationType === 'Remote' ? alpha('#43a047', 0.2) : 
                              alpha('#ff9800', 0.2),
                            color: 
                              selectedLocation.locationType === 'Office' ? '#42a5f5' : 
                              selectedLocation.locationType === 'Remote' ? '#66bb6a' : 
                              '#ffb74d',
                            '& .MuiChip-icon': {
                              color: 
                                selectedLocation.locationType === 'Office' ? '#42a5f5' : 
                                selectedLocation.locationType === 'Remote' ? '#66bb6a' : 
                                '#ffb74d',
                            }
                          }}
                        />
                        <Box sx={{ ml: 'auto' }}>
                          <Chip 
                            label={selectedLocation.status} 
                            size="small"
                            sx={{ 
                              bgcolor: selectedLocation.status === 'Active' ? alpha('#4caf50', 0.2) : alpha('#757575', 0.2),
                              color: selectedLocation.status === 'Active' ? '#66bb6a' : '#bdbdbd',
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                    
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(0, 0, 0, 0.15)', 
                      borderRadius: 2,
                      mb: 2, 
                    }}>
                      <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                        Coordinates
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            Latitude
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#fff' }}>
                            {selectedLocation.latitude.toFixed(6)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            Longitude
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#fff' }}>
                            {selectedLocation.longitude.toFixed(6)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            Accuracy
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#fff' }}>
                            {selectedLocation.accuracy}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTimeIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Check-in time:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#fff', ml: 1 }}>
                        {new Date(selectedLocation.checkInTime).toLocaleString()}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <VisibilityIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Last seen:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#fff', ml: 1 }}>
                        {selectedLocation.lastSeen}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DevicesIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Device:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#fff', ml: 1 }}>
                        {selectedLocation.deviceType}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<HistoryIcon />}
                        sx={{
                          color: '#42a5f5',
                          borderColor: 'rgba(66, 165, 245, 0.5)',
                          '&:hover': {
                            borderColor: '#42a5f5',
                            bgcolor: 'rgba(66, 165, 245, 0.1)',
                          }
                        }}
                      >
                        View History
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<NavigationIcon />}
                        sx={{
                          bgcolor: '#1e88e5',
                          '&:hover': {
                            bgcolor: '#1976d2',
                          },
                        }}
                      >
                        Navigate
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {filteredLocations.slice(0, 5).map((location, index) => (
                      <ListItem 
                        key={index}
                        onClick={() => handleLocationSelect(location)}
                        sx={{ 
                          borderBottom: '1px solid rgba(100, 180, 255, 0.05)',
                          py: 1.5,
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                          }
                        }}
                        button
                      >
                        <ListItemIcon>
                          <Badge
                            variant="dot"
                            color={location.status === 'Active' ? 'success' : 'error'}
                            sx={{ '& .MuiBadge-dot': { width: 8, height: 8 } }}
                          >
                            <Avatar 
                              sx={{ 
                                bgcolor: 
                                  location.locationType === 'Office' ? '#1e88e5' : 
                                  location.locationType === 'Remote' ? '#43a047' : '#ff9800',
                              }}
                            >
                              {location.userName.charAt(0)}
                            </Avatar>
                          </Badge>
                        </ListItemIcon>
                        <ListItemText 
                          primary={location.userName}
                          secondary={
                            <Box>
                              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block' }}>
                                {location.address}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                {location.lastSeen}
                              </Typography>
                            </Box>
                          }
                          primaryTypographyProps={{ color: '#fff', fontWeight: 500 }}
                        />
                        <Box>
                          <Chip 
                            label={location.locationType} 
                            size="small"
                            sx={{ 
                              height: 20,
                              fontSize: '0.7rem',
                              bgcolor: 
                                location.locationType === 'Office' ? alpha('#1e88e5', 0.2) : 
                                location.locationType === 'Remote' ? alpha('#43a047', 0.2) : 
                                alpha('#ff9800', 0.2),
                              color: 
                                location.locationType === 'Office' ? '#42a5f5' : 
                                location.locationType === 'Remote' ? '#66bb6a' : 
                                '#ffb74d',
                            }}
                          />
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                )}
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
                    Location Statistics
                  </Typography>
                } 
                sx={{ 
                  borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                  pb: 1,
                }}
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: 2, textAlign: 'center' }}>
                      <Box sx={{ 
                        display: 'inline-flex', 
                        p: 1.5, 
                        borderRadius: '50%', 
                        bgcolor: alpha('#1e88e5', 0.15),
                        mb: 1,
                      }}>
                        <BusinessIcon sx={{ color: '#42a5f5' }} />
                      </Box>
                      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600 }}>
                        {filteredLocations.filter(l => l.locationType === 'Office').length}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Office Locations
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: 2, textAlign: 'center' }}>
                      <Box sx={{ 
                        display: 'inline-flex', 
                        p: 1.5, 
                        borderRadius: '50%', 
                        bgcolor: alpha('#43a047', 0.15),
                        mb: 1,
                      }}>
                        <HomeWorkIcon sx={{ color: '#66bb6a' }} />
                      </Box>
                      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600 }}>
                        {filteredLocations.filter(l => l.locationType === 'Remote').length}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Remote Locations
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: 2, textAlign: 'center' }}>
                      <Box sx={{ 
                        display: 'inline-flex', 
                        p: 1.5, 
                        borderRadius: '50%', 
                        bgcolor: alpha('#ff9800', 0.15),
                        mb: 1,
                      }}>
                        <DirectionsWalkIcon sx={{ color: '#ffb74d' }} />
                      </Box>
                      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600 }}>
                        {filteredLocations.filter(l => l.locationType === 'Field').length}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Field Locations
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: 2, textAlign: 'center' }}>
                      <Box sx={{ 
                        display: 'inline-flex', 
                        p: 1.5, 
                        borderRadius: '50%', 
                        bgcolor: alpha('#4caf50', 0.15),
                        mb: 1,
                      }}>
                        <VisibilityIcon sx={{ color: '#66bb6a' }} />
                      </Box>
                      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600 }}>
                        {filteredLocations.filter(l => l.status === 'Active').length}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Active Users
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* List View Tab */}
      {tabValue === 1 && (
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
                All User Locations
              </Typography>
            } 
            action={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  placeholder="Search locations..."
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
                    width: 200,
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
                <IconButton 
                  size="small" 
                  sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1 }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  size="small"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                >
                  Export
                </Button>
              </Box>
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
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>User</TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Location</TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Type</TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Status</TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Check-in Time</TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Last Seen</TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLocations.map((location, index) => (
                    <TableRow 
                      key={index}
                      sx={{ 
                        '& td': { borderBottom: '1px solid rgba(100, 180, 255, 0.05)' },
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)' },
                        cursor: 'pointer',
                      }}
                      onClick={() => handleLocationSelect(location)}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Badge
                            variant="dot"
                            color={location.status === 'Active' ? 'success' : 'error'}
                            sx={{ '& .MuiBadge-dot': { width: 8, height: 8 } }}
                          >
                            <Avatar 
                              sx={{ 
                                width: 30, 
                                height: 30, 
                                mr: 1,
                                bgcolor: 
                                  location.userRole === 'Admin' ? '#1e88e5' : 
                                  location.userRole === 'Manager' ? '#43a047' : '#ff9800',
                              }}
                            >
                              {location.userName.charAt(0)}
                            </Avatar>
                          </Badge>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                              {location.userName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              {location.userEmail}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                          {location.address}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={location.locationType} 
                          size="small"
                          sx={{ 
                            bgcolor: 
                              location.locationType === 'Office' ? alpha('#1e88e5', 0.2) : 
                              location.locationType === 'Remote' ? alpha('#43a047', 0.2) : 
                              alpha('#ff9800', 0.2),
                            color: 
                              location.locationType === 'Office' ? '#42a5f5' : 
                              location.locationType === 'Remote' ? '#66bb6a' : 
                              '#ffb74d',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={location.status} 
                          size="small"
                          sx={{ 
                            bgcolor: location.status === 'Active' ? alpha('#4caf50', 0.2) : alpha('#757575', 0.2),
                            color: location.status === 'Active' ? '#66bb6a' : '#bdbdbd',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                          {new Date(location.checkInTime).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                          {location.lastSeen}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLocationSelect(location);
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
      
      {/* History Tab - Placeholder */}
      {tabValue === 2 && (
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
            <HistoryIcon sx={{ color: '#42a5f5', fontSize: 48 }} />
          </Box>
          <Typography variant="h5" sx={{ color: '#fff', mb: 1 }}>
            Location History
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3, textAlign: 'center', maxWidth: 500 }}>
            View user movement history and generate location reports. This feature is coming soon.
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
            Explore Available Data
          </Button>
        </Box>
      )}
      
      {/* Location Details Dialog */}
      {selectedLocation && tabValue !== 0 && (
        <Dialog 
          open={Boolean(selectedLocation)} 
          onClose={() => setSelectedLocation(null)}
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
          <DialogTitle sx={{ 
            borderBottom: '1px solid rgba(100, 180, 255, 0.1)', 
            px: 3, 
            py: 2,
            display: 'flex',
            alignItems: 'center',
          }}>
            <LocationIcon sx={{ color: '#ef5350', mr: 2 }} />
            <Typography variant="h6">Location Details</Typography>
          </DialogTitle>
          
          {/* Dialog content would go here - same as the selectedLocation view in tab 0 */}
          
          <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(100, 180, 255, 0.1)' }}>
            <Button 
              onClick={() => setSelectedLocation(null)} 
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Close
            </Button>
            <Button 
              variant="contained" 
              startIcon={<NavigationIcon />}
              sx={{
                bgcolor: '#1e88e5',
                '&:hover': {
                  bgcolor: '#1976d2',
                },
              }}
            >
              Navigate
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </motion.div>
  );
};

export default Locations;