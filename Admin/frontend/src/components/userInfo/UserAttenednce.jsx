import { View, Text } from 'react-native'
import React from 'react'

const UserAttenednce = ({ attendance, loading }) => {
  if (loading) {
    return <div>Loading attendance...</div>;
  }
  if (!attendance || attendance.length === 0) {
    return <div>No attendance records found.</div>;
  }
  return (
    <table className="min-w-full text-left">
      <thead>
        <tr>
          <th className="py-2 px-4">Date</th>
          <th className="py-2 px-4">Status</th>
          {/* Add more columns if needed */}
        </tr>
      </thead>
      <tbody>
        {attendance.map((att, idx) => (
          <tr key={idx}>
            <td className="py-2 px-4">{att.date}</td>
            <td className="py-2 px-4">{att.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserAttenednce