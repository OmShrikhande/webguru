import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import ProfessionalDashboard from '../components/dashboard/ProfessionalDashboard';
import FuturisticBackground from '../components/backgrounds/FuturisticBackground';
import StatusBadge from '../components/ui/StatusBadge';

const HolidayManagement = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    type: 'company',
    description: '',
    isRecurring: false,
    recurringType: ''
  });

  useEffect(() => {
    fetchHolidays();
  }, [selectedYear]);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/holidays?year=${selectedYear}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHolidays(response.data.holidays || []);
    } catch (err) {
      console.error('Error fetching holidays:', err);
      setError('Failed to fetch holidays');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      if (editingHoliday) {
        // Update existing holiday
        await axios.put(`http://localhost:5000/api/holidays/${editingHoliday._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Holiday updated successfully');
      } else {
        // Create new holiday
        await axios.post('http://localhost:5000/api/holidays', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Holiday created successfully');
      }
      
      resetForm();
      fetchHolidays();
    } catch (err) {
      console.error('Error saving holiday:', err);
      setError(err.response?.data?.message || 'Failed to save holiday');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (holiday) => {
    setEditingHoliday(holiday);
    setFormData({
      name: holiday.name,
      date: holiday.date.split('T')[0], // Format date for input
      type: holiday.type,
      description: holiday.description || '',
      isRecurring: holiday.isRecurring,
      recurringType: holiday.recurringType || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (holidayId) => {
    if (!window.confirm('Are you sure you want to delete this holiday?')) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/holidays/${holidayId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Holiday deleted successfully');
      fetchHolidays();
    } catch (err) {
      console.error('Error deleting holiday:', err);
      setError('Failed to delete holiday');
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultHolidays = async () => {
    if (!window.confirm(`Initialize default holidays for ${selectedYear}? This will add Sundays and national holidays.`)) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/holidays/initialize', 
        { year: selectedYear }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSuccess(`${response.data.insertedCount} holidays initialized successfully`);
      fetchHolidays();
    } catch (err) {
      console.error('Error initializing holidays:', err);
      setError('Failed to initialize holidays');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      date: '',
      type: 'company',
      description: '',
      isRecurring: false,
      recurringType: ''
    });
    setEditingHoliday(null);
    setShowForm(false);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'national': return 'bg-red-100 text-red-800';
      case 'regional': return 'bg-blue-100 text-blue-800';
      case 'company': return 'bg-green-100 text-green-800';
      case 'weekly': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i);

  return (
    <FuturisticBackground variant="calendar">
      <ProfessionalDashboard>
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent flex items-center">
                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 mr-4 shadow-lg">
                  <CalendarIcon className="h-8 w-8 text-white" />
                </div>
                Holiday Management
              </h1>
              <div className="flex space-x-4">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-lg"
                >
                  {years.map((year) => (
                    <option key={year} value={year} className="bg-gray-800 text-gray-300">{year}</option>
                  ))}
                </select>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={initializeDefaultHolidays}
                  className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-yellow-600 hover:to-orange-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Initialize Defaults
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Holiday
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

          {success && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-green-500/20 border border-green-500/30 text-green-300 px-6 py-4 rounded-xl mb-6 backdrop-blur-lg"
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-500/20 rounded-lg mr-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                </div>
                {success}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Holiday Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 mr-4 shadow-lg">
                <PlusIcon className="h-6 w-6 text-white" />
              </div>
              {editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Holiday Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-lg"
                    placeholder="Enter holiday name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-lg"
                  >
                    <option value="company" className="bg-gray-800 text-gray-300">Company</option>
                    <option value="national" className="bg-gray-800 text-gray-300">National</option>
                    <option value="regional" className="bg-gray-800 text-gray-300">Regional</option>
                    <option value="weekly" className="bg-gray-800 text-gray-300">Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-lg"
                    placeholder="Optional description"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Recurring Holiday</span>
                </label>
                
                {formData.isRecurring && (
                  <select
                    value={formData.recurringType}
                    onChange={(e) => setFormData({ ...formData, recurringType: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Type</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                )}
              </div>

              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    editingHoliday ? 'Update Holiday' : 'Add Holiday'
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={resetForm}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Holidays List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 mr-4 shadow-lg">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            Holidays for {selectedYear} 
            <span className="ml-3 px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
              {holidays.length} total
            </span>
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : holidays.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 max-w-md mx-auto">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-4">No holidays found for {selectedYear}</p>
                <p className="text-gray-400 text-sm">Click "Initialize Defaults" to add common holidays.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Recurring
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {holidays.map((holiday, index) => (
                    <motion.tr 
                      key={holiday._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {holiday.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(holiday.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={holiday.type} type="holiday" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {holiday.description || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {holiday.isRecurring ? (
                          <span className="text-green-400 flex items-center">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Yes ({holiday.recurringType})
                          </span>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(holiday)}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors duration-200"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(holiday._id)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-200"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
          </div>
        </div>
      </ProfessionalDashboard>
    </FuturisticBackground>
  );
};

export default HolidayManagement;