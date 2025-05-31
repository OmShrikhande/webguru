const express = require('express');
const router = express.Router();
const { 
  createUser, 
  getAllUsers, 
  getUser, 
  getUserLocation,
  addUserLocation,
  addUserVisitLocation,
  getUserVisitLocations,
  updateUser, 
  deleteUser 
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Protected user routes
router.post('/users', protect, createUser);
router.get('/users', protect, getAllUsers);
router.get('/users/:id', protect, getUser);
router.get('/users/:id/locations', protect, getUserLocation);
router.post('/users/:id/locations', protect, addUserLocation);
router.post('/users/:id/visit-locations', protect, addUserVisitLocation);
router.get('/users/:id/visit-locations', protect, getUserVisitLocations);

// Test endpoint to get all locations for a user (for debugging)
router.get('/users/:id/all-locations', protect, async (req, res) => {
  try {
    const Location = require('../models/location');
    const locations = await Location.find({ userId: req.params.id }).sort({ timestamp: -1 });
    res.status(200).json({ success: true, locations });
  } catch (err) {
    console.error('Error fetching all locations:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch locations', error: err.message });
  }
});
router.put('/users/:id', protect, updateUser);
router.delete('/users/:id', protect, deleteUser);

module.exports = router;