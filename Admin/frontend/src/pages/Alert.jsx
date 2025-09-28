import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfessionalDashboard from '../components/dashboard/ProfessionalDashboard';
import FuturisticBackground from '../components/backgrounds/FuturisticBackground';

const Alert = () => {
  const [authorized, setAuthorized] = useState(true);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [recipients, setRecipients] = useState('department');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [sendToActiveOnly, setSendToActiveOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    setAuthorized(true);
    fetchDepartments(token);
  }, [navigate]);

  const fetchDepartments = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const users = response.data.users || [];
      const uniqueDepartments = [...new Set(users.map((user) => user.department).filter(Boolean))];
      setDepartments(uniqueDepartments);

      if (recipients === 'department' && uniqueDepartments.length === 1) {
        setDepartment(uniqueDepartments[0]);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError('Failed to fetch departments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message) {
      setError('Message is required');
      return;
    }

    if (recipients === 'department' && !department) {
      setError('Department is required when sending to a department');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:5000/api/alerts',
        {
          title,
          message,
          recipients,
          department: recipients === 'department' ? department : undefined,
          sendToActiveOnly
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess('Alert sent successfully!');
      setTitle('');
      setMessage('');
      setDepartment('');
      setRecipients('department');
      setSendToActiveOnly(false);
    } catch (err) {
      console.error('Error sending alert:', err);
      setError(err.response?.data?.message || 'Error sending alert. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) return null;

  return (
    <FuturisticBackground>
      <ProfessionalDashboard>
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="text-2xl mr-2">🔔</span>
              Send Alert
            </h2>
            <p className="text-gray-600">
              Broadcast alerts to departments or everyone across the organization.
            </p>
          </div>

          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-800 border border-green-200">
              <div className="flex items-center">
                <span className="text-xl mr-2">✅</span>
                <span>{success}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200">
              <div className="flex items-center">
                <span className="text-xl mr-2">❌</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="bg-white/50 backdrop-blur rounded-xl p-6 shadow-lg border border-white/30">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Recipients</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="recipients"
                        value="department"
                        checked={recipients === 'department'}
                        onChange={() => setRecipients('department')}
                      />
                      <span>Specific department</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="recipients"
                        value="all"
                        checked={recipients === 'all'}
                        onChange={() => setRecipients('all')}
                      />
                      <span>All members</span>
                    </label>
                  </div>
                </div>

                {recipients === 'department' && (
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select a department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Title (optional)</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Urgent update"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your alert message here..."
                    required
                  ></textarea>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="activeOnly"
                    checked={sendToActiveOnly}
                    onChange={(e) => setSendToActiveOnly(e.target.checked)}
                  />
                  <label htmlFor="activeOnly" className="text-sm text-gray-700">
                    Send only to active users
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Sending...' : 'Send Alert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </ProfessionalDashboard>
    </FuturisticBackground>
  );
};

export default Alert;