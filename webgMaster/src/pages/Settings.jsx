import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader, 
  Switch, 
  Button, 
  Divider,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  alpha,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment
} from '@mui/material';
import { 
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Person as PersonIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  VpnKey as VpnKeyIcon,
  ColorLens as ColorLensIcon,
  FormatSize as FormatSizeIcon,
  Image as ImageIcon,
  Lock as LockIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#1e88e5');
  const [accentColor, setAccentColor] = useState('#42a5f5');
  
  // Appearance settings
  const [fontSize, setFontSize] = useState(1);
  const [backgroundStyle, setBackgroundStyle] = useState('gradient');
  const [backgroundAnimation, setBackgroundAnimation] = useState(true);
  const [effectsIntensity, setEffectsIntensity] = useState(1);
  
  // Password change dialog states
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSaveSettings = () => {
    setSnackbarMessage('Settings saved successfully!');
    setSnackbarOpen(true);
  };
  
  const resetThemeSettings = () => {
    setDarkMode(true);
    setPrimaryColor('#1e88e5');
    setAccentColor('#42a5f5');
    setFontSize(1);
    setSnackbarMessage('Theme settings reset to default!');
    setSnackbarOpen(true);
  };
  
  const resetBackgroundSettings = () => {
    setBackgroundStyle('gradient');
    setBackgroundAnimation(true);
    setEffectsIntensity(1);
    setSnackbarMessage('Background settings reset to default!');
    setSnackbarOpen(true);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  const handleOpenPasswordDialog = () => {
    setPasswordDialogOpen(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };
  
  const handleClosePasswordDialog = () => {
    setPasswordDialogOpen(false);
  };
  
  const handleChangePassword = () => {
    // Validate inputs
    if (!currentPassword) {
      setPasswordError('Current password is required');
      return;
    }
    
    if (!newPassword) {
      setPasswordError('New password is required');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    // Here you would typically call an API to change the password
    // For now, we'll just simulate a successful password change
    
    // Close the dialog
    setPasswordDialogOpen(false);
    
    // Show success message
    setSnackbarMessage('Password changed successfully!');
    setSnackbarOpen(true);
  };
  
  const renderAppearanceSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
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
                Theme Settings
              </Typography>
            } 
            action={
              <Tooltip title="Reset to Default">
                <IconButton 
                  onClick={resetThemeSettings}
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
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
            <List>
              <ListItem>
                <ListItemIcon>
                  {darkMode ? <DarkModeIcon sx={{ color: '#42a5f5' }} /> : <LightModeIcon sx={{ color: '#ffb74d' }} />}
                </ListItemIcon>
                <ListItemText 
                  primary="Dark Mode" 
                  secondary="Switch between dark and light theme"
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
              
              <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              <ListItem>
                <ListItemIcon>
                  <ColorLensIcon sx={{ color: primaryColor }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Primary Color" 
                  secondary="Main theme color"
                  primaryTypographyProps={{ color: '#fff' }}
                  secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                />
                <Box 
                  component="input"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  sx={{ 
                    border: 'none', 
                    backgroundColor: 'transparent',
                    width: 36,
                    height: 36,
                    cursor: 'pointer',
                  }}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <ColorLensIcon sx={{ color: accentColor }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Accent Color" 
                  secondary="Secondary color for elements"
                  primaryTypographyProps={{ color: '#fff' }}
                  secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                />
                <Box 
                  component="input"
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  sx={{ 
                    border: 'none', 
                    backgroundColor: 'transparent',
                    width: 36,
                    height: 36,
                    cursor: 'pointer',
                  }}
                />
              </ListItem>
              
              <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              <ListItem>
                <ListItemIcon>
                  <FormatSizeIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Font Size" 
                  secondary="Adjust the UI font size"
                  primaryTypographyProps={{ color: '#fff' }}
                  secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                />
                <Box sx={{ width: 140 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        A-
                      </Typography>
                    </Grid>
                    <Grid item xs>
                      <input
                        type="range"
                        min={0.5}
                        max={1.5}
                        step={0.1}
                        value={fontSize}
                        onChange={(e) => setFontSize(parseFloat(e.target.value))}
                        style={{ width: '100%' }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        A+
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </ListItem>
            </List>
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
          height: '100%',
        }}>
          <CardHeader 
            title={
              <Typography variant="h6" sx={{ color: '#fff' }}>
                Background Settings
              </Typography>
            } 
            action={
              <Tooltip title="Reset to Default">
                <IconButton 
                  onClick={resetBackgroundSettings}
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
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
            <List>
              <ListItem>
                <ListItemIcon>
                  <ImageIcon sx={{ color: '#42a5f5' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Background Style" 
                  secondary="Choose between solid color or gradient"
                  primaryTypographyProps={{ color: '#fff' }}
                  secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                />
                <Box sx={{ minWidth: 120 }}>
                  <TextField
                    select
                    value={backgroundStyle}
                    onChange={(e) => setBackgroundStyle(e.target.value)}
                    size="small"
                    sx={{
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
                        },
                        '& .MuiSvgIcon-root': {
                          color: 'rgba(255, 255, 255, 0.7)',
                        }
                      },
                    }}
                  >
                    <MenuItem value="solid">Solid Color</MenuItem>
                    <MenuItem value="gradient">Gradient</MenuItem>
                    <MenuItem value="image">Custom Image</MenuItem>
                  </TextField>
                </Box>
              </ListItem>
              
              <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              <ListItem>
                <ListItemIcon>
                  <PaletteIcon sx={{ color: '#42a5f5' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Background Animation" 
                  secondary="Enable animated background effects"
                  primaryTypographyProps={{ color: '#fff' }}
                  secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                />
                <Switch 
                  checked={backgroundAnimation} 
                  onChange={() => setBackgroundAnimation(!backgroundAnimation)}
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
                  <VisibilityIcon sx={{ color: '#42a5f5' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Effects Intensity" 
                  secondary="Adjust the visual effects intensity"
                  primaryTypographyProps={{ color: '#fff' }}
                  secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                />
                <Box sx={{ width: 140 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        Low
                      </Typography>
                    </Grid>
                    <Grid item xs>
                      <input
                        type="range"
                        min={0}
                        max={2}
                        step={0.1}
                        value={effectsIntensity}
                        onChange={(e) => setEffectsIntensity(parseFloat(e.target.value))}
                        style={{ width: '100%' }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        High
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
  

  
  const renderAccountSettings = () => (
    <Grid container spacing={3}>
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
                Account Information
              </Typography>
            } 
            action={
              <Tooltip title="Edit Account">
                <IconButton sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            }
            sx={{ 
              borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
              pb: 1,
            }}
          />
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box 
                sx={{ 
                  mr: 2, 
                  position: 'relative',
                }}
              >
                <Box
                  component="img"
                  src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0D8ABC&color=fff&size=80`}
                  alt={user?.name || 'User'}
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%',
                    border: '2px solid rgba(100, 180, 255, 0.2)',
                  }}
                />
                <Tooltip title="Change Profile Picture">
                  <IconButton
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      right: -4, 
                      bgcolor: '#1e88e5',
                      color: '#fff',
                      '&:hover': {
                        bgcolor: '#1976d2',
                      },
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                  {user?.name || 'User Name'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {user?.email || 'user@example.com'}
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: '#42a5f5', 
                  bgcolor: alpha('#1e88e5', 0.15),
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  display: 'inline-block',
                  mt: 0.5,
                }}>
                  {user?.role?.toUpperCase() || 'USER'}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
              Account Details
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  defaultValue={user?.name || 'User Name'}
                  disabled
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(0, 0, 0, 0.2)',
                      '& .MuiOutlinedInput-input': {
                        color: '#fff',
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  defaultValue={user?.email || 'user@example.com'}
                  disabled
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(0, 0, 0, 0.2)',
                      '& .MuiOutlinedInput-input': {
                        color: '#fff',
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Role"
                  defaultValue={user?.role || 'User'}
                  disabled
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(0, 0, 0, 0.2)',
                      '& .MuiOutlinedInput-input': {
                        color: '#fff',
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="outlined" 
                startIcon={<VpnKeyIcon />}
                onClick={handleOpenPasswordDialog}
                sx={{
                  color: '#42a5f5',
                  borderColor: 'rgba(66, 165, 245, 0.5)',
                  '&:hover': {
                    borderColor: '#42a5f5',
                    bgcolor: 'rgba(66, 165, 245, 0.1)',
                  }
                }}
              >
                Change Password
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
          height: '100%',
        }}>
          <CardHeader 
            title={
              <Typography variant="h6" sx={{ color: '#fff' }}>
                Security Settings
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
                  <SecurityIcon sx={{ color: twoFactorAuth ? '#42a5f5' : 'rgba(255, 255, 255, 0.5)' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Two-Factor Authentication" 
                  secondary="Add an extra layer of security to your account"
                  primaryTypographyProps={{ color: '#fff' }}
                  secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                />
                <Switch 
                  checked={twoFactorAuth} 
                  onChange={() => setTwoFactorAuth(!twoFactorAuth)} 
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
              
              {twoFactorAuth && (
                <Box sx={{ ml: 9, mt: -1, mb: 2 }}>
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
                    Configure
                  </Button>
                </Box>
              )}
              
              <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              <ListItem>
                <ListItemIcon>
                  <LockIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Session Management" 
                  secondary="Manage your active sessions and devices"
                  primaryTypographyProps={{ color: '#fff' }}
                  secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                />
                <Button 
                  variant="text" 
                  size="small"
                  sx={{
                    color: '#42a5f5',
                  }}
                >
                  View
                </Button>
              </ListItem>
              
              <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              <ListItem>
                <ListItemIcon>
                  <VpnKeyIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="API Keys" 
                  secondary="Manage your API keys and access tokens"
                  primaryTypographyProps={{ color: '#fff' }}
                  secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                />
                <Button 
                  variant="text" 
                  size="small"
                  sx={{
                    color: '#42a5f5',
                  }}
                >
                  Manage
                </Button>
              </ListItem>
              
              <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              <ListItem>
                <ListItemIcon>
                  <PersonIcon sx={{ color: '#ef5350' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Delete Account" 
                  secondary="Permanently remove your account and all associated data"
                  primaryTypographyProps={{ color: '#ef5350' }}
                  secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                />
                <Button 
                  variant="outlined" 
                  size="small"
                  sx={{
                    color: '#ef5350',
                    borderColor: 'rgba(239, 83, 80, 0.5)',
                    '&:hover': {
                      borderColor: '#ef5350',
                      bgcolor: 'rgba(239, 83, 80, 0.1)',
                    }
                  }}
                >
                  Delete
                </Button>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
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
            Settings
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Configure your application preferences and account settings.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
          sx={{
            bgcolor: '#1e88e5',
            '&:hover': {
              bgcolor: '#1976d2',
            },
            borderRadius: 2,
          }}
        >
          Save Settings
        </Button>
      </Box>
      
      {/* Tabs for different settings categories */}
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
          <Tab label="Appearance" icon={<PaletteIcon />} iconPosition="start" />
          <Tab label="Account" icon={<PersonIcon />} iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* Tab Content */}
      {tabValue === 0 && renderAppearanceSettings()}
      {tabValue === 1 && renderAccountSettings()}
      
      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      
      {/* Password Change Dialog */}
      <Dialog 
        open={passwordDialogOpen} 
        onClose={handleClosePasswordDialog}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(25, 35, 60, 0.95)',
            borderRadius: 2,
            border: '1px solid rgba(100, 180, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            color: '#fff',
            maxWidth: 500,
            width: '100%'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(100, 180, 255, 0.1)', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VpnKeyIcon sx={{ mr: 1, color: '#42a5f5' }} />
            <Typography variant="h6" component="div" sx={{ color: '#fff' }}>
              Change Password
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
            Please enter your current password and a new password to update your credentials.
          </DialogContentText>
          
          {passwordError && (
            <Alert 
              severity="error" 
              variant="outlined"
              sx={{ 
                mb: 3, 
                bgcolor: 'rgba(211, 47, 47, 0.1)', 
                borderColor: 'rgba(211, 47, 47, 0.3)',
                color: '#ef5350'
              }}
            >
              {passwordError}
            </Alert>
          )}
          
          <TextField
            margin="dense"
            label="Current Password"
            type={showCurrentPassword ? 'text' : 'password'}
            fullWidth
            variant="outlined"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    edge="end"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
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
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: '#42a5f5',
                }
              },
            }}
          />
          
          <TextField
            margin="dense"
            label="New Password"
            type={showNewPassword ? 'text' : 'password'}
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
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
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: '#42a5f5',
                }
              },
            }}
          />
          
          <TextField
            margin="dense"
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
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
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: '#42a5f5',
                }
              },
            }}
          />
          
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', mt: 1 }}>
            Password must be at least 8 characters long and include a mix of letters, numbers, and special characters.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleClosePasswordDialog}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.05)',
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleChangePassword}
            variant="contained"
            startIcon={<CheckIcon />}
            sx={{
              bgcolor: '#1e88e5',
              '&:hover': {
                bgcolor: '#1976d2',
              },
              borderRadius: 1,
            }}
          >
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default Settings;