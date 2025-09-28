const mongoose = require('mongoose');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const VisitLocation = require('../models/visitLocation');
const Holiday = require('../models/Holiday');

const HALF_DAY_STATUS = 'half-day';
const PRESENT_STATUSES = ['present', 'late'];
const HALF_DAY_THRESHOLD = 4;
const HALF_DAY_ABSENCE_RATIO = 0.5;
const DEFAULT_SUMMARY_RANGE_DAYS = 30;

const normaliseDate = (date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const coerceDate = (value) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const validateDateRange = (startDateInput, endDateInput) => {
  let endDate = coerceDate(endDateInput) || new Date();
  endDate = normaliseDate(endDate);

  let startDate = coerceDate(startDateInput);
  if (!startDate) {
    startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - (DEFAULT_SUMMARY_RANGE_DAYS - 1));
  }
  startDate = normaliseDate(startDate);

  if (startDate > endDate) {
    const swapped = startDate;
    startDate = endDate;
    endDate = swapped;
  }

  return {
    startDate,
    endDate,
    startDateString: startDate.toISOString().split('T')[0],
    endDateString: endDate.toISOString().split('T')[0]
  };
};

// Helper function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

const getActiveHolidaysInRange = async (startDate, endDate) => {
  const holidays = await Holiday.find({
    date: {
      $gte: startDate,
      $lte: endDate
    },
    isActive: true
  }).select('date name');

  const holidayDatesSet = new Set(holidays.map((holiday) => holiday.date.toDateString()));

  return {
    holidays,
    holidayDateSet: holidayDatesSet
  };
};

const getWorkingDaysBetweenDates = async (startDate, endDate) => {
  const { holidays, holidayDateSet } = await getActiveHolidaysInRange(startDate, endDate);

  let workingDays = 0;
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    currentDate.setHours(0, 0, 0, 0);
    const dayOfWeek = currentDate.getDay();
    const isWeeklyOff = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = holidayDateSet.has(currentDate.toDateString());

    if (!isWeeklyOff && !isHoliday) {
      workingDays++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    workingDays,
    totalDays: Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1,
    holidays: holidays.length,
    holidayDateSet
  };
};

const summarizeAttendance = (attendanceRecords = []) => {
  let presentDays = 0;
  let lateDays = 0;
  let halfDays = 0;
  let absentDays = 0;
  let totalHoursWorked = 0;
  let totalRecords = 0;

  attendanceRecords.forEach((record) => {
    switch (record.status) {
      case 'present':
        presentDays += 1;
        break;
      case 'late':
        presentDays += 1;
        lateDays += 1;
        break;
      case HALF_DAY_STATUS:
        halfDays += 1;
        break;
      default:
        absentDays += 1;
    }

    if (record.loginTime && record.logoutTime) {
      totalHoursWorked +=
        (new Date(record.logoutTime) - new Date(record.loginTime)) / (1000 * 60 * 60);
    }

    totalRecords += 1;
  });

  const cappedHalfDays = Math.min(halfDays, HALF_DAY_THRESHOLD);
  const excessHalfDays = Math.max(halfDays - HALF_DAY_THRESHOLD, 0);

  presentDays += cappedHalfDays;
  absentDays += excessHalfDays * HALF_DAY_ABSENCE_RATIO;

  return {
    presentDays,
    lateDays,
    halfDays,
    absentDays,
    totalHoursWorked,
    totalRecords
  };
};

