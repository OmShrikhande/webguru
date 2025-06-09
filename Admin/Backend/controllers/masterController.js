const Master = require('../models/Master');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Location = require('../models/location');
const VisitLocation = require('../models/visitLocation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new master
exports.registerMaster = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check if master already exists
    const existingMaster = await Master.findOne({ email });
    if (existingMaster) {
      return res.status(400).json({
        success: false,
        message: 'Master with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new master
    const newMaster = new Master({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      username: email.split('@')[0]
    });

    await newMaster.save();

    res.status(201).json({
      success: true,
      message: 'Master registered successfully',
      master: {
        id: newMaster._id,
        email: newMaster.email,
        firstName: newMaster.firstName,
        lastName: newMaster.lastName
      }
    });
  } catch (error) {
    console.error('Error registering master:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register master',
      error: error.message
    });
  }
};

// Login master
exports.loginMaster = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if master exists
    const master = await Master.findOne({ email });
    if (!master) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, master.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update login history
    master.loginHistory.push({
      loginTime: new Date(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    master.lastLogin = new Date();
    await master.save();

    // Create and sign JWT token
    const payload = {
      id: master._id,
      email: master.email,
      role: 'master'
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      master: {
        id: master._id,
        email: master.email,
        firstName: master.firstName,
        lastName: master.lastName
      }
    });
  } catch (error) {
    console.error('Error logging in master:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: error.message
    });
  }
};

// Get master profile
exports.getMasterProfile = async (req, res) => {
  try {
    const master = await Master.findById(req.user.id).select('-password');
    if (!master) {
      return res.status(404).json({
        success: false,
        message: 'Master not found'
      });
    }

    res.status(200).json({
      success: true,
      master
    });
  } catch (error) {
    console.error('Error fetching master profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch master profile',
      error: error.message
    });
  }
};

// Update master profile
exports.updateMasterProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address, city, state, zipCode, country, dateOfBirth, gender } = req.body;

    const master = await Master.findById(req.user.id);
    if (!master) {
      return res.status(404).json({
        success: false,
        message: 'Master not found'
      });
    }

    // Update fields
    if (firstName) master.firstName = firstName;
    if (lastName) master.lastName = lastName;
    if (phone) master.phone = phone;
    if (address) master.address = address;
    if (city) master.city = city;
    if (state) master.state = state;
    if (zipCode) master.zipCode = zipCode;
    if (country) master.country = country;
    if (dateOfBirth) master.dateOfBirth = dateOfBirth;
    if (gender) master.gender = gender;

    master.updatedAt = Date.now();
    await master.save();

    res.status(200).json({
      success: true,
      message: 'Master profile updated successfully',
      master: {
        id: master._id,
        email: master.email,
        firstName: master.firstName,
        lastName: master.lastName,
        phone: master.phone,
        address: master.address,
        city: master.city,
        state: master.state,
        zipCode: master.zipCode,
        country: master.country,
        dateOfBirth: master.dateOfBirth,
        gender: master.gender
      }
    });
  } catch (error) {
    console.error('Error updating master profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update master profile',
      error: error.message
    });
  }
};

// Change master password
exports.changeMasterPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const master = await Master.findById(req.user.id);
    if (!master) {
      return res.status(404).json({
        success: false,
        message: 'Master not found'
      });
    }

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, master.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    master.password = hashedPassword;
    master.updatedAt = Date.now();
    await master.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing master password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};

// Create a new admin
exports.createAdmin = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, department, position } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      department,
      position,
      username: email.split('@')[0]
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: newAdmin._id,
        email: newAdmin.email,
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        department: newAdmin.department,
        position: newAdmin.position
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin',
      error: error.message
    });
  }
};

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    
    res.status(200).json({
      success: true,
      count: admins.length,
      admins
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admins',
      error: error.message
    });
  }
};

// Get a single admin
exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      admin
    });
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin',
      error: error.message
    });
  }
};

// Update an admin
exports.updateAdmin = async (req, res) => {
  try {
    const { firstName, lastName, phone, department, position, isActive } = req.body;

    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Update fields
    if (firstName) admin.firstName = firstName;
    if (lastName) admin.lastName = lastName;
    if (phone) admin.phone = phone;
    if (department) admin.department = department;
    if (position) admin.position = position;
    if (isActive !== undefined) admin.isActive = isActive;

    admin.updatedAt = Date.now();
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
      admin: {
        id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        department: admin.department,
        position: admin.position,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update admin',
      error: error.message
    });
  }
};

