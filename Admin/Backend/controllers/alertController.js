const Alert = require('../models/Alert');
const User = require('../models/User');

const buildUserFilters = ({ recipients, department, sendToActiveOnly }) => {
  const filters = {};

  if (recipients === 'department') {
    filters.department = department;
  }

  if (sendToActiveOnly) {
    filters.is_active = true;
  }

  return filters;
};

const resolveSenderDetails = (admin = {}) => {
  const {
    _id: adminId = null,
    firstName = '',
    lastName = '',
    username = '',
    email = '',
    role = 'Admin'
  } = admin;

  const displayName = firstName || lastName
    ? `${firstName || ''} ${lastName || ''}`.trim()
    : username || email?.split('@')[0] || 'Admin';

  return {
    adminId,
    name: displayName,
    role
  };
};

exports.sendAlert = async (req, res) => {
  try {
    const {
      title = '',
      message,
      recipients,
      department,
      sendToActiveOnly = false
    } = req.body;

    if (!message || !recipients) {
      return res.status(400).json({
        success: false,
        message: 'Message and recipients are required.'
      });
    }

    if (recipients === 'department' && !department) {
      return res.status(400).json({
        success: false,
        message: 'Department is required when targeting a department.'
      });
    }

    const userFilters = buildUserFilters({ recipients, department, sendToActiveOnly });
    const users = await User.find(userFilters).select('_id');

    const alert = new Alert({
      title,
      message,
      recipients,
      department: recipients === 'department' ? department : null,
      sendToActiveOnly,
      targetUserIds: users.map((user) => user._id),
      recipientsCount: users.length,
      sentBy: resolveSenderDetails(req.user)
    });

    await alert.save();

    return res.status(201).json({
      success: true,
      message: 'Alert sent successfully.',
      data: alert
    });
  } catch (error) {
    console.error('Error sending alert:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send alert.',
      error: error.message
    });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const alerts = await Alert.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch alerts.',
      error: error.message
    });
  }
};