import axios from 'axios';
import { API_BASE_URL, API_PORT } from '../config/api';

// Construct the full API URL with the base URL and port
const API_URL = `${API_BASE_URL}:${API_PORT}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token interceptor
api.interceptors.request.use((config) => {
  // For master dashboard, use masterToken
  const token = localStorage.getItem('masterToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  getActivities: () => api.get('/dashboard/activities'),
  getAttendance: () => api.get('/dashboard/attendance'),
  getUserLocations: () => api.get('/dashboard/user-locations')
};

export const userApi = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data)
};

export const adminApi = {
  // Get all admins
  getAllAdmins: () => api.get('/master/admins'),
  
  // Get a single admin
  getAdmin: (id) => api.get(`/master/admins/${id}`),
  
  // Create a new admin
  createAdmin: (adminData) => api.post('/master/admins', adminData),
  
  // Update an admin
  updateAdmin: (id, adminData) => api.put(`/master/admins/${id}`, adminData),
  
  // Delete an admin
  deleteAdmin: (id) => api.delete(`/master/admins/${id}`)
};

export const alertApi = {
  // Get all alerts
  getAllAlerts: () => api.get('/alerts'),
  
  // Get alerts by route
  getAlertsByRoute: (routeNumber) => api.get(`/alerts/route/${routeNumber}`),
  
  // Get a single alert
  getAlert: (id) => api.get(`/alerts/${id}`),
  
  // Create a new alert
  createAlert: (alertData) => api.post('/alerts', alertData),
  
  // Update an alert
  updateAlert: (id, alertData) => api.put(`/alerts/${id}`, alertData),
  
  // Delete an alert
  deleteAlert: (id) => api.delete(`/alerts/${id}`)
};