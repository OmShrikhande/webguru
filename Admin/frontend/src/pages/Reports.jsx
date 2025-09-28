import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ProfessionalDashboard from '../components/dashboard/ProfessionalDashboard';
import FuturisticBackground from '../components/backgrounds/FuturisticBackground';

const Reports = () => {
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [attendanceMeta, setAttendanceMeta] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('users');
  const [errorMessage, setErrorMessage] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [filters, setFilters] = useState({
    department: '',
    status: ''
  });

  useEffect(() => {
    fetchReportData();
  }, [reportType, dateRange, filters]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const token = localStorage.getItem('token');

      if (reportType === 'users') {
        const response = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data.users);
      } else if (reportType === 'attendance') {
        // Fetch detailed records (fallback)
        try {
          const response = await axios.get('http://localhost:5000/api/attendance', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
              status: filters.status,
              limit: 100
            }
          });
          setAttendance(response.data.data || []);
        } catch (err) {
          console.log('Attendance data not available');
          setAttendance([]);
        }

        // Fetch aggregated summary
        try {
          const summaryResponse = await axios.get('http://localhost:5000/api/reports/attendance-summary', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
              department: filters.department || undefined
            }
          });

          setAttendanceSummary(summaryResponse.data.data || []);
          setAttendanceMeta(summaryResponse.data.meta || { startDate: dateRange.startDate, endDate: dateRange.endDate });
        } catch (summaryError) {
          console.error('Attendance summary not available:', summaryError);
          setAttendanceSummary([]);
          setAttendanceMeta({ startDate: dateRange.startDate, endDate: dateRange.endDate });
          setErrorMessage('Unable to load attendance summary. Showing detailed records instead.');
        }
      }
      
      setAttendanceMeta((prevMeta) => ({
        startDate: prevMeta.startDate || dateRange.startDate,
        endDate: prevMeta.endDate || dateRange.endDate
      }));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setErrorMessage('Failed to fetch report data. Please try again.');
      setLoading(false);
    }
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    let csvContent = '';
    
    if (reportType === 'users') {
      csvContent = 'Name,Email,Department,Mobile,Status,Joining Date,Address\n';
      data.forEach(user => {
        csvContent += `"${user.name}","${user.email}","${user.department}","${user.mobile}","${user.is_active ? 'Active' : 'Inactive'}","${new Date(user.joiningDate).toLocaleDateString()}","${user.address}"\n`;
      });
    } else if (reportType === 'attendance') {
      csvContent = 'Name,Department,Present Days,Absent Days,Half Days,Late Days,Total Hours Worked,Total Records\n';
      data.forEach(record => {
        csvContent += `"${record.name}","${record.department}","${record.presentDays}","${record.absentDays}","${record.halfDays}","${record.lateDays}","${record.totalHoursWorked}","${record.totalRecords}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePDF = () => {
    alert('PDF generation feature will be implemented with a PDF library like jsPDF');
  };

  const ReportCard = ({ title, value, subtitle, icon, color }) => (
    <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 
                    hover:bg-white/20 transition-all duration-300 transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-${color}-200 text-sm font-medium`}>{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-gray-300 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`bg-${color}-500/20 p-3 rounded-xl`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  const filteredUsers = users.filter(user => {
    const matchesDepartment = !filters.department || user.department === filters.department;
    const matchesStatus = !filters.status || 
                         (filters.status === 'active' && user.is_active) ||
                         (filters.status === 'inactive' && !user.is_active);
    return matchesDepartment && matchesStatus;
  });

  const departments = [...new Set(users.map(user => user.department).filter(Boolean))];

  return (
    <FuturisticBackground variant="reports">
      <ProfessionalDashboard>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
              <p className="text-green-200">Generate and export comprehensive reports</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => exportToCSV(
                  reportType === 'users'
                    ? filteredUsers
                    : attendanceSummary.length > 0
                      ? attendanceSummary
                      : attendance,
                  reportType
                )}
                className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 
                         text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                📊 Export CSV
              </button>
              <button
                onClick={generatePDF}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 
                         text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                📄 Export PDF
              </button>
            </div>
          </div>

          {/* Report Type Selection */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Report Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg 
                           text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="users" className="text-black">User Report</option>
                  <option value="attendance" className="text-black">Attendance Report</option>
                  <option value="department" className="text-black">Department Report</option>
                  <option value="performance" className="text-black">Performance Report</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg 
                           text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">End Date</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg 
                           text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Department</label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg 
                           text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="" className="text-black">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept} className="text-black">{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Report Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {reportType === 'users' && (
              <>
                <ReportCard
                  title="Total Users"
                  value={filteredUsers.length}
                  subtitle="In selected criteria"
                  icon="👥"
                  color="blue"
                />
                <ReportCard
                  title="Active Users"
                  value={filteredUsers.filter(u => u.is_active).length}
                  subtitle="Currently active"
                  icon="✅"
                  color="green"
                />
                <ReportCard
                  title="Inactive Users"
                  value={filteredUsers.filter(u => !u.is_active).length}
                  subtitle="Currently inactive"
                  icon="❌"
                  color="red"
                />
                <ReportCard
                  title="Departments"
                  value={departments.length}
                  subtitle="Total departments"
                  icon="🏢"
                  color="purple"
                />
              </>
            )}

            {reportType === 'attendance' && (
              <>
                <ReportCard
                  title="Present Days"
                  value={attendanceSummary.reduce((sum, item) => sum + item.presentDays, 0)}
                  subtitle={`${attendanceSummary.length} employees`}
                  icon="✅"
                  color="green"
                />
                <ReportCard
                  title="Absent Days"
                  value={attendanceSummary.reduce((sum, item) => sum + item.absentDays, 0)}
                  subtitle="Includes half-day conversions"
                  icon="🚫"
                  color="red"
                />
                <ReportCard
                  title="Half Days"
                  value={attendanceSummary.reduce((sum, item) => sum + item.halfDays, 0)}
                  subtitle="Raw half-day count"
                  icon="🌓"
                  color="yellow"
                />
                <ReportCard
                  title="Total Hours"
                  value={`${attendanceSummary.reduce((sum, item) => sum + item.totalHoursWorked, 0).toFixed(1)}h`}
                  subtitle="Across all employees"
                  icon="⏱️"
                  color="blue"
                />
              </>
            )}
          </div>

          {/* Report Data Table */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  {reportType === 'users' ? 'User Data' : 
                   reportType === 'attendance' ? `Attendance Summary (${attendanceMeta.startDate} to ${attendanceMeta.endDate})` : 'Report Data'}
                </h3>
                <div className="text-white text-sm">
                  {reportType === 'users' ? filteredUsers.length : attendanceSummary.length || attendance.length} records
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-96">
                {reportType === 'users' && (
                  <table className="w-full">
                    <thead className="bg-white/20">
                      <tr>
                        <th className="px-6 py-4 text-left text-white font-medium">Name</th>
                        <th className="px-6 py-4 text-left text-white font-medium">Email</th>
                        <th className="px-6 py-4 text-left text-white font-medium">Department</th>
                        <th className="px-6 py-4 text-left text-white font-medium">Status</th>
                        <th className="px-6 py-4 text-left text-white font-medium">Joining Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, index) => (
                        <tr key={user._id} className="border-b border-white/10 hover:bg-white/10">
                          <td className="px-6 py-4 text-white">{user.name}</td>
                          <td className="px-6 py-4 text-white">{user.email}</td>
                          <td className="px-6 py-4 text-white">{user.department}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.is_active 
                                ? 'bg-green-500/20 text-green-300' 
                                : 'bg-red-500/20 text-red-300'
                            }`}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-white">
                            {new Date(user.joiningDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {reportType === 'attendance' && (
                  <table className="w-full">
                    <thead className="bg-white/20">
                      <tr>
                        <th className="px-6 py-4 text-left text-white font-medium">Employee</th>
                        <th className="px-6 py-4 text-left text-white font-medium">Department</th>
                        <th className="px-6 py-4 text-left text-white font-medium">Present Days</th>
                        <th className="px-6 py-4 text-left text-white font-medium">Absent Days</th>
                        <th className="px-6 py-4 text-left text-white font-medium">Half Days</th>
                        <th className="px-6 py-4 text-left text-white font-medium">Late Days</th>
                        <th className="px-6 py-4 text-left text-white font-medium">Total Hours</th>
                        <th className="px-6 py-4 text-left text-white font-medium">Records</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceSummary.map((record) => (
                        <tr key={record.userId} className="border-b border-white/10 hover:bg-white/10">
                          <td className="px-6 py-4 text-white">{record.name}</td>
                          <td className="px-6 py-4 text-white">{record.department}</td>
                          <td className="px-6 py-4 text-white">{record.presentDays}</td>
                          <td className="px-6 py-4 text-white">{record.absentDays}</td>
                          <td className="px-6 py-4 text-white">{record.halfDays}</td>
                          <td className="px-6 py-4 text-white">{record.lateDays}</td>
                          <td className="px-6 py-4 text-white">{record.totalHoursWorked.toFixed(2)}h</td>
                          <td className="px-6 py-4 text-white">{record.totalRecords}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => setReportType('users')}
                className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 p-4 rounded-xl 
                         transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-2xl mb-2">👥</div>
                <div className="font-medium">User Report</div>
              </button>
              
              <button
                onClick={() => setReportType('attendance')}
                className="bg-green-500/20 hover:bg-green-500/40 text-green-300 p-4 rounded-xl 
                         transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-2xl mb-2">📅</div>
                <div className="font-medium">Attendance</div>
              </button>
              
              <button
                onClick={() => exportToCSV(reportType === 'users' ? filteredUsers : attendance, reportType)}
                className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 p-4 rounded-xl 
                         transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-2xl mb-2">📊</div>
                <div className="font-medium">Export Data</div>
              </button>
              
              <button
                onClick={fetchReportData}
                className="bg-orange-500/20 hover:bg-orange-500/40 text-orange-300 p-4 rounded-xl 
                         transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-2xl mb-2">🔄</div>
                <div className="font-medium">Refresh</div>
              </button>
            </div>
          </div>
        </div>
      </ProfessionalDashboard>
    </FuturisticBackground>
  );
};

export default Reports;