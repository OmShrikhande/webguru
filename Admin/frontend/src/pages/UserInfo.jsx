import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserInfo = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setUserInfo(data.user);
        } else {
          console.error('User not found');
        }
      } catch (err) {
        console.error('Failed to fetch user info', err);
      }
    };

    fetchUser();
  }, [userId]);

  if (!userInfo) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-3xl transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700 dark:text-indigo-300">User Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-100">
          <InfoItem label="Name" value={userInfo.name} />
          <InfoItem label="Email" value={userInfo.email} />
          <InfoItem label="Mobile" value={userInfo.mobile} />
          <InfoItem label="Address" value={userInfo.address} />
          <InfoItem label="Joining Date" value={userInfo.joiningDate} />
          <InfoItem label="Department" value={userInfo.department} />
          <InfoItem label="Adhar Number" value={userInfo.adhar} />
          <InfoItem label="PAN Number" value={userInfo.pan} />
          <InfoItem label="Password (hashed)" value={userInfo.password} />

          <InfoItem label="Status" value={userInfo.is_active ? 'Active' : 'Inactive'} />
        </div>

        <div className="mt-8">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper component to format each data field
const InfoItem = ({ label, value }) => (
  <div>
    <span className="font-semibold">{label}:</span>
    <span className="ml-2">{value || 'N/A'}</span>
  </div>
);

export default UserInfo;
