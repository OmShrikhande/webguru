// Test script for new Monthly Reports and Distance Tracking features
// Run this after starting the server to test the new functionality

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000/api';
let authToken = ''; // You'll need to get this from login

// Test data
const testUserId = ''; // Replace with actual user ID
const testVisitId = ''; // Replace with actual visit ID

// Helper function to make authenticated requests
const apiCall = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error in ${method} ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
};

// Test functions
const testHolidayManagement = async () => {
  console.log('\n=== Testing Holiday Management ===');
  
  try {
    // Initialize default holidays for current year
    console.log('1. Initializing default holidays...');
    const initResult = await apiCall('POST', '/holidays/initialize', { 
      year: new Date().getFullYear() 
    });
    console.log('✓ Default holidays initialized:', initResult.insertedCount, 'holidays added');
    
    // Create a custom holiday
    console.log('2. Creating custom holiday...');
    const customHoliday = await apiCall('POST', '/holidays', {
      name: 'Test Company Day',
      date: '2024-06-15',
      type: 'company',
      description: 'Test holiday for API verification'
    });
    console.log('✓ Custom holiday created:', customHoliday.holiday.name);
    
    // Get all holidays
    console.log('3. Fetching all holidays...');
    const holidays = await apiCall('GET', '/holidays?year=2024');
    console.log('✓ Total holidays found:', holidays.count);
    
  } catch (error) {
    console.error('✗ Holiday management test failed:', error.message);
  }
};

const testDistanceTracking = async () => {
  console.log('\n=== Testing Distance Tracking ===');
  
  if (!testVisitId) {
    console.log('⚠ Skipping distance tracking test - no visit ID provided');
    return;
  }
  
  try {
    // Start visit tracking
    console.log('1. Starting visit tracking...');
    const startResult = await apiCall('POST', `/visit-location/${testVisitId}/start`, {
      latitude: 28.6139,
      longitude: 77.2090
    });
    console.log('✓ Visit tracking started:', startResult.message);
    
    // Simulate user movement (this would normally happen via location updates)
    console.log('2. Simulating user movement...');
    // In real scenario, this happens automatically when user location is updated
    
    // Complete visit tracking
    console.log('3. Completing visit tracking...');
    const completeResult = await apiCall('POST', `/visit-location/${testVisitId}/complete`, {
      latitude: 28.6129,
      longitude: 77.2080
    });
    console.log('✓ Visit completed. Distance traveled:', completeResult.visit.distanceTraveled, 'km');
    
  } catch (error) {
    console.error('✗ Distance tracking test failed:', error.message);
  }
};

const testMonthlyReports = async () => {
  console.log('\n=== Testing Monthly Reports ===');
  
  if (!testUserId) {
    console.log('⚠ Skipping monthly reports test - no user ID provided');
    return;
  }
  
  try {
    // Generate single user report
    console.log('1. Generating single user monthly report...');
    const userReport = await apiCall('GET', `/reports/monthly/${testUserId}?year=2024&month=1`);
    console.log('✓ User report generated for:', userReport.report.user.name);
    console.log('  - Working days:', userReport.report.attendanceAnalysis.totalWorkingDays);
    console.log('  - Present days:', userReport.report.attendanceAnalysis.presentDays);
    console.log('  - Attendance %:', userReport.report.attendanceAnalysis.attendancePercentage.toFixed(1) + '%');
    console.log('  - Distance traveled:', userReport.report.visitSummary.totalDistanceTraveled, 'km');
    
    // Generate all users report
    console.log('2. Generating all users monthly report...');
    const allUsersReport = await apiCall('GET', '/reports/monthly-all?year=2024&month=1');
    console.log('✓ All users report generated');
    console.log('  - Total users:', allUsersReport.overallStats.totalUsers);
    console.log('  - Average attendance:', allUsersReport.overallStats.averageAttendance.toFixed(1) + '%');
    console.log('  - Total distance (all users):', allUsersReport.overallStats.totalDistanceTraveled.toFixed(1), 'km');
    
  } catch (error) {
    console.error('✗ Monthly reports test failed:', error.message);
  }
};

const testDistanceSummary = async () => {
  console.log('\n=== Testing Distance Summary ===');
  
  if (!testUserId) {
    console.log('⚠ Skipping distance summary test - no user ID provided');
    return;
  }
  
  try {
    const summary = await apiCall('GET', `/visit-location/user/${testUserId}/distance-summary?startDate=2024-01-01&endDate=2024-01-31`);
    console.log('✓ Distance summary generated');
    console.log('  - Total visits:', summary.summary.totalVisits);
    console.log('  - Total distance:', summary.summary.totalDistance, 'km');
    console.log('  - Average distance per visit:', summary.summary.averageDistance, 'km');
    
  } catch (error) {
    console.error('✗ Distance summary test failed:', error.message);
  }
};

// Main test function
const runTests = async () => {
  console.log('🚀 Starting API Tests for New Features');
  console.log('=====================================');
  
  if (!authToken) {
    console.log('⚠ Warning: No auth token provided. Please set authToken variable.');
    console.log('You can get the token by logging in through the frontend or API.');
    return;
  }
  
  try {
    await testHolidayManagement();
    await testDistanceTracking();
    await testMonthlyReports();
    await testDistanceSummary();
    
    console.log('\n✅ All tests completed!');
    console.log('\nNext steps:');
    console.log('1. Test the frontend components at:');
    console.log('   - http://localhost:3000/monthly-reports');
    console.log('   - http://localhost:3000/holiday-management');
    console.log('2. Create some test data (users, visits, attendance) to see full functionality');
    console.log('3. Check the API documentation in API_DOCUMENTATION.md');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
  }
};

// Instructions for running the test
console.log('📋 Test Setup Instructions:');
console.log('1. Start the backend server: npm run dev');
console.log('2. Get an auth token by logging in');
console.log('3. Update the variables at the top of this file:');
console.log('   - authToken: Your JWT token');
console.log('   - testUserId: A valid user ID from your database');
console.log('   - testVisitId: A valid visit location ID from your database');
console.log('4. Run this test: node test_new_features.js');
console.log('\nTo run tests now with current configuration:');

// Uncomment the line below and set the variables above to run the tests
// runTests();

module.exports = { runTests, testHolidayManagement, testDistanceTracking, testMonthlyReports };