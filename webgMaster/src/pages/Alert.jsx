import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  Snackbar,
  Alert as MuiAlert,
  CircularProgress
} from '@mui/material';
import { NotificationsActive as AlertIcon } from '@mui/icons-material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

const Alert = () => {
  const { user } = useAuth();
  const [routeNumber, setRouteNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [routes, setRoutes] = useState([
    { id: '1', name: 'Route 1' },
    { id: '2', name: 'Route 2' },
    { id: '3', name: 'Route 3' },
    { id: '4', name: 'Route 4' },
    { id: '5', name: 'Route 5' }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!routeNumber || !message) {
      setSnackbar({
        open: true,
        message: 'Please fill in all fields',
        severity: 'error'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Add a new document to the "alerts" collection
      await addDoc(collection(db, "alerts"), {
        routeNumber,
        message,
        adminName: user?.name || 'Unknown Admin',
        adminDesignation: user?.role || 'Admin',
        timestamp: serverTimestamp(),
        status: 'active'
      });
      
      // Reset form
      setRouteNumber('');
      setMessage('');
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Alert sent successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error("Error sending alert: ", error);
      setSnackbar({
        open: true,
        message: 'Error sending alert. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ 
        fontWeight: 700, 
        background: 'linear-gradient(90deg, #64b5f6, #4fc3f7, #29b6f6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        mb: 4
      }}>
        <AlertIcon sx={{ mr: 1, color: '#29b6f6' }} />
        Send Alert
      </Typography>
      
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          backgroundColor: 'rgba(25, 35, 60, 0.5)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(100, 180, 255, 0.1)',
        }}
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, color: '#e3f2fd' }}>
                Admin Information
              </Typography>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  backgroundColor: 'rgba(30, 40, 70, 0.4)', 
                  borderRadius: 2,
                  border: '1px solid rgba(100, 180, 255, 0.1)',
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#e3f2fd' }}>
                  {user?.name || 'Admin Name'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {user?.role || 'Admin'} 
                </Typography>
              </Paper>
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth variant="outlined" sx={{ 
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(100, 180, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(100, 180, 255, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#64b5f6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiSelect-icon': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}>
                <InputLabel id="route-select-label">Route Number</InputLabel>
                <Select
                  labelId="route-select-label"
                  value={routeNumber}
                  onChange={(e) => setRouteNumber(e.target.value)}
                  label="Route Number"
                  sx={{
                    color: '#e3f2fd',
                    backgroundColor: 'rgba(30, 40, 70, 0.4)',
                  }}
                >
                  {routes.map((route) => (
                    <MenuItem key={route.id} value={route.id}>
                      {route.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          
          <TextField
            label="Message"
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            variant="outlined"
            placeholder="Enter your alert message here..."
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(100, 180, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(100, 180, 255, 0.4)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#64b5f6',
                },
                color: '#e3f2fd',
                backgroundColor: 'rgba(30, 40, 70, 0.4)',
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            sx={{ 
              mt: 2, 
              py: 1.5,
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
              alignSelf: 'flex-end',
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: '150px' }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Send Alert'
            )}
          </Button>
        </Box>
      </Paper>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert 
          elevation={6} 
          variant="filled" 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default Alert;