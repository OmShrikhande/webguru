const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Master = require('../models/Master');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to access this route' 
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decoded", decoded);
      console.log("decoded id", decoded.id);

      // Check the role from the token
      const role = decoded.role || 'admin'; // Default to admin for backward compatibility
      
      if (role === 'master') {
        // Get master from token
        req.user = await Master.findById(decoded.id);
        if (!req.user) {
          return res.status(401).json({ 
            success: false, 
            message: 'Master not found with this ID' 
          });
        }
        req.userRole = 'master';
      } else if (role === 'admin') {
        // Get admin from token
        req.user = await Admin.findById(decoded.id);
        if (!req.user) {
          return res.status(401).json({ 
            success: false, 
            message: 'Admin not found with this ID' 
          });
        }
        req.userRole = 'admin';
        
        // For backward compatibility
        req.admin = req.user;
      } else if (role === 'user') {
        // Get user from token
        req.user = await User.findById(decoded.id);
        if (!req.user) {
          return res.status(401).json({ 
            success: false, 
            message: 'User not found with this ID' 
          });
        }
        req.userRole = 'user';
      } else {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid role in token' 
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to access this route' 
      });
    }
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Middleware to authorize based on roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.userRole} is not authorized to access this route`
      });
    }
    next();
  };
};