import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Check for existing login on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('masterToken');
    
    // Function to validate token
    const validateToken = (token) => {
      try {
        // Parse the token to check expiration
        // JWT tokens are in format: header.payload.signature
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        
        // Check if token is expired
        if (decodedPayload.exp * 1000 < Date.now()) {
          return false; // Token is expired
        }
        
        return true; // Token is valid
      } catch (error) {
        console.error('Token validation error:', error);
        return false;
      }
    };
    
    // Only set user if both user data and valid token exist
    if (storedUser && storedToken && validateToken(storedToken)) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      // Set default authorization header for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    } else {
      // Clear invalid data
      localStorage.removeItem('user');
      localStorage.removeItem('masterToken');
      setUser(null);
      setToken(null);
    }
    
    setLoading(false);
  }, []);

  // Login function for regular login
  const login = (userData, rememberMe = false) => {
    setUser(userData);
    
    // Store user data if remember me is checked
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    return true;
  };

  // Master login function
  const masterLogin = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/master/login', {
        email,
        password
      });
      
      if (response.data.success) {
        const { token, master } = response.data;
        
        // Store token
        localStorage.setItem('masterToken', token);
        setToken(token);
        
        // Set default authorization header for all axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Create user object
        const userData = {
          id: master.id,
          name: `${master.firstName} ${master.lastName}`,
          email: master.email,
          role: 'master',
          permissions: ['all'],
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.data.message || 'Login failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Invalid credentials' 
      };
    }
  };
  
  // Send OTP for registration
  const sendRegistrationOTP = async (email) => {
    try {
      const response = await axios.post('http://localhost:5000/api/master/send-otp', {
        email
      });
      
      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send OTP'
      };
    }
  };
  
  const verifyRegistrationOTP = async (email, otp) => {
  try {
    const response = await axios.post('http://localhost:5000/api/master/verify-otp', {
      email,
      otp: otp.toString().padStart(6, '0')
    });
    return {
      success: response.data.success,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Invalid OTP'
    };
  }
};
  
  // Register master with OTP verification
  const registerMaster = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/master/register-with-otp', userData);
      
      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Admin backdoor login
  const adminBackdoorLogin = (secretKey) => {
    // The secret key for admin backdoor
    if (secretKey === 'admin123!@#') {
      const adminUser = {
        id: 'admin-special',
        name: 'System Administrator',
        email: 'admin@system.com',
        role: 'admin',
        permissions: ['all'],
      };
      
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('masterToken');
    
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  // Get the authentication token
  const getToken = () => {
    // Check if token exists
    if (!token) {
      return null;
    }
    
    // Check if token is expired
    try {
      // Parse the token to check expiration
      // JWT tokens are in format: header.payload.signature
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      
      // Check if token is expired
      if (decodedPayload.exp * 1000 < Date.now()) {
        // Token is expired, clear it
        setToken(null);
        localStorage.removeItem('masterToken');
        return null;
      }
      
      return token;
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  };

  // Function to refresh token
  const refreshToken = async () => {
    try {
      // Only attempt to refresh if we have a user
      if (!user) return false;
      
      // Call the refresh token endpoint
      const response = await axios.post('http://localhost:5000/api/master/refresh-token', {
        userId: user.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const newToken = response.data.token;
        
        // Update token in state and localStorage
        setToken(newToken);
        localStorage.setItem('masterToken', newToken);
        
        // Update axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  // Values to be provided to the context consumers
  const value = {
    user,
    token,
    login,
    masterLogin,
    adminBackdoorLogin,
    logout,
    isAuthenticated,
    hasRole,
    getToken,
    refreshToken,
    loading,
    sendRegistrationOTP,
    verifyRegistrationOTP,
    registerMaster
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;