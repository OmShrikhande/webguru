const express = require('express');
const router = express.Router();
const {
  registerMaster,
  loginMaster,
  getMasterProfile,
  updateMasterProfile,
  changeMasterPassword,
  createAdmin,
  getAllAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  getDashboardStats,
  getAllUsersWithAttendance,
  getAttendanceReport,
  getLocationReport
} = require('../controllers/masterController');
const {
  sendOTP,
  verifyOTP,
  registerMaster: registerMasterWithOTP
} = require('../controllers/masterAuthController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', registerMaster);
router.post('/login', loginMaster);

// OTP-based registration routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register-with-otp', registerMasterWithOTP);

// Protected routes (require authentication)
router.get('/profile', protect, authorize('master'), getMasterProfile);
router.put('/profile', protect, authorize('master'), updateMasterProfile);
router.put('/change-password', protect, authorize('master'), changeMasterPassword);

// Admin management routes
router.post('/admins', protect, authorize('master'), createAdmin);
router.get('/admins', protect, authorize('master'), getAllAdmins);
router.get('/admins/:id', protect, authorize('master'), getAdmin);
router.put('/admins/:id', protect, authorize('master'), updateAdmin);
router.delete('/admins/:id', protect, authorize('master'), deleteAdmin);

// Dashboard and reporting routes
router.get('/dashboard', protect, authorize('master'), getDashboardStats);
router.get('/users-attendance', protect, authorize('master'), getAllUsersWithAttendance);
router.get('/attendance-report', protect, authorize('master'), getAttendanceReport);
router.get('/location-report', protect, authorize('master'), getLocationReport);

module.exports = router;