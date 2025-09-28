const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  generateMonthlyAttendanceReport,
  generateAllUsersMonthlyReport,
  generateAttendanceSummaryReport,
  updateVisitLocationDistance
} = require('../controllers/reportsController');

// Generate monthly attendance report for a specific user
router.get('/reports/monthly/:userId', protect, generateMonthlyAttendanceReport);

// Generate monthly reports for all users
router.get('/reports/monthly-all', protect, generateAllUsersMonthlyReport);

// Attendance summary for arbitrary date range
router.get('/reports/attendance-summary', protect, generateAttendanceSummaryReport);

// Update visit location with distance tracking
router.put('/reports/visit-distance/:visitId', protect, updateVisitLocationDistance);

module.exports = router;