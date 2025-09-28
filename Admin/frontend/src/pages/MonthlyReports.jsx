import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  UserIcon, 
  ClockIcon, 
  MapPinIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import ProfessionalDashboard from '../components/dashboard/ProfessionalDashboard';
import FuturisticBackground from '../components/backgrounds/FuturisticBackground';
import StatsCard from '../components/ui/StatsCard';
import GlassTable from '../components/ui/GlassTable';
import StatusBadge from '../components/ui/StatusBadge';

const MonthlyReports = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState(null);
  const [allUsersReport, setAllUsersReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('single'); // 'single' or 'all'

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    }
  };

  const generateSingleUserReport = async () => {
    if (!selectedUser) {
      setError('Please select a user');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/reports/monthly/${selectedUser}?year=${selectedYear}&month=${selectedMonth}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setReport(response.data.report);
      setAllUsersReport(null);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report');
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const generateAllUsersReport = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/reports/monthly-all?year=${selectedYear}&month=${selectedMonth}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setAllUsersReport(response.data);
      setReport(null);
    } catch (err) {
      console.error('Error generating all users report:', err);
      setError('Failed to generate all users report');
      setAllUsersReport(null);
    } finally {
      setLoading(false);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-100';
      case 'absent': return 'text-red-600 bg-red-100';
      case 'late': return 'text-yellow-600 bg-yellow-100';
      case 'half-day': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const AttendanceCard = ({ title, value, icon: Icon, gradient = 'from-blue-500 to-indigo-600', textColor = 'text-blue-600' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-300 mb-2">{title}</p>
          <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} shadow-lg`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <FuturisticBackground variant="reports">
      <ProfessionalDashboard>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent flex items-center">
                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 mr-4 shadow-lg">
                  <DocumentTextIcon className="h-8 w-8 text-white" />
                </div>
                Monthly Reports
              </h1>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  <span>Export</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                >
                  <EyeIcon className="h-5 w-5" />
                  <span>Preview</span>
                </motion.button>
              </div>
            </div>

          {/* Report Type Selection */}
          <div className="mb-8">
            <div className="flex space-x-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode('single')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  viewMode === 'single'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                }`}
              >
                <UserIcon className="h-5 w-5 inline mr-2" />
                Single User Report
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode('all')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  viewMode === 'all'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                }`}
              >
                <ChartBarIcon className="h-5 w-5 inline mr-2" />
                All Users Report
              </motion.button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {viewMode === 'single' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select User
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-lg"
                >
                  <option value="" className="bg-gray-800 text-gray-300">Choose a user...</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id} className="bg-gray-800 text-gray-300">
                      {user.name} - {user.department}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-lg"
              >
                {months.map((month, index) => (
                  <option key={index} value={index + 1} className="bg-gray-800 text-gray-300">
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-lg"
              >
                {years.map((year) => (
                  <option key={year} value={year} className="bg-gray-800 text-gray-300">
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={viewMode === 'single' ? generateSingleUserReport : generateAllUsersReport}
                disabled={loading || (viewMode === 'single' && !selectedUser)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <>
                    <ChartBarIcon className="h-5 w-5 mr-2" />
                    Generate Report
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/20 border border-red-500/30 text-red-300 px-6 py-4 rounded-xl mb-6 backdrop-blur-lg"
            >
              <div className="flex items-center">
                <div className="p-2 bg-red-500/20 rounded-lg mr-3">
                  <span className="text-red-400">⚠️</span>
                </div>
                {error}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Single User Report */}
        {report && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* User Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 mr-4 shadow-lg">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
                {report.user.name} - {report.reportPeriod.monthName} {report.reportPeriod.year}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <span className="text-gray-400 text-sm">Email</span>
                  <p className="text-white font-medium">{report.user.email}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <span className="text-gray-400 text-sm">Department</span>
                  <p className="text-white font-medium">{report.user.department}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <span className="text-gray-400 text-sm">Report Period</span>
                  <p className="text-white font-medium">{report.reportPeriod.startDate} to {report.reportPeriod.endDate}</p>
                </div>
              </div>
            </motion.div>

            {/* Attendance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Working Days"
                value={report.attendanceAnalysis.totalWorkingDays}
                icon={CalendarIcon}
                gradient="from-blue-500 to-indigo-600"
                delay={0.1}
              />
              <StatsCard
                title="Present Days"
                value={report.attendanceAnalysis.presentDays}
                icon={ClockIcon}
                gradient="from-green-500 to-emerald-600"
                delay={0.2}
                trend="+5% from last month"
                trendDirection="up"
              />
              <StatsCard
                title="Absent Days"
                value={report.attendanceAnalysis.absentDays}
                icon={ClockIcon}
                gradient="from-red-500 to-rose-600"
                delay={0.3}
                trend={report.attendanceAnalysis.absentDays > 3 ? "Above average" : "Within range"}
                trendDirection={report.attendanceAnalysis.absentDays > 3 ? "down" : "up"}
              />
              <StatsCard
                title="Attendance %"
                value={`${report.attendanceAnalysis.attendancePercentage.toFixed(1)}%`}
                icon={ChartBarIcon}
                gradient="from-purple-500 to-violet-600"
                delay={0.4}
                trend={`${report.attendanceAnalysis.attendancePercentage >= 90 ? 'Excellent' : report.attendanceAnalysis.attendancePercentage >= 80 ? 'Good' : 'Needs Improvement'}`}
                trendDirection={report.attendanceAnalysis.attendancePercentage >= 90 ? 'up' : report.attendanceAnalysis.attendancePercentage >= 80 ? 'neutral' : 'down'}
              />
            </div>

            {/* Distance Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 mr-4 shadow-lg">
                  <MapPinIcon className="h-6 w-6 text-white" />
                </div>
                Travel & Visit Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white/5 rounded-2xl p-6 border border-white/10"
                >
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">
                    {report.visitSummary.totalVisits}
                  </p>
                  <p className="text-gray-400">Total Visits</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white/5 rounded-2xl p-6 border border-white/10"
                >
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-2">
                    {report.visitSummary.completedVisits}
                  </p>
                  <p className="text-gray-400">Completed</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white/5 rounded-2xl p-6 border border-white/10"
                >
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent mb-2">
                    {report.visitSummary.totalDistanceTraveled} km
                  </p>
                  <p className="text-gray-400">Total Distance</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white/5 rounded-2xl p-6 border border-white/10"
                >
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
                    {report.visitSummary.averageDistancePerVisit} km
                  </p>
                  <p className="text-gray-400">Avg per Visit</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Daily Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 mr-4 shadow-lg">
                  <CalendarIcon className="h-6 w-6 text-white" />
                </div>
                Daily Attendance Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Day</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Login Time</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Logout Time</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Hours</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {report.dailyBreakdown.map((day, index) => (
                      <motion.tr 
                        key={index} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className={`hover:bg-white/5 transition-colors duration-200 ${day.isWeekend || day.isHoliday ? 'bg-white/5' : ''}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{day.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {day.dayName}
                          {day.isHoliday && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
                              {day.holidayName}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {day.isWeekend ? (
                            <StatusBadge status="weekend" type="attendance" />
                          ) : day.isHoliday ? (
                            <StatusBadge status="holiday" type="attendance" />
                          ) : day.attendance ? (
                            <StatusBadge status={day.attendance.status} type="attendance" />
                          ) : (
                            <StatusBadge status="absent" type="attendance" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {day.attendance?.loginTime ? new Date(day.attendance.loginTime).toLocaleTimeString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {day.attendance?.logoutTime ? new Date(day.attendance.logoutTime).toLocaleTimeString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {day.attendance?.hoursWorked ? `${day.attendance.hoursWorked.toFixed(1)}h` : '-'}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Visit Details */}
            {report.visitSummary.visitDetails.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Visit Details</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance (km)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {report.visitSummary.visitDetails.map((visit, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{visit.address}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {visit.visitDate ? new Date(visit.visitDate).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                              {visit.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{visit.distanceTraveled}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* All Users Report */}
        {allUsersReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Overall Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Overall Statistics - {allUsersReport.reportPeriod.monthName} {allUsersReport.reportPeriod.year}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <AttendanceCard
                  title="Total Users"
                  value={allUsersReport.overallStats.totalUsers}
                  icon={UserIcon}
                  color="blue"
                />
                <AttendanceCard
                  title="Avg Attendance"
                  value={`${allUsersReport.overallStats.averageAttendance.toFixed(1)}%`}
                  icon={ChartBarIcon}
                  color="green"
                />
                <AttendanceCard
                  title="Total Distance"
                  value={`${allUsersReport.overallStats.totalDistanceTraveled.toFixed(1)} km`}
                  icon={MapPinIcon}
                  color="purple"
                />
                <AttendanceCard
                  title="Total Visits"
                  value={allUsersReport.overallStats.totalVisitsCompleted}
                  icon={CalendarIcon}
                  color="orange"
                />
              </div>
            </div>

            {/* User Reports Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Individual User Reports</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Days</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visits</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance (km)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allUsersReport.userReports.map((userReport, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {userReport.user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {userReport.user.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {userReport.attendanceAnalysis.totalWorkingDays}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {userReport.attendanceAnalysis.presentDays}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {userReport.attendanceAnalysis.absentDays}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            userReport.attendanceAnalysis.attendancePercentage >= 90 ? 'bg-green-100 text-green-800' :
                            userReport.attendanceAnalysis.attendancePercentage >= 75 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {userReport.attendanceAnalysis.attendancePercentage.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {userReport.visitSummary.completedVisits}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {userReport.visitSummary.totalDistanceTraveled}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
          </div>
        </div>
      </ProfessionalDashboard>
    </FuturisticBackground>
  );
};

export default MonthlyReports;