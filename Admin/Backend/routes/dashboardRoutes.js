const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');

// Dashboard Statistics
router.get('/stats', protect, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ is_active: true });
    const inactiveUsers = await User.countDocuments({ is_active: false });
    const totalAdmins = await Admin.countDocuments();

    // Recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Department wise count
    const departmentStats = await User.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        totalAdmins,
        recentUsers,
        departmentStats
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

// Recent Activities
router.get('/recent-activities', protect, async (req, res) => {
  try {
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email department createdAt is_active');

    const activities = recentUsers.map(user => ({
      id: user._id,
      type: 'user_registration',
      message: `New user ${user.name} registered in ${user.department} department`,
      timestamp: user.createdAt,
      user: {
        name: user.name,
        email: user.email,
        department: user.department,
        is_active: user.is_active
      }
    }));

    res.json({
      success: true,
      activities
    });
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activities'
    });
  }
});

module.exports = router;