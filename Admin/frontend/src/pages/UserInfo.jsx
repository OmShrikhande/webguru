import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const UserInfo = () => {
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Fetch user info by userId (structure only)
    setUserInfo({
      name: 'John Doe',
      email: 'john@example.com',
      loginTime: '2024-05-28 09:00',
      logoutTime: '2024-05-28 17:00',
      location: 'New Delhi, India',
    });
  }, [userId]);

  if (!userInfo) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-lg transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">User Info</h2>
        <div className="space-y-2">
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-200">Name:</span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">{userInfo.name}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-200">Email:</span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">{userInfo.email}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-200">Login Time:</span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">{userInfo.loginTime}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-200">Logout Time:</span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">{userInfo.logoutTime}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-200">Location:</span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">{userInfo.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;