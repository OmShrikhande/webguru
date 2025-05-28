import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import Login from './Login';  
import { useNavigate } from 'react-router-dom';
import UserData from '../components/dashboard/userdata';

const Dashboard = () => {
  const [authorized, setAuthorized] = useState(true); // security flag
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(true);
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

  // Run on mount
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     navigate('/'); // Not logged in
  //     return;
  //   }

  //   // Set authorized and fetch users
  //   setAuthorized(true);
  //   fetchUsers(token);
  // }, []);

  // Fetch all users
  const fetchUsers = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
      localStorage.removeItem('token'); // Logout user on failure
      navigate('/Login');
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
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
      setFormData({
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
      setShowForm(false);
      fetchUsers(token);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user');
      setLoading(false);
      console.error('Error adding user:', err);
    }
  };

  // 🔐 If not authorized, render nothing (or a loader)
  if (!authorized) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex justify-between items-center mb-6 px-8 pt-8">
        <h2 className="text-3xl font-bold text-indigo-800">Admin Dashboard</h2>
        <button
          onClick={() => navigate('/adduser')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-all duration-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Add User
        </button>
      </div>
      <div className="px-8 pb-8">
        <UserData />
      </div>
    </div>
  );
};

export default Dashboard;
