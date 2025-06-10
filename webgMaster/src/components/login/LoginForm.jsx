import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Link,
  alpha,
  Divider,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  KeyboardDoubleArrowRight
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const { login, adminBackdoorLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdminField, setShowAdminField] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rememberMe' ? checked : value
    });
    
    // Clear any previous errors when user types
    if (error) setError('');
  };
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleAdminBackdoor = () => {
    setShowAdminField(!showAdminField);
  };
  
  const { masterLogin } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (showAdminField) {
        // Try admin backdoor login
        const success = adminBackdoorLogin(adminKey);
        if (!success) {
          throw new Error('Invalid admin key');
        }
      } else {
        // Regular login validation
        if (!formData.email) {
          throw new Error('Email is required');
        }
        
        if (!formData.password) {
          throw new Error('Password is required');
        }
        
        // Call the masterLogin function
        const result = await masterLogin(formData.email, formData.password);
        
        if (!result.success) {
          throw new Error(result.message || 'Login failed');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          backdropFilter: 'blur(10px)',
          backgroundColor: alpha('#0a1929', 0.8),
          border: '1px solid',
          borderColor: alpha('#1e88e5', 0.2),
          borderRadius: 3,
          boxShadow: `0 10px 40px ${alpha('#000', 0.2)}, 
                     0 0 0 1px ${alpha('#1e88e5', 0.1)}, 
                     inset 0 0 0 1px ${alpha('#fff', 0.05)}`,
          p: 4,
          maxWidth: 400,
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(to right, #1e88e5, #42a5f5)',
            borderRadius: '4px 4px 0 0',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `
              radial-gradient(circle at 100% 100%, ${alpha('#1e88e5', 0.1)} 0%, transparent 40%),
              radial-gradient(circle at 0% 0%, ${alpha('#1e88e5', 0.08)} 0%, transparent 30%)
            `,
            zIndex: -1,
          }
        }}
      >
        <Typography 
          component="h1" 
          variant="h4" 
          align="center" 
          sx={{ 
            mb: 4, 
            fontWeight: 700,
            background: 'linear-gradient(to right, #fff, #90caf9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Login
        </Typography>
        
        {error && (
          <Typography 
            color="error" 
            variant="body2" 
            sx={{ 
              mb: 2, 
              p: 1.5, 
              borderRadius: 1, 
              backgroundColor: alpha('#f44336', 0.1),
              border: `1px solid ${alpha('#f44336', 0.2)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {error}
          </Typography>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {showAdminField ? (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                name="adminKey"
                label="Admin Secret Key"
                type={showPassword ? 'text' : 'password'}
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha('#0a1929', 0.4),
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha('#42a5f5', 0.5),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1e88e5',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: alpha('#fff', 0.7),
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#42a5f5',
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{ color: alpha('#fff', 0.7) }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>
          ) : (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha('#0a1929', 0.4),
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha('#42a5f5', 0.5),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1e88e5',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: alpha('#fff', 0.7),
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#42a5f5',
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: alpha('#42a5f5', 0.7) }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha('#0a1929', 0.4),
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha('#42a5f5', 0.5),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1e88e5',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: alpha('#fff', 0.7),
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#42a5f5',
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: alpha('#42a5f5', 0.7) }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{ color: alpha('#fff', 0.7) }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      sx={{ 
                        color: alpha('#42a5f5', 0.7),
                        '&.Mui-checked': {
                          color: '#42a5f5',
                        }
                      }}
                    />
                  }
                  label="Remember me"
                  sx={{ color: alpha('#fff', 0.7) }}
                />
                <Link 
                  href="#" 
                  variant="body2"
                  sx={{ 
                    color: alpha('#42a5f5', 0.9),
                    '&:hover': {
                      color: '#42a5f5',
                    }
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
            </>
          )}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              background: 'linear-gradient(90deg, #1e88e5, #42a5f5)',
              boxShadow: `0 4px 14px ${alpha('#1e88e5', 0.4)}`,
              transition: 'all 0.2s ease-in-out',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: `linear-gradient(90deg, transparent, ${alpha('#fff', 0.2)}, transparent)`,
                transition: 'all 0.5s ease-in-out',
              },
              '&:hover': {
                boxShadow: `0 6px 20px ${alpha('#1e88e5', 0.6)}`,
                transform: 'translateY(-2px)',
                '&::after': {
                  left: '100%',
                }
              }
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: '#fff' }} />
            ) : (
              showAdminField ? 'Login as Admin' : 'Sign In'
            )}
          </Button>
          
          <Divider sx={{ 
            my: 2, 
            '&::before, &::after': { 
              borderColor: alpha('#fff', 0.1) 
            },
            color: alpha('#fff', 0.5),
            fontSize: '0.875rem'
          }}>
            or
          </Divider>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link
              href="/register"
              variant="body2"
              sx={{ 
                color: alpha('#fff', 0.7),
                '&:hover': {
                  color: '#fff',
                }
              }}
            >
              Register as Master
            </Link>
            
            <Tooltip title="Admin Access" placement="top">
              <IconButton 
                onClick={handleAdminBackdoor}
                sx={{ 
                  color: showAdminField ? '#f44336' : alpha('#fff', 0.5),
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: showAdminField ? '#f44336' : '#42a5f5',
                    transform: 'rotate(180deg)',
                  }
                }}
              >
                <KeyboardDoubleArrowRight />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default LoginForm;