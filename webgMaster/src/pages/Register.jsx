import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Paper,
  CircularProgress,
  Alert,
  alpha,
  Divider,
  Link
} from '@mui/material';
import {
  Email,
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  Phone,
  VerifiedUser,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ParticlesBackground from '../components/login/ParticlesBackground';
import LogoAnimation from '../components/login/LogoAnimation';

const Register = () => {
  const navigate = useNavigate();
  const { sendRegistrationOTP, verifyRegistrationOTP, registerMaster } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [emailSent, setEmailSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpResendTimer, setOtpResendTimer] = useState(0);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear any previous errors when user types
    if (error) setError('');
  };

  // Handle password visibility toggle
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Handle confirm password visibility toggle
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle sending OTP to email
  const handleSendOTP = async () => {
    // Validate email
    if (!formData.email) {
      setError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await sendRegistrationOTP(formData.email);
      
      if (result.success) {
        setEmailSent(true);
        setSuccess('OTP sent successfully to your email');
        
        // Start OTP resend timer (2 minutes)
        setOtpResendTimer(120);
        const timer = setInterval(() => {
          setOtpResendTimer(prevTime => {
            if (prevTime <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      } else {
        setError(result.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('An error occurred while sending OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    // Validate OTP
    if (!formData.otp) {
      setError('OTP is required');
      return;
    }

    if (formData.otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await verifyRegistrationOTP(formData.email, formData.otp);
      
      if (result.success) {
        setOtpVerified(true);
        setSuccess('OTP verified successfully');
        setActiveStep(1);
      } else {
        setError(result.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('An error occurred while verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle registration form submission
  const handleRegister = async () => {
    // Validate form data
    if (!formData.firstName) {
      setError('First name is required');
      return;
    }

    if (!formData.lastName) {
      setError('Last name is required');
      return;
    }

    if (!formData.phone) {
      setError('Phone number is required');
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await registerMaster({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        password: formData.password
      });
      
      if (result.success) {
        setSuccess('Registration successful! You can now login.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  // Handle next step
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Format time for OTP resend timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Steps for the registration process
  const steps = ['Verify Email', 'Create Account'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        background: 'linear-gradient(135deg, #0a1929 0%, #1a3a5f 100%)',
        overflow: 'auto'
      }}
    >
      <ParticlesBackground />
      
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          p: 3,
          zIndex: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 500, width: '100%' }}>
          <LogoAnimation />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ width: '100%' }}
          >
            <Paper
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
                  mb: 3, 
                  fontWeight: 700,
                  background: 'linear-gradient(to right, #fff, #90caf9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Master Registration
              </Typography>
              
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel StepIconProps={{ 
                      sx: { 
                        color: '#1e88e5',
                        '&.Mui-completed': { color: '#4caf50' },
                        '&.Mui-active': { color: '#1e88e5' }
                      } 
                    }}>
                      <Typography sx={{ color: 'white' }}>{label}</Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    backgroundColor: alpha('#f44336', 0.1),
                    border: `1px solid ${alpha('#f44336', 0.2)}`,
                    color: '#f44336'
                  }}
                >
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert 
                  severity="success" 
                  sx={{ 
                    mb: 3, 
                    backgroundColor: alpha('#4caf50', 0.1),
                    border: `1px solid ${alpha('#4caf50', 0.2)}`,
                    color: '#4caf50'
                  }}
                >
                  {success}
                </Alert>
              )}
              
              {activeStep === 0 && (
                <Box>
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
                    disabled={emailSent}
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
                  
                  {!emailSent ? (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleSendOTP}
                      disabled={loading}
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
                        '&:hover': {
                          boxShadow: `0 6px 20px ${alpha('#1e88e5', 0.6)}`,
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: '#fff' }} />
                      ) : (
                        'Send OTP'
                      )}
                    </Button>
                  ) : (
                    <>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="otp"
                        label="Enter OTP"
                        name="otp"
                        value={formData.otp}
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
                              <VerifiedUser sx={{ color: alpha('#42a5f5', 0.7) }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                          {otpResendTimer > 0 ? (
                            `Resend OTP in ${formatTime(otpResendTimer)}`
                          ) : (
                            <Link 
                              component="button" 
                              variant="body2" 
                              onClick={handleSendOTP}
                              sx={{ 
                                color: alpha('#42a5f5', 0.9),
                                '&:hover': {
                                  color: '#42a5f5',
                                }
                              }}
                            >
                              Resend OTP
                            </Link>
                          )}
                        </Typography>
                        
                        <Link 
                          component="button" 
                          variant="body2" 
                          onClick={() => {
                            setEmailSent(false);
                            setOtpVerified(false);
                            setFormData({
                              ...formData,
                              otp: ''
                            });
                          }}
                          sx={{ 
                            color: alpha('#42a5f5', 0.9),
                            '&:hover': {
                              color: '#42a5f5',
                            }
                          }}
                        >
                          Change Email
                        </Link>
                      </Box>
                      
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleVerifyOTP}
                        disabled={loading}
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
                          '&:hover': {
                            boxShadow: `0 6px 20px ${alpha('#1e88e5', 0.6)}`,
                            transform: 'translateY(-2px)',
                          }
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={24} sx={{ color: '#fff' }} />
                        ) : (
                          'Verify OTP'
                        )}
                      </Button>
                    </>
                  )}
                </Box>
              )}
              
              {activeStep === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
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
                            <Person sx={{ color: alpha('#42a5f5', 0.7) }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
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
                    />
                  </Box>
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="phone"
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
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
                          <Phone sx={{ color: alpha('#42a5f5', 0.7) }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
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
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="confirmPassword"
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
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
                            aria-label="toggle confirm password visibility"
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                            sx={{ color: alpha('#fff', 0.7) }}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      startIcon={<ArrowBack />}
                      sx={{
                        py: 1.5,
                        px: 3,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderColor: alpha('#42a5f5', 0.5),
                        color: '#fff',
                        '&:hover': {
                          borderColor: '#42a5f5',
                          backgroundColor: alpha('#42a5f5', 0.1),
                        }
                      }}
                    >
                      Back
                    </Button>
                    
                    <Button
                      variant="contained"
                      onClick={handleRegister}
                      disabled={loading}
                      endIcon={<ArrowForward />}
                      sx={{
                        py: 1.5,
                        px: 3,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        background: 'linear-gradient(90deg, #1e88e5, #42a5f5)',
                        boxShadow: `0 4px 14px ${alpha('#1e88e5', 0.4)}`,
                        '&:hover': {
                          boxShadow: `0 6px 20px ${alpha('#1e88e5', 0.6)}`,
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: '#fff' }} />
                      ) : (
                        'Register'
                      )}
                    </Button>
                  </Box>
                </Box>
              )}
              
              <Divider sx={{ 
                my: 3, 
                '&::before, &::after': { 
                  borderColor: alpha('#fff', 0.1) 
                },
                color: alpha('#fff', 0.5),
                fontSize: '0.875rem'
              }}>
                or
              </Divider>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    sx={{ 
                      color: alpha('#42a5f5', 0.9),
                      '&:hover': {
                        color: '#42a5f5',
                      }
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </motion.div>
          
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            sx={{ mt: 5, textAlign: 'center' }}
          >
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.6), mb: 1 }}>
              &copy; {new Date().getFullYear()} WebGuru Master. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
              <Link href="#" sx={{ color: alpha('#fff', 0.6), '&:hover': { color: '#42a5f5' } }}>
                Privacy Policy
              </Link>
              <Link href="#" sx={{ color: alpha('#fff', 0.6), '&:hover': { color: '#42a5f5' } }}>
                Terms of Service
              </Link>
              <Link href="#" sx={{ color: alpha('#fff', 0.6), '&:hover': { color: '#42a5f5' } }}>
                Contact
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default Register;