// Delete an admin
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    await Admin.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete admin',
      error: error.message
    });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalAdmins = await Admin.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalAttendance = await Attendance.countDocuments();
    const totalLocations = await Location.countDocuments();
    const totalVisitLocations = await VisitLocation.countDocuments();

    // Get today's counts
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAttendance = await Attendance.countDocuments({
      date: { $gte: today, $lt: tomorrow }
    });

    const todayLocations = await Location.countDocuments({
      timestamp: { $gte: today, $lt: tomorrow }
    });

    const todayVisitLocations = await VisitLocation.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    // Get active users (users with location updates in the last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const activeUsers = await Location.distinct('userId', {
      timestamp: { $gte: yesterday }
    });

    // Get attendance statistics
    const presentToday = await Attendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: 'present'
    });

    const absentToday = await Attendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: 'absent'
    });

    const lateToday = await Attendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: 'late'
    });

    // Get recent activities (combine recent logins, attendance, and location updates)
    const recentAdminLogins = await Admin.aggregate([
      { $unwind: '$loginHistory' },
      { $sort: { 'loginHistory.loginTime': -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          loginTime: '$loginHistory.loginTime',
          type: { $literal: 'admin_login' }
        }
      }
    ]);

    const recentAttendance = await Attendance.find()
      .sort({ date: -1, createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email')
      .lean();

    const recentLocations = await Location.find()
      .sort({ timestamp: -1 })
      .limit(5)
      .populate('userId', 'name email')
      .lean();

    // Combine and sort activities
    const recentActivities = [
      ...recentAdminLogins.map(admin => ({
        id: `admin_login_${admin._id}_${admin.loginTime}`,
        user: `${admin.firstName} ${admin.lastName}`,
        email: admin.email,
        action: 'logged in',
        time: admin.loginTime,
        type: 'admin_login'
      })),
      ...recentAttendance.map(att => ({
        id: `attendance_${att._id}`,
        user: att.userId?.name || 'Unknown User',
        email: att.userId?.email || '',
        action: `marked as ${att.status}`,
        time: att.date,
        type: 'attendance'
      })),
      ...recentLocations.map(loc => ({
        id: `location_${loc._id}`,
        user: loc.userId?.name || 'Unknown User',
        email: loc.userId?.email || '',
        action: 'updated location',
        time: loc.timestamp,
        type: 'location',
        coordinates: {
          latitude: loc.location.latitude,
          longitude: loc.location.longitude
        }
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

    // Get weekly attendance statistics
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyAttendance = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: oneWeekAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          present: {
            $sum: {
              $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
            }
          },
          absent: {
            $sum: {
              $cond: [{ $eq: ['$status', 'absent'] }, 1, 0]
            }
          },
          late: {
            $sum: {
              $cond: [{ $eq: ['$status', 'late'] }, 1, 0]
            }
          },
          total: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1
        }
      }
    ]);

    // Format weekly attendance for chart
    const weeklyAttendanceChart = weeklyAttendance.map(day => {
      const date = new Date(day._id.year, day._id.month - 1, day._id.day);
      return {
        date: date.toISOString().split('T')[0],
        present: day.present,
        absent: day.absent,
        late: day.late,
        total: day.total
      };
    });

    res.status(200).json({
      success: true,
      stats: {
        totalCounts: {
          admins: totalAdmins,
          users: totalUsers,
          attendance: totalAttendance,
          locations: totalLocations,
          visitLocations: totalVisitLocations
        },
        todayCounts: {
          attendance: todayAttendance,
          locations: todayLocations,
          visitLocations: todayVisitLocations,
          activeUsers: activeUsers.length,
          presentUsers: presentToday,
          absentUsers: absentToday,
          lateUsers: lateToday
        },
        recentActivities,
        weeklyAttendance: weeklyAttendanceChart
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

// Get all users with their attendance
exports.getAllUsersWithAttendance = async (req, res) => {
  try {
    // Get all users
    const users = await User.find().select('-password');

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get attendance for each user
    const usersWithAttendance = await Promise.all(
      users.map(async (user) => {
        // Get today's attendance
        const todayAttendance = await Attendance.findOne({
          userId: user._id,
          date: { $gte: today, $lt: tomorrow }
        });

        // Get last 7 days attendance
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const weekAttendance = await Attendance.find({
          userId: user._id,
          date: { $gte: oneWeekAgo, $lt: tomorrow }
        }).sort({ date: 1 });

        // Get last location
        const lastLocation = await Location.findOne({
          userId: user._id
        }).sort({ timestamp: -1 });

        return {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            department: user.department,
            joiningDate: user.joiningDate,
            is_active: user.is_active
          },
          todayAttendance: todayAttendance ? {
            status: todayAttendance.status,
            checkInTime: todayAttendance.checkInTime,
            checkOutTime: todayAttendance.checkOutTime,
            workHours: todayAttendance.workHours
          } : null,
          weekAttendance: weekAttendance.map(att => ({
            date: att.date,
            status: att.status,
            checkInTime: att.checkInTime,
            checkOutTime: att.checkOutTime,
            workHours: att.workHours
          })),
          lastLocation: lastLocation ? {
            latitude: lastLocation.location.latitude,
            longitude: lastLocation.location.longitude,
            timestamp: lastLocation.timestamp
          } : null
        };
      })
    );

    res.status(200).json({
      success: true,
      count: users.length,
      usersWithAttendance
    });
  } catch (error) {
    console.error('Error fetching users with attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users with attendance',
      error: error.message
    });
  }
};

// Get attendance report
exports.getAttendanceReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Parse dates
    const start = startDate ? new Date(startDate) : new Date();
    start.setHours(0, 0, 0, 0);
    
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    // Get attendance records
    const attendanceRecords = await Attendance.find({
      date: { $gte: start, $lte: end }
    }).populate('userId', 'name email department');

    // Group by date
    const attendanceByDate = {};
    attendanceRecords.forEach(record => {
      const dateStr = record.date.toISOString().split('T')[0];
      if (!attendanceByDate[dateStr]) {
        attendanceByDate[dateStr] = {
          date: dateStr,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          records: []
        };
      }

      attendanceByDate[dateStr].total++;
      if (record.status === 'present') attendanceByDate[dateStr].present++;
      if (record.status === 'absent') attendanceByDate[dateStr].absent++;
      if (record.status === 'late') attendanceByDate[dateStr].late++;

      attendanceByDate[dateStr].records.push({
        userId: record.userId?._id,
        name: record.userId?.name || 'Unknown User',
        email: record.userId?.email || '',
        department: record.userId?.department || '',
        status: record.status,
        checkInTime: record.checkInTime,
        checkOutTime: record.checkOutTime,
        workHours: record.workHours
      });
    });

    // Convert to array and sort by date
    const report = Object.values(attendanceByDate).sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    res.status(200).json({
      success: true,
      startDate: start,
      endDate: end,
      totalRecords: attendanceRecords.length,
      report
    });
  } catch (error) {
    console.error('Error generating attendance report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate attendance report',
      error: error.message
    });
  }
};

// Get location tracking report
exports.getLocationReport = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;

    // Parse dates
    const start = startDate ? new Date(startDate) : new Date();
    start.setHours(0, 0, 0, 0);
    
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    // Build query
    const query = {
      timestamp: { $gte: start, $lte: end }
    };

    if (userId) {
      query.userId = userId;
    }

    // Get location records
    const locationRecords = await Location.find(query)
      .sort({ timestamp: -1 })
      .populate('userId', 'name email department');

    // Group by user
    const locationsByUser = {};
    locationRecords.forEach(record => {
      const userId = record.userId?._id?.toString() || 'unknown';
      
      if (!locationsByUser[userId]) {
        locationsByUser[userId] = {
          userId: record.userId?._id,
          name: record.userId?.name || 'Unknown User',
          email: record.userId?.email || '',
          department: record.userId?.department || '',
          locationCount: 0,
          locations: []
        };
      }

      locationsByUser[userId].locationCount++;
      locationsByUser[userId].locations.push({
        latitude: record.location.latitude,
        longitude: record.location.longitude,
        timestamp: record.timestamp,
        distance: record.distance
      });
    });

    // Convert to array
    const report = Object.values(locationsByUser);

    res.status(200).json({
      success: true,
      startDate: start,
      endDate: end,
      totalUsers: report.length,
      totalLocations: locationRecords.length,
      report
    });
  } catch (error) {
    console.error('Error generating location report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate location report',
      error: error.message
    });
  }
};