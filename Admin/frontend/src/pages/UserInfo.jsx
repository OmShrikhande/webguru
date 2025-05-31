import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiMail, FiPhone, FiMapPin, FiCalendar, FiUserCheck, FiLock, FiUserX
} from 'react-icons/fi';
import { MdBadge, MdFingerprint } from 'react-icons/md';
import { AiOutlineRollback, AiOutlineReload } from 'react-icons/ai';
import UserMap from '../components/userInfo/UserMap';
import AnimatedBackground from '../components/userInfo/AnimatedBackground';

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
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 w-full max-w-5xl mb-8">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex flex-col items-center md:w-1/3">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-indigo-500 mb-4"
              />
              <h2 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 text-center mb-2">
                {userInfo.name}
              </h2>
              <InfoItem icon={<FiMail />} label="" value={userInfo.email} />
            </div>
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
        </div>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2"
          >
            <AiOutlineRollback /> Back to Dashboard
          </button>
          <button
            onClick={handleResetPassword}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2"
          >
            <AiOutlineReload /> Reset Password
          </button>
        </div>
      </div>
      <div className="w-full max-w-5xl">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">User Location</h3>
          <div className="rounded-2xl overflow-hidden border-2 border-indigo-200 dark:border-indigo-700 shadow-lg" style={{ height: 400, width: "100%" }}>
            {location ? (
              <>
                {console.log('Rendering map with location:', location)}
                <UserMap
                  latitude={location.latitude}
                  longitude={location.longitude}
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                No location data available
              </div>
            )}
          </div>
          
          {/* Add Location Form */}
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-gray-800 rounded-xl">
            <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-3">Add New Location</h4>
            <form onSubmit={handleAddLocation} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Latitude</label>
                  <input
                    type="text"
                    value={newLatitude}
                    onChange={(e) => setNewLatitude(e.target.value)}
                    placeholder="e.g. 40.7128"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Longitude</label>
                  <input
                    type="text"
                    value={newLongitude}
                    onChange={(e) => setNewLongitude(e.target.value)}
                    placeholder="e.g. -74.0060"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
              >
                Add Location
              </button>
            </form>
            {locationMessage && (
              <div className={`mt-3 p-3 rounded-md ${locationMessage.includes('success') ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}`}>
                {locationMessage}
              </div>
            )}
            
            {/* Debug button to test location fetching */}
            <button
              type="button"
              onClick={async () => {
                const token = localStorage.getItem('token');
                try {
                  const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/all-locations`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  const data = await res.json();
                  console.log('All locations:', data);
                  if (data.success && data.locations && data.locations.length > 0) {
                    const latestLocation = data.locations[0];
                    console.log('Latest location:', latestLocation);
                    setLocation({
                      latitude: latestLocation.location.latitude,
                      longitude: latestLocation.location.longitude,
                      timestamp: latestLocation.timestamp
                    });
                    setLocationMessage('Location loaded from database');
                  } else {
                    setLocationMessage('No locations found in database');
                  }
                } catch (err) {
                  console.error('Error fetching all locations:', err);
                  setLocationMessage('Error fetching locations');
                }
              }}
              className="mt-3 w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
            >
              Debug: Load Latest Location
            </button>
          </div>
        </div>
      </div>
      <div className="w-full max-w-5xl mt-8">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">Attendance</h3>
          {/* <UserAttenednce attendance={attendance} loading={attendanceLoading} /> */}
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