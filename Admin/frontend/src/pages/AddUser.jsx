import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    joiningDate: '',
    is_active: true,
    department: '',
    adhar: '',
    pan: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/users', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('User added successfully');
      setLoading(false);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8 animate-fade-in transition-all duration-700">
        <h3 className="text-2xl font-bold mb-6 text-indigo-700 tracking-tight">Add New User</h3>
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 transition-all duration-300 animate-fade-in">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 transition-all duration-300 animate-fade-in">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="name">
                Name
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm text-gray-700"
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="email">
                Email
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm text-gray-700"
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="off"
                pattern="^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$"
                title="Please enter a valid email address."
              />
            </div>
            {/* Mobile */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="mobile">
                Mobile
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm text-gray-700"
                id="mobile"
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                autoComplete="off"
                pattern="^\d{10}$"
                maxLength={10}
                title="Mobile number must be exactly 10 digits."
              />
            </div>
            {/* Department */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="department">
                Department
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm text-gray-700"
                id="department"
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                autoComplete="off"
                pattern="^[A-Za-z ]{2,}$"
                title="Department should contain only letters and spaces."
              />
            </div>
            {/* Adhar */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="adhar">
                Adhar Number
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm text-gray-700"
                id="adhar"
                type="text"
                name="adhar"
                value={formData.adhar}
                onChange={handleChange}
                required
                autoComplete="off"
                pattern="^\d{16}$"
                maxLength={12}
                title="Adhar number must be exactly 16 digits."
              />
            </div>
            {/* PAN */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="pan">
                PAN Number
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm text-gray-700"
                id="pan"
                type="text"
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                required
                autoComplete="off"
                pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                title="PAN should be in format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)."
                style={{ textTransform: 'uppercase' }}
              />
            </div>
            {/* Joining Date */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="joiningDate">
                Joining Date
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm text-gray-700"
                id="joiningDate"
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                required
              />
            </div>
            {/* Address */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="address">
                Address
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm resize-none text-gray-700"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={2}
              />
            </div>
          </div>
          {/* Active Checkbox */}
          <div className="flex items-center mt-2">
            <input
              id="is_active"
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="mr-2 accent-indigo-600 transition-all duration-200"
            />
            <label className="text-gray-700 font-semibold" htmlFor="is_active">
              Active
            </label>
          </div>
          <div className="flex items-center justify-end mt-6">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-8 rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:bg-indigo-300 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Adding...
                </span>
              ) : (
                'Add User'
              )}
            </button>
          </div>
        </form>
      </div>
      {/* Fade-in animation */}
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.7s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
};

export default AddUser;