const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAllHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  initializeDefaultHolidays
} = require('../controllers/holidayController');

// Get all holidays
router.get('/holidays', protect, getAllHolidays);

// Create a new holiday
router.post('/holidays', protect, createHoliday);

// Update a holiday
router.put('/holidays/:id', protect, updateHoliday);

// Delete a holiday
router.delete('/holidays/:id', protect, deleteHoliday);

// Initialize default holidays for a year
router.post('/holidays/initialize', protect, initializeDefaultHolidays);

module.exports = router;