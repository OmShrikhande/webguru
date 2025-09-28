const mongoose = require('mongoose');
const Holiday = require('../models/Holiday');

// Get all holidays
exports.getAllHolidays = async (req, res) => {
  try {
    const { year, month, type } = req.query;
    
    let filter = { isActive: true };
    
    // Filter by year and month if provided
    if (year || month) {
      const startDate = new Date(year || new Date().getFullYear(), (month || 1) - 1, 1);
      const endDate = month ? 
        new Date(year || new Date().getFullYear(), month, 0) : 
        new Date((year || new Date().getFullYear()) + 1, 0, 0);
      
      filter.date = {
        $gte: startDate,
        $lte: endDate
      };
    }
    
    // Filter by type if provided
    if (type) {
      filter.type = type;
    }
    
    const holidays = await Holiday.find(filter).sort({ date: 1 });
    
    res.status(200).json({
      success: true,
      count: holidays.length,
      holidays
    });
  } catch (err) {
    console.error('Error fetching holidays:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch holidays',
      error: err.message
    });
  }
};

// Create a new holiday
exports.createHoliday = async (req, res) => {
  try {
    const { name, date, type, description, isRecurring, recurringType } = req.body;
    
    // Check if holiday already exists for this date
    const existingHoliday = await Holiday.findOne({ 
      date: new Date(date),
      isActive: true 
    });
    
    if (existingHoliday) {
      return res.status(400).json({
        success: false,
        message: 'Holiday already exists for this date'
      });
    }
    
    const newHoliday = new Holiday({
      name,
      date: new Date(date),
      type: type || 'company',
      description: description || '',
      isRecurring: isRecurring || false,
      recurringType: isRecurring ? recurringType : null
    });
    
    await newHoliday.save();
    
    res.status(201).json({
      success: true,
      message: 'Holiday created successfully',
      holiday: newHoliday
    });
  } catch (err) {
    console.error('Error creating holiday:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to create holiday',
      error: err.message
    });
  }
};

// Update a holiday
exports.updateHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid holiday ID'
      });
    }
    
    const holiday = await Holiday.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: 'Holiday not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Holiday updated successfully',
      holiday
    });
  } catch (err) {
    console.error('Error updating holiday:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update holiday',
      error: err.message
    });
  }
};

// Delete a holiday
exports.deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid holiday ID'
      });
    }
    
    // Soft delete by setting isActive to false
    const holiday = await Holiday.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
    
    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: 'Holiday not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Holiday deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting holiday:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete holiday',
      error: err.message
    });
  }
};

// Initialize default holidays (Sundays and common holidays)
exports.initializeDefaultHolidays = async (req, res) => {
  try {
    const { year } = req.body;
    const targetYear = year || new Date().getFullYear();
    
    const holidays = [];
    
    // Add all Sundays for the year
    const startDate = new Date(targetYear, 0, 1);
    const endDate = new Date(targetYear, 11, 31);
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      if (date.getDay() === 0) { // Sunday
        holidays.push({
          name: 'Sunday',
          date: new Date(date),
          type: 'weekly',
          description: 'Weekly holiday',
          isRecurring: true,
          recurringType: 'weekly'
        });
      }
    }
    
    // Add common national holidays (you can customize these based on your country)
    const nationalHolidays = [
      { name: 'New Year\'s Day', month: 0, day: 1 },
      { name: 'Independence Day', month: 7, day: 15 }, // August 15 (India)
      { name: 'Gandhi Jayanti', month: 9, day: 2 }, // October 2 (India)
      { name: 'Christmas Day', month: 11, day: 25 }
    ];
    
    nationalHolidays.forEach(holiday => {
      holidays.push({
        name: holiday.name,
        date: new Date(targetYear, holiday.month, holiday.day),
        type: 'national',
        description: 'National holiday',
        isRecurring: true,
        recurringType: 'yearly'
      });
    });
    
    // Insert holidays, avoiding duplicates
    let insertedCount = 0;
    for (const holiday of holidays) {
      const existing = await Holiday.findOne({
        date: holiday.date,
        isActive: true
      });
      
      if (!existing) {
        await Holiday.create(holiday);
        insertedCount++;
      }
    }
    
    res.status(200).json({
      success: true,
      message: `Default holidays initialized for ${targetYear}`,
      insertedCount,
      totalHolidays: holidays.length
    });
  } catch (err) {
    console.error('Error initializing default holidays:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize default holidays',
      error: err.message
    });
  }
};

module.exports = exports;