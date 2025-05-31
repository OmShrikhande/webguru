const mongoose = require('mongoose');
const User = require('../models/User');
const Location = require('../models/location');
const bcrypt = require('bcrypt');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      mobile, 
      address, 
      joiningDate, 
      is_active, 
      department, 
      adhar, 
      pan, 
      password,
      location
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      mobile,
      address,
      joiningDate,
      is_active,
      department,
      adhar,
      pan,
      password: hashedPassword,
      location
    });

    await newUser.save();
    res.status(201).json({ 
      success: true, 
      message: 'User created successfully', 
      user: newUser 
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create user', 
      error: err.message 
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ 
      success: true, 
      count: users.length, 
      users 
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users', 
      error: err.message 
    });
  }
};

// Get a single user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    res.status(200).json({ 
      success: true, 
      user 
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user', 
      error: err.message 
    });
  }
};

// Get user location
exports.getUserLocation = async (req, res) => {
  try {
    // Validate userId format
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID' 
      });
    }

    console.log('Fetching location for user ID:', req.params.id);
    const location = await Location.findOne({ userId: req.params.id })
      .sort({ timestamp: -1 }); // Get the most recent location
    
    console.log('Location found in database:', location);
    
    if (!location) {
      console.log('No location found for user');
      return res.status(404).json({ 
        success: false, 
        message: 'No location data found for user' 
      });
    }
    
    const responseData = { 
      success: true, 
      location: {
        latitude: location.location ? location.location.latitude : location.latitude,
        longitude: location.location ? location.location.longitude : location.longitude,
        timestamp: location.timestamp,
      }
    };
    
    console.log('Sending location data to frontend:', responseData);
    res.status(200).json(responseData);
  } catch (err) {
    console.error('Error fetching user location:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user location', 
      error: err.message 
    });
  }
};
// Update a user
exports.updateUser = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      mobile, 
      address, 
      joiningDate, 
      is_active, 
      department, 
      adhar, 
      pan,
      password
    } = req.body;

    req.body.updated_at = Date.now();
    
    if (password) {
      req.body.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'User updated successfully', 
      user 
    });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update user', 
      error: err.message 
    });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: 'User deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete user', 
      error: err.message 
    });
  }
};

// Add user location
exports.addUserLocation = async (req, res) => {
  try {
    // Validate userId format
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID' 
      });
    }

    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const { latitude, longitude } = req.body;
    
    // Validate location data
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude must be numbers'
      });
    }

    // Create new location entry
    const newLocation = new Location({
      userId: req.params.id,
      location: {
        latitude,
        longitude
      },
      distance: 5 // Default distance value
    });

    await newLocation.save();

    res.status(201).json({
      success: true,
      message: 'Location added successfully',
      location: {
        latitude: newLocation.location.latitude,
        longitude: newLocation.location.longitude,
        timestamp: newLocation.timestamp
      }
    });
  } catch (err) {
    console.error('Error adding user location:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add user location', 
      error: err.message 
    });
  }
};