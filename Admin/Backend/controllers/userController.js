const User = require('../models/User');

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
      pan 
    } = req.body;

    // Create new user
    const newUser = new User({
      name,
      email,
      mobile,
      address,
      joiningDate,
      is_active,
      department,
      adhar,
      pan
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
    const user = await User.findById(req.params.id);
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
      pan 
    } = req.body;

    // Set updated_at to current time
    req.body.updated_at = Date.now();

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