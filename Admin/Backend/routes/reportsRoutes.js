const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  generateMonthlyAttendanceReport,
  generateAllUsersMonthlyReport,
  updateVisitLocationDistance
} = require('../controllers/reportsController');

// Generate monthly attendance report for a specific user
router.get('/reports/monthly/:userId', protect, generateMonthlyAttendanceReport);

// Generate monthly reports for all users
router.get('/reports/monthly-all', protect, generateAllUsersMonthlyReport);

// Update visit location with distance tracking
router.put('/reports/visit-distance/:visitId', protect, updateVisitLocationDistance);

module.exports = router;