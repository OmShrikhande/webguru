
import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const handleAddUser = () => {
    // Add user functionality will be implemented here
    console.log('Add user button clicked');
    // You can add navigation to a user creation form or open a modal here
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome to Admin Dashboard</h2>
        <button 
          className="add-user-btn" 
          onClick={handleAddUser}
        >
          <span className="btn-icon">+</span>
          Add User
        </button>
      </div>
      <div className="dashboard-content">
        {/* Dashboard content goes here */}
      </div>
    </div>
  );
};

export default Dashboard;
