const express = require('express');
const router = express.Router();
const { 
  createUser, 
  getAllUsers, 
  getUser, 
  updateUser, 
  deleteUser 
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Protected user routes
router.post('/users', protect, createUser);
router.get('/users', protect, getAllUsers);
router.get('/users/:id', protect, getUser);
router.put('/users/:id', protect, updateUser);
router.delete('/users/:id', protect, deleteUser);

module.exports = router;