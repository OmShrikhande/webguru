const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

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

      // Get admin from token
      req.admin = await Admin.findById(decoded.id);
      
      if (!req.admin) {
        return res.status(401).json({ 
          success: false, 
          message: 'Admin not found with this ID' 
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