const buildDailyBreakdown = async (startDate, endDate, attendanceRecords, holidayDateSet) => {
  const breakdown = [];
  const attendanceMap = new Map();

  attendanceRecords.forEach((record) => {
    const recordDate = new Date(record.date);
    recordDate.setHours(0, 0, 0, 0);
    attendanceMap.set(recordDate.toDateString(), record);
  });

  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    currentDate.setHours(0, 0, 0, 0);
    const dayOfWeek = currentDate.getDay();
    const isWeeklyOff = dayOfWeek === 0 || dayOfWeek === 6;
    const dateString = currentDate.toISOString().split('T')[0];
    const holidayRecord = holidayDateSet ? holidayDateSet.has(currentDate.toDateString()) : false;

    let holidayDetails = null;
    if (holidayRecord) {
      holidayDetails = await Holiday.findOne({
        date: {
          $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
          $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
        },
        isActive: true
      }).select('name');
    }

    const attendanceForDay = attendanceMap.get(currentDate.toDateString());

    breakdown.push({
      date: dateString,
      dayName: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
      isWeekend: isWeeklyOff,
      isHoliday: !!holidayRecord,
      holidayName: holidayDetails ? holidayDetails.name : null,
      isWorkingDay: !isWeeklyOff && !holidayRecord,
      attendance: attendanceForDay
        ? {
            status: attendanceForDay.status,
            loginTime: attendanceForDay.loginTime,
            logoutTime: attendanceForDay.logoutTime,
            hoursWorked:
              attendanceForDay.loginTime && attendanceForDay.logoutTime
                ?
                    (new Date(attendanceForDay.logoutTime) -
                      new Date(attendanceForDay.loginTime)) /
                    (1000 * 60 * 60)
                : 0
          }
        : null
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return breakdown;
};

const applyHalfDayConversion = ({ presentDays, halfDays, absentDays }) => {
  const cappedHalfDays = Math.min(halfDays, HALF_DAY_THRESHOLD);
  const excessHalfDays = Math.max(halfDays - HALF_DAY_THRESHOLD, 0);

  const normalizedPresentDays = presentDays + cappedHalfDays;
  const normalizedAbsentDays = absentDays + excessHalfDays * HALF_DAY_ABSENCE_RATIO;

  return {
    normalizedPresentDays,
    normalizedAbsentDays,
    cappedHalfDays,
    excessHalfDays
  };
};

const buildUserAttendanceSummary = ({ user, summary, totalRecords, totalHoursWorked, halfDays, lateDays }) => {
  const { normalizedPresentDays, normalizedAbsentDays } = applyHalfDayConversion({
    presentDays: summary.presentDays,
    halfDays,
    absentDays: summary.absentDays
  });

  return {
    userId: user._id,
    name: user.name,
    email: user.email,
    department: user.department,
    presentDays: Number(normalizedPresentDays.toFixed(2)),
    absentDays: Number(normalizedAbsentDays.toFixed(2)),
    halfDays,
    lateDays,
    totalHoursWorked: Number(totalHoursWorked.toFixed(2)),
    totalRecords
  };
};

const summariseRecords = (records = []) => {
  let presentDays = 0;
  let lateDays = 0;
  let halfDays = 0;
  let absentDays = 0;
  let totalHoursWorked = 0;

  records.forEach((record) => {
    switch (record.status) {
      case 'present':
        presentDays += 1;
        break;
      case 'late':
        presentDays += 1;
        lateDays += 1;
        break;
      case HALF_DAY_STATUS:
        halfDays += 1;
        break;
      default:
        absentDays += 1;
    }

    if (record.loginTime && record.logoutTime) {
      totalHoursWorked +=
        (new Date(record.logoutTime) - new Date(record.loginTime)) /
        (1000 * 60 * 60);
    }
  });

  return {
    presentDays,
    lateDays,
    halfDays,
    absentDays,
    totalHoursWorked
  };
};

const fetchAttendanceForRange = async ({ userId, startDate, endDate }) =>
  Attendance.find({
    userId,
    date: {
      $gte: startDate.toISOString().split('T')[0],
      $lte: endDate.toISOString().split('T')[0]
    }
  })
    .sort({ date: 1, createdAt: 1 });

const aggregateAttendanceSummary = async (startDate, endDate) => {
  const users = await User.find({ is_active: true }).select('name email department');

  const summaries = [];

  for (const user of users) {
    const records = await fetchAttendanceForRange({ userId: user._id, startDate, endDate });

    if (!records.length) {
      continue;
    }

    const { presentDays, lateDays, halfDays, absentDays, totalHoursWorked } = summariseRecords(records);

    summaries.push(
      buildUserAttendanceSummary({
        user,
        summary: { presentDays, absentDays },
        totalRecords: records.length,
        totalHoursWorked,
        halfDays,
        lateDays
      })
    );
  }

  summaries.sort((a, b) => a.name.localeCompare(b.name));

  return summaries;
};

exports.generateAttendanceSummaryReport = async (req, res) => {
  try {
    const {
      startDate: startDateInput,
      endDate: endDateInput,
      department: departmentFilter
    } = req.query;

    const { startDate, endDate, startDateString, endDateString } = validateDateRange(startDateInput, endDateInput);

    const filter = departmentFilter ? { department: departmentFilter } : {};
    const users = await User.find({ is_active: true, ...filter }).select('name email department');

    const summaries = [];

    for (const user of users) {
      const records = await fetchAttendanceForRange({ userId: user._id, startDate, endDate });

      if (!records.length) {
        continue;
      }

      const { presentDays, lateDays, halfDays, absentDays, totalHoursWorked } = summariseRecords(records);

      summaries.push(
        buildUserAttendanceSummary({
          user,
          summary: { presentDays, absentDays },
          totalRecords: records.length,
          totalHoursWorked,
          halfDays,
          lateDays
        })
      );
    }

    res.json({
      success: true,
      data: summaries,
      meta: {
        startDate: startDateString,
        endDate: endDateString,
        departments: departmentFilter ? [departmentFilter] : 'all'
      }
    });
  } catch (error) {
    console.error('Error generating attendance summary report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate attendance summary report',
      error: error.message
    });
  }
};

const buildVisitSummary = (visitLocations = []) => {
  let totalDistance = 0;

  visitLocations.forEach((visit) => {
    if (visit.distanceTraveled) {
      totalDistance += visit.distanceTraveled;
    } else if (
      visit.startLocation &&
      visit.endLocation &&
      visit.startLocation.latitude &&
      visit.endLocation.latitude
    ) {
      totalDistance += calculateDistance(
        visit.startLocation.latitude,
        visit.startLocation.longitude,
        visit.endLocation.latitude,
        visit.endLocation.longitude
      );
    }
  });

  return {
    totalVisits: visitLocations.length,
    completedVisits: visitLocations.filter((visit) => visit.visitStatus === 'completed').length,
    totalDistanceTraveled: Math.round(totalDistance * 100) / 100,
    averageDistancePerVisit:
      visitLocations.length > 0
        ? Math.round((totalDistance / visitLocations.length) * 100) / 100
        : 0,
    visitDetails: visitLocations.map((visit) => ({
      id: visit._id,
      address: visit.address,
      visitDate: visit.visitDate,
      status: visit.visitStatus,
      distanceTraveled:
        visit.distanceTraveled && Number.isFinite(visit.distanceTraveled)
          ? visit.distanceTraveled
          : visit.startLocation &&
              visit.endLocation &&
              visit.startLocation.latitude &&
              visit.endLocation.latitude
            ? Math.round(
                calculateDistance(
                  visit.startLocation.latitude,
                  visit.startLocation.longitude,
                  visit.endLocation.latitude,
                  visit.endLocation.longitude
                ) * 100
              ) / 100
            : 0
    }))
  };
};

const buildReportPayload = ({
  user,
  reportYear,
  reportMonth,
  startDate,
  endDate,
  attendanceSummary,
  workingDaysInfo,
  dailyBreakdown
}) => {
  const absentDays = Math.max(
    0,
    workingDaysInfo.workingDays - attendanceSummary.presentDays
  );

  const attendancePercentage =
    workingDaysInfo.workingDays > 0
      ? (attendanceSummary.presentDays / workingDaysInfo.workingDays) * 100
      : 0;

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      department: user.department
    },
    reportPeriod: {
      year: reportYear,
      month: reportMonth,
      monthName: new Date(reportYear, reportMonth - 1).toLocaleDateString('en-US', {
        month: 'long'
      }),
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    },
    attendanceAnalysis: {
      totalWorkingDays: workingDaysInfo.workingDays,
      holidaysCount: workingDaysInfo.holidays,
      presentDays: attendanceSummary.presentDays,
      absentDays,
      attendancePercentage: Number(attendancePercentage.toFixed(2)),
      totalHoursWorked: Number(attendanceSummary.totalHoursWorked.toFixed(2)),
      averageHoursPerDay:
        attendanceSummary.presentDays > 0
          ? Number(
              (attendanceSummary.totalHoursWorked / attendanceSummary.presentDays).toFixed(2)
            )
          : 0
    },
    dailyBreakdown,
    generatedAt: new Date()
  };
};

// Generate monthly attendance report for a user
exports.generateMonthlyAttendanceReport = async (req, res) => {
  try {
    const { userId } = req.params;
    const { year, month } = req.query;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    const reportYear = parseInt(year, 10) || new Date().getFullYear();
    const reportMonth = parseInt(month, 10) || new Date().getMonth() + 1;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const startDate = new Date(reportYear, reportMonth - 1, 1);
    const endDate = new Date(reportYear, reportMonth, 0);

    const workingDaysInfo = await getWorkingDaysBetweenDates(startDate, endDate);

    const attendanceRecords = await Attendance.find({
      userId,
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ createdAt: 1 });

    const visitLocations = await VisitLocation.find({
      userId,
      createdAt: {
        $gte: startDate,
        $lte: endDate
      },
      visitStatus: 'completed'
    });

    const attendanceSummary = summarizeAttendance(attendanceRecords);
    const dailyBreakdown = await buildDailyBreakdown(
      startDate,
      endDate,
      attendanceRecords,
      workingDaysInfo.holidayDateSet
    );

    const report = buildReportPayload({
      user,
      reportYear,
      reportMonth,
      startDate,
      endDate,
      attendanceSummary,
      workingDaysInfo,
      dailyBreakdown
    });

    res.status(200).json({
      success: true,
      message: 'Monthly report generated successfully',
      report
    });
  } catch (err) {
    console.error('Error generating monthly report:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to generate monthly report',
      error: err.message
    });
  }
};

// Generate monthly reports for all users
exports.generateAllUsersMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    
    const reportYear = parseInt(year) || new Date().getFullYear();
    const reportMonth = parseInt(month) || new Date().getMonth() + 1;
    
    // Get all active users
    const users = await User.find({ is_active: true });
    
    const reports = [];
    
    for (const user of users) {
      // Generate report for each user
      const userReport = await generateUserMonthlyReport(user._id, reportYear, reportMonth);
      reports.push(userReport);
    }
    
    // Calculate overall statistics
    const overallStats = {
      totalUsers: users.length,
      averageAttendance: reports.reduce((sum, report) => 
        sum + report.attendanceAnalysis.attendancePercentage, 0) / reports.length,
      totalDistanceTraveled: reports.reduce((sum, report) => 
        sum + report.visitSummary.totalDistanceTraveled, 0),
      totalVisitsCompleted: reports.reduce((sum, report) => 
        sum + report.visitSummary.completedVisits, 0)
    };
    
    res.status(200).json({
      success: true,
      message: 'All users monthly reports generated successfully',
      reportPeriod: {
        year: reportYear,
        month: reportMonth,
        monthName: new Date(reportYear, reportMonth - 1).toLocaleDateString('en-US', { month: 'long' })
      },
      overallStats,
      userReports: reports,
      generatedAt: new Date()
    });
    
  } catch (err) {
    console.error('Error generating all users monthly report:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to generate all users monthly report',
      error: err.message
    });
  }
};

// Helper function to generate report for a single user (used internally)
const generateUserMonthlyReport = async (userId, year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  const user = await User.findById(userId);
  const workingDaysInfo = await getWorkingDaysInMonth(year, month);
  
  const attendanceRecords = await Attendance.find({
    userId: userId,
    createdAt: { $gte: startDate, $lte: endDate }
  });
  
  const visitLocations = await VisitLocation.find({
    userId: userId,
    createdAt: { $gte: startDate, $lte: endDate },
    visitStatus: 'completed'
  });
  
  let totalDistanceTraveled = 0;
  visitLocations.forEach(visit => {
    if (visit.distanceTraveled) {
      totalDistanceTraveled += visit.distanceTraveled;
    }
  });
  
  const attendanceAnalysis = {
    totalWorkingDays: workingDaysInfo.workingDays,
    presentDays: attendanceRecords.filter(r => ['present', 'late'].includes(r.status)).length,
    absentDays: workingDaysInfo.workingDays - attendanceRecords.filter(r => ['present', 'late'].includes(r.status)).length,
    attendancePercentage: workingDaysInfo.workingDays > 0 ? 
      (attendanceRecords.filter(r => ['present', 'late'].includes(r.status)).length / workingDaysInfo.workingDays) * 100 : 0
  };
  
  const visitSummary = {
    totalVisits: visitLocations.length,
    completedVisits: visitLocations.filter(v => v.visitStatus === 'completed').length,
    totalDistanceTraveled: Math.round(totalDistanceTraveled * 100) / 100
  };
  
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      department: user.department
    },
    attendanceAnalysis,
    visitSummary
  };
};

// Update visit location with distance tracking
exports.updateVisitLocationDistance = async (req, res) => {
  try {
    const { visitId } = req.params;
    const { startLocation, endLocation, routePoints } = req.body;
    
    if (!mongoose.isValidObjectId(visitId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid visit ID'
      });
    }
    
    const visit = await VisitLocation.findById(visitId);
    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Visit location not found'
      });
    }
    
    let totalDistance = 0;
    
    // Calculate distance from route points if provided
    if (routePoints && routePoints.length > 1) {
      for (let i = 1; i < routePoints.length; i++) {
        const distance = calculateDistance(
          routePoints[i-1].latitude,
          routePoints[i-1].longitude,
          routePoints[i].latitude,
          routePoints[i].longitude
        );
        totalDistance += distance;
      }
      visit.routePoints = routePoints;
    } else if (startLocation && endLocation) {
      // Calculate straight-line distance if route points not available
      totalDistance = calculateDistance(
        startLocation.latitude,
        startLocation.longitude,
        endLocation.latitude,
        endLocation.longitude
      );
    }
    
    // Update visit location with distance and location data
    if (startLocation) {
      visit.startLocation = {
        latitude: startLocation.latitude,
        longitude: startLocation.longitude,
        timestamp: startLocation.timestamp || new Date()
      };
    }
    
    if (endLocation) {
      visit.endLocation = {
        latitude: endLocation.latitude,
        longitude: endLocation.longitude,
        timestamp: endLocation.timestamp || new Date()
      };
    }
    
    visit.distanceTraveled = Math.round(totalDistance * 100) / 100; // Round to 2 decimal places
    visit.updatedAt = new Date();
    
    await visit.save();
    
    res.status(200).json({
      success: true,
      message: 'Visit location distance updated successfully',
      visit: {
        id: visit._id,
        distanceTraveled: visit.distanceTraveled,
        startLocation: visit.startLocation,
        endLocation: visit.endLocation,
        routePoints: visit.routePoints
      }
    });
    
  } catch (err) {
    console.error('Error updating visit location distance:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update visit location distance',
      error: err.message
    });
  }
};

module.exports = exports;