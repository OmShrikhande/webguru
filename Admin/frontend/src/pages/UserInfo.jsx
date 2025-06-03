import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiMail, FiPhone, FiMapPin, FiCalendar, FiUserCheck, FiLock, FiUserX
} from 'react-icons/fi';
import { MdBadge, MdFingerprint } from 'react-icons/md';
import { AiOutlineRollback, AiOutlineReload } from 'react-icons/ai';
import UserMap from '../components/userInfo/UserMap';
import AnimatedBackground from '../components/userInfo/AnimatedBackground';
import FuturisticBackground from '../components/backgrounds/FuturisticBackground';
import FuturisticText from '../components/ui/FuturisticText';
import ProfessionalDashboard from '../components/dashboard/ProfessionalDashboard';

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
  'https://cdn-icons-png.flaticon.com/512/616/616409.png',
  'https://cdn-icons-png.flaticon.com/512/616/616431.png',
  'https://cdn-icons-png.flaticon.com/512/616/616432.png',
  'https://cdn-icons-png.flaticon.com/512/616/616433.png',
  'https://cdn-icons-png.flaticon.com/512/616/616434.png',
  'https://cdn-icons-png.flaticon.com/512/616/616435.png',
  'https://cdn-icons-png.flaticon.com/512/616/616436.png',
  'https://cdn-icons-png.flaticon.com/512/616/616437.png',
  'https://cdn-icons-png.flaticon.com/512/616/616438.png',
];

const UserInfo = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [location, setLocation] = useState(null);
  const [visitLocations, setVisitLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newLatitude, setNewLatitude] = useState('');
  const [newLongitude, setNewLongitude] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [sendNotification, setSendNotification] = useState(true);
  const [locationMessage, setLocationMessage] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

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

  // Function to fetch visit locations
  const fetchVisitLocations = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/visit-locations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      console.log('Visit locations API response:', data);
      if (data.success) {
        setVisitLocations(data.locations || []);
      } else {
        console.error('Failed to fetch visit locations:', data.message);
        setVisitLocations([]);
      }
    } catch (err) {
      console.error('Error fetching visit locations:', err);
      setVisitLocations([]);
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
      await Promise.all([fetchUser(), fetchLocation(), fetchVisitLocations()]);
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  const handleResetPassword = () => {
    setShowResetModal(true);
  };
  const handleResetSubmit = async () => {
    setResetError('');
    setResetSuccess('');
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users/${userInfo._id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setResetSuccess('Password reset successfully!');
        setShowResetModal(false);
      } else {
        setResetError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setResetError('Server error');
    }
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
      
      if (!newAddress.trim()) {
        setLocationMessage('Please enter a valid address');
        return;
      }
      
      console.log('Sending location data to backend:', { 
        latitude, 
        longitude, 
        address: newAddress,
        sendNotification
      });
      
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/visit-locations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          latitude, 
          longitude, 
          address: newAddress,
          sendNotification
        })
      });
      
      const text = await res.text();
      console.log('Location add API raw response:', text);
      const data = JSON.parse(text);
      console.log('Location add API parsed data:', data);
      
      if (data.success) {
        setLocationMessage('Location for user visit added successfully! ' + 
          (sendNotification ? 'Notification sent to user.' : ''));
        setNewLatitude('');
        setNewLongitude('');
        setNewAddress('');
        
        // Refresh the visit locations list
        fetchVisitLocations();
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
      <FuturisticBackground variant="users">
        <ProfessionalDashboard>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-pulse text-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-48 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-64 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mx-auto"></div>
            </div>
          </div>
        </ProfessionalDashboard>
      </FuturisticBackground>
    );
  }

  if (error) {
    return (
      <FuturisticBackground variant="users">
        <ProfessionalDashboard>
          <div className="text-red-500 text-center min-h-screen flex items-center justify-center">
            <FuturisticText variant="error">{error}</FuturisticText>
          </div>
        </ProfessionalDashboard>
      </FuturisticBackground>
    );
  }

  const avatarUrl = getRandomAvatar();

  return (
    <FuturisticBackground variant="users">
      <ProfessionalDashboard>
        <div className="min-h-screen w-full flex flex-col items-center px-4 py-10 transition-all duration-700">
          <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
            {/* Sidebar Profile Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 flex flex-col items-center md:w-1/3 border border-indigo-100 dark:border-gray-800">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-indigo-500 mb-4"
              />
              <FuturisticText size="2xl" variant="primary" className="font-bold text-center mb-1">
                {userInfo.name}
              </FuturisticText>
              <FuturisticText variant="accent" className="mb-4">{userInfo.email}</FuturisticText>
              <div className="w-full flex flex-col gap-3 mt-2">
                <InfoItem icon={<FiPhone />} label="Mobile" value={userInfo.mobile} />
                <InfoItem icon={<FiMapPin />} label="Address" value={userInfo.address} />
                <InfoItem icon={<FiCalendar />} label="Joining Date" value={new Date(userInfo.joiningDate).toLocaleDateString()} />
                <InfoItem icon={<MdBadge />} label="Department" value={userInfo.department} />
                <InfoItem icon={<MdFingerprint />} label="Aadhar" value={userInfo.adhar} />
                <InfoItem icon={<MdFingerprint />} label="PAN" value={userInfo.pan} />
                <InfoItem icon={<FiLock />} label="Password" value={maskPassword(userInfo.password)} />
                <InfoItem
                  icon={userInfo.is_active ? <FiUserCheck /> : <FiUserX />}
                  label="Status"
                  value={userInfo.is_active ? '🟢 Active' : '🔴 Inactive'}
                />
              </div>
              <div className="flex flex-col gap-3 mt-8 w-full">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow transition-all flex items-center justify-center gap-2"
                >
                  <AiOutlineRollback /> Back to Dashboard
                </button>
                <button
                  onClick={handleResetPassword}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg shadow transition-all flex items-center justify-center gap-2"
                >
                  <AiOutlineReload /> Reset Password
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-8">
              {/* User Location Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-indigo-100 dark:border-gray-800">
                <FuturisticText size="xl" variant="primary" className="font-bold mb-4">User Location</FuturisticText>
                <div className="rounded-xl overflow-hidden border border-indigo-200 dark:border-indigo-700 shadow" style={{ height: 320, width: "100%" }}>
                  {location ? (
                    <UserMap
                      latitude={location.latitude}
                      longitude={location.longitude}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      No location data available
                    </div>
                  )}
                </div>
                {/* Add Location Form */}
                <div className="mt-6 p-5 bg-indigo-50 dark:bg-gray-800 rounded-xl border border-indigo-100 dark:border-gray-700">
                  <FuturisticText size="lg" variant="primary" className="font-semibold mb-3">Add Location for User to Visit</FuturisticText>
                  <form onSubmit={handleAddLocation} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                      <input
                        type="text"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        placeholder="e.g. 123 Main St, New York, NY 10001"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
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
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sendNotification"
                        checked={sendNotification}
                        onChange={(e) => setSendNotification(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="sendNotification" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Send notification to user
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
                    >
                      Add Location for User to Visit
                    </button>
                  </form>
                  {locationMessage && (
                    <div className={`mt-3 p-3 rounded-md ${locationMessage.includes('success') ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}`}>
                      {locationMessage}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={async () => {
                      const token = localStorage.getItem('token');
                      try {
                        const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/all-locations`, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        const data = await res.json();
                        if (data.success && data.locations && data.locations.length > 0) {
                          const latestLocation = data.locations[0];
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
                        setLocationMessage('Error fetching locations');
                      }
                    }}
                    className="mt-3 w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
                  >
                    Debug: Load Latest Location
                  </button>
                </div>
              </div>

              {/* Locations to Visit */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-indigo-100 dark:border-gray-800">
                <FuturisticText size="xl" variant="primary" className="font-bold mb-4">Locations to Visit</FuturisticText>
                {visitLocations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Address</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date Added</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {visitLocations.map((loc) => (
                          <tr key={loc.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{loc.address}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${loc.visitStatus === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                                  loc.visitStatus === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' : 
                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'}`}>
                                {loc.visitStatus.charAt(0).toUpperCase() + loc.visitStatus.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {new Date(loc.createdAt).toLocaleDateString()} {new Date(loc.createdAt).toLocaleTimeString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No locations to visit have been assigned yet.
                  </div>
                )}
              </div>

              {/* Attendance Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-indigo-100 dark:border-gray-800">
                <FuturisticText size="xl" variant="primary" className="font-bold mb-4">Attendance</FuturisticText>
                {/* <UserAttenednce attendance={attendance} loading={attendanceLoading} /> */}
              </div>
            </div>
          </div>
        </div>
      </ProfessionalDashboard>
      {showResetModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Reset Password for {userInfo.name}
            </h3>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white mb-3"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white mb-4"
            />
            {resetError && <div className="text-red-500 text-sm mb-4">{resetError}</div>}
            {resetSuccess && <div className="text-green-500 text-sm mb-4">{resetSuccess}</div>}
            <div className="flex justify-end gap-2">
              <button
                onClick={handleResetSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
              >
                Submit
              </button>
              <button
                onClick={() => setShowResetModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </FuturisticBackground>
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