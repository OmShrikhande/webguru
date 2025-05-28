import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiMail, FiPhone, FiMapPin, FiCalendar, FiUserCheck, FiLock, FiUserX
} from 'react-icons/fi';
import { MdBadge, MdFingerprint } from 'react-icons/md';
import { AiOutlineRollback, AiOutlineReload } from 'react-icons/ai';
import UserMap from '../components/userInfo/UserMap';



const defaultAnimalAvatars = [
  'https://cdn-icons-png.flaticon.com/512/616/616408.png', // panda
  'https://cdn-icons-png.flaticon.com/512/616/616430.png', // lion
  'https://cdn-icons-png.flaticon.com/512/616/616408.png', // fox
  'https://cdn-icons-png.flaticon.com/512/616/616418.png', // bear
  'https://cdn-icons-png.flaticon.com/512/616/616426.png', // rabbit
  'https://cdn-icons-png.flaticon.com/512/616/616410.png', // elephant
  'https://cdn-icons-png.flaticon.com/512/616/616421.png', // tiger
  'https://cdn-icons-png.flaticon.com/512/616/616423.png', // giraffe
  'https://cdn-icons-png.flaticon.com/512/616/616425.png', // koala
  'https://cdn-icons-png.flaticon.com/512/616/616429.png', // monkey
  'https://cdn-icons-png.flaticon.com/512/616/616419.png', // zebra
  'https://cdn-icons-png.flaticon.com/512/616/616427.png', // penguin
  'https://cdn-icons-png.flaticon.com/512/616/616420.png', // dolphin
  'https://cdn-icons-png.flaticon.com/512/616/616417.png', // whale
  'https://cdn-icons-png.flaticon.com/512/616/616424.png', // owl
  'https://cdn-icons-png.flaticon.com/512/616/616416.png', // hedgehog
  'https://cdn-icons-png.flaticon.com/512/616/616422.png', // squirrel
  'https://cdn-icons-png.flaticon.com/512/616/616428.png', // raccoon
  'https://cdn-icons-png.flaticon.com/512/616/616411.png', // turtle
  'https://cdn-icons-png.flaticon.com/512/616/616412.png', // crab
  'https://cdn-icons-png.flaticon.com/512/616/616413.png', // octopus
  'https://cdn-icons-png.flaticon.com/512/616/616414.png', // fish
  'https://cdn-icons-png.flaticon.com/512/616/616415.png', // parrot
];

const UserInfo = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

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
          console.error('User not found');
        }
      } catch (err) {
        console.error('Failed to fetch user info', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleResetPassword = () => {
    alert('Reset password link has been sent to the user’s email.');
  };

  const getRandomAvatar = () => {
    const idx = Math.floor(Math.random() * defaultAnimalAvatars.length);
    return defaultAnimalAvatars[idx];
  };

  // Helper to mask password as requested
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

  const avatarUrl =  getRandomAvatar();

  return (
    <>
    <div className="min-h-screen w-full flex flex-col items-center px-4 py-10 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-700">
      {/* Upper Section: Avatar/Name (Left) and Details (Right) */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 w-full max-w-5xl mb-8">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Left: Avatar and Name */}
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
          {/* Right: User Details */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoItem icon={<FiPhone />} label="Mobile" value={userInfo.mobile} />
            <InfoItem icon={<FiMapPin />} label="Address" value={userInfo.address} />
            <InfoItem icon={<FiCalendar />} label="Joining Date" value={userInfo.joiningDate} />
            <InfoItem icon={<MdBadge />} label="Department" value={userInfo.department} />
            <InfoItem icon={<MdFingerprint />} label="Aadhar Number" value={userInfo.adhar} />
            <InfoItem icon={<MdFingerprint />} label="PAN Number" value={userInfo.pan} />
            <InfoItem icon={<FiLock />} label="Password (hashed)" value={maskPassword(userInfo.password)} />
            <InfoItem
              icon={userInfo.is_active ? <FiUserCheck /> : <FiUserX />}
              label="Status"
              value={userInfo.is_active ? '🟢 Active' : '🔴 Inactive'}
            />
          </div>
        </div>
        {/* Action Buttons */}
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
      {/* Map Section */}
      <div className="w-full max-w-5xl">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">User Location</h3>
          <div className="rounded-2xl overflow-hidden border-2 border-indigo-200 dark:border-indigo-700 shadow-lg" style={{ height: 400, width: "100%" }}>
            <UserMap latitude={21.15806554667964} longitude={79.10086557313238} />
          </div>
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
