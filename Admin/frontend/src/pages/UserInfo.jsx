import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiMail, FiPhone, FiMapPin, FiCalendar, FiUserCheck, FiLock, FiUserX
} from 'react-icons/fi';
import { MdBadge, MdFingerprint } from 'react-icons/md';
import { AiOutlineRollback, AiOutlineReload } from 'react-icons/ai';
import UserMap from '../components/userInfo/UserMap';
import AnimatedBackground from '../components/userInfo/AnimatedBackground';
import UserLocationSection from '../components/userInfo/UserLocationSection';

const defaultAnimalAvatars = [
  'https://cdn-icons-png.flaticon.com/512/616/616408.png',
  'https://cdn-icons-png.flaticon.com/512/616/616430.png',
  'https://cdn-icons-png.flaticon.com/512/616/616418.png',
  'https://cdn-icons-png.flaticon.com/512/616/616426.png',
  'https://cdn-icons-png.flaticon.com/512/616/616410.png',
  'https://cdn-icons-png.flaticon.com/512/616/616421.png',
  'https://cdn-icons-png.flaticon.com/512/616/616423.png',
  'https://cdn-icons-png.flaticon.com/512/616/616425.png',
  'https://cdn-icons-png.flaticon.com/512/616/616429.png',
  'https://cdn-icons-png.flaticon.com/512/616/616419.png',
  'https://cdn-icons-png.flaticon.com/512/616/616427.png',
  'https://cdn-icons-png.flaticon.com/512/616/616420.png',
  'https://cdn-icons-png.flaticon.com/512/616/616417.png',
  'https://cdn-icons-png.flaticon.com/512/616/616424.png',
  'https://cdn-icons-png.flaticon.com/512/616/616416.png',
  'https://cdn-icons-png.flaticon.com/512/616/616422.png',
  'https://cdn-icons-png.flaticon.com/512/616/616428.png',
  'https://cdn-icons-png.flaticon.com/512/616/616411.png',
  'https://cdn-icons-png.flaticon.com/512/616/616412.png',
  'https://cdn-icons-png.flaticon.com/512/616/616413.png',
  'https://cdn-icons-png.flaticon.com/512/616/616414.png',
  'https://cdn-icons-png.flaticon.com/512/616/616415.png',
];

const UserInfo = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newLatitude, setNewLatitude] = useState('');
  const [newLongitude, setNewLongitude] = useState('');
  const [locationMessage, setLocationMessage] = useState('');

  // Function to fetch location data - moved outside useEffect to be accessible from handleAddLocation
  const fetchLocation = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/locations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Location API status:', res.status);
      const text = await res.text();
      console.log('Location API raw response:', text);
      const data = JSON.parse(text);
      console.log('Location API parsed data:', data);
      if (data.success) {
        setLocation(data.location);
      } else {
        setLocation(null);
      }
    } catch (err) {
      console.error('Failed to fetch user location:', err);
      setLocation(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setUserInfo(data.user);
        } else {
          setError('User not found');
        }
      } catch (err) {
        console.error('Failed to fetch user info', err);
        setError('Failed to load user information. Please try again.');
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchUser(), fetchLocation()]);
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  const handleResetPassword = () => {
    alert('Reset password link has been sent to the user’s email.');
  };
  const handleAddLocation = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const latitude = parseFloat(newLatitude);
      const longitude = parseFloat(newLongitude);
      
      if (isNaN(latitude) || isNaN(longitude)) {
        setLocationMessage('Please enter valid numbers for latitude and longitude');
        return;
      }
      
      console.log('Sending location data to backend:', { latitude, longitude });
      
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/locations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ latitude, longitude })
      });
      
      const text = await res.text();
      console.log('Location add API raw response:', text);
      const data = JSON.parse(text);
      console.log('Location add API parsed data:', data);
      
      if (data.success) {
        setLocationMessage('Location added successfully!');
        setNewLatitude('');
        setNewLongitude('');
        // Refresh location data
        fetchLocation();
      } else {
        setLocationMessage(`Failed to add location: ${data.message}`);
      }
    } catch (err) {
      console.error('Error adding location:', err);
      setLocationMessage('An error occurred while adding location');
    }
  };

  const getRandomAvatar = () => {
    const idx = Math.floor(Math.random() * defaultAnimalAvatars.length);
    return defaultAnimalAvatars[idx];
  };

  const maskPassword = (password = '') => {
    if (!password) return '******';
    if (password.length <= 9) return password.padEnd(18, '*');
    return password.slice(0, 9) + '******';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-pulse text-center">
          <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-48 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-64 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center min-h-screen flex items-center justify-center">{error}</div>;
  }

  const avatarUrl = getRandomAvatar();

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen w-full flex flex-col items-center px-4 py-10 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-700">
        {/* Profile Card */}
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-5xl mb-10 border border-indigo-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Avatar & Name */}
            <div className="flex flex-col items-center md:w-1/3">
              <div className="relative group mb-4">
                <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-400 via-pink-400 to-indigo-600 blur-lg opacity-60 group-hover:opacity-90 transition"></span>
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-indigo-500 relative z-10"
                />
              </div>
              <h2 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-200 text-center mb-2 drop-shadow">
                {userInfo.name}
              </h2>
              <InfoItem icon={<FiMail />} label="Email" value={userInfo.email} />
            </div>
            {/* Info Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoItem icon={<FiPhone />} label="Mobile" value={userInfo.mobile} />
              <InfoItem icon={<FiMapPin />} label="Address" value={userInfo.address} />
              <InfoItem icon={<FiCalendar />} label="Joining Date" value={new Date(userInfo.joiningDate).toLocaleDateString()} />
              <InfoItem icon={<MdBadge />} label="Department" value={userInfo.department} />
              <InfoItem icon={<MdFingerprint />} label="Aadhar Number" value={userInfo.adhar} />
              <InfoItem icon={<MdFingerprint />} label="PAN Number" value={userInfo.pan} />
              <InfoItem icon={<FiLock />} label="Password (hashed)" value={maskPassword(userInfo.password)} />
              <InfoItem
                icon={userInfo.is_active ? <FiUserCheck /> : <FiUserX />}
                label="Status"
                value={userInfo.is_active ? '🟢 Active' : '🔴 Inactive'}
                className="text-gray-800 dark:text-gray-100 break-words"
              />
            </div>
          </div>
          <div className="border-t border-indigo-100 dark:border-gray-800 my-8"></div>
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <AiOutlineRollback /> Back to Dashboard
            </button>
            <button
              onClick={handleResetPassword}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <AiOutlineReload /> Reset Password
            </button>
          </div>
        </div>

        {/* User Location Section */}
        <div className="w-full max-w-5xl">
          <UserLocationSection userId={userId} />
        </div>

        {/* Attendance Section */}
        <div className="w-full max-w-5xl mt-8">
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-indigo-100 dark:border-gray-800">
            <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-200 mb-4">Attendance</h3>
            {/* <UserAttenednce attendance={attendance} loading={attendanceLoading} /> */}
          </div>
        </div>
      </div>
    </>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300">
    <div className="text-xl">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-base font-semibold text-gray-800 dark:text-gray-100 break-words">
        {value || 'N/A'}
      </p>
    </div>
  </div>
);

export default UserInfo;