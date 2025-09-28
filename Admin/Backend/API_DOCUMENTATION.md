# Monthly Reports & Distance Tracking API Documentation

## Overview
This document describes the new features added to the WebGuru system:
1. **Monthly Attendance Reports** - Generate detailed reports excluding weekends and holidays
2. **Distance Tracking** - Track user travel distance for assigned tasks

## New API Endpoints

### 1. Holiday Management

#### Get All Holidays
```
GET /api/holidays?year=2024&month=1&type=company
```

#### Create Holiday
```
POST /api/holidays
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Christmas Day",
  "date": "2024-12-25",
  "type": "national",
  "description": "National holiday",
  "isRecurring": true,
  "recurringType": "yearly"
}
```

#### Initialize Default Holidays
```
POST /api/holidays/initialize
Content-Type: application/json
Authorization: Bearer <token>

{
  "year": 2024
}
```

### 2. Monthly Reports

#### Generate Single User Monthly Report
```
GET /api/reports/monthly/{userId}?year=2024&month=1
Authorization: Bearer <token>
```

**Response includes:**
- Working days calculation (excluding Sundays and holidays)
- Present/absent days breakdown
- Attendance percentage
- Total distance traveled
- Daily attendance details
- Visit summary with distances

#### Generate All Users Monthly Report
```
GET /api/reports/monthly-all?year=2024&month=1
Authorization: Bearer <token>
```

**Response includes:**
- Overall statistics for all users
- Individual user summaries
- Total distance traveled by all users
- Average attendance across organization

### 3. Distance Tracking

#### Start Visit Tracking
```
POST /api/visit-location/{visitId}/start
Content-Type: application/json
Authorization: Bearer <token>

{
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

#### Complete Visit Tracking
```
POST /api/visit-location/{visitId}/complete
Content-Type: application/json
Authorization: Bearer <token>

{
  "latitude": 28.6129,
  "longitude": 77.2080
}
```

#### Get User Distance Summary
```
GET /api/visit-location/user/{userId}/distance-summary?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

#### Update Visit Distance (Manual)
```
PUT /api/reports/visit-distance/{visitId}
Content-Type: application/json
Authorization: Bearer <token>

{
  "startLocation": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "timestamp": "2024-01-15T09:00:00Z"
  },
  "endLocation": {
    "latitude": 28.6129,
    "longitude": 77.2080,
    "timestamp": "2024-01-15T17:00:00Z"
  },
  "routePoints": [
    {
      "latitude": 28.6139,
      "longitude": 77.2090,
      "timestamp": "2024-01-15T09:00:00Z"
    },
    {
      "latitude": 28.6134,
      "longitude": 77.2085,
      "timestamp": "2024-01-15T12:00:00Z"
    },
    {
      "latitude": 28.6129,
      "longitude": 77.2080,
      "timestamp": "2024-01-15T17:00:00Z"
    }
  ]
}
```

## Frontend Routes

### Admin Frontend
- `/monthly-reports` - Monthly reports page
- `/holiday-management` - Holiday management page

## How It Works

### 1. Monthly Report Generation

1. **Working Days Calculation:**
   - Gets all days in the specified month
   - Excludes Sundays (configurable)
   - Excludes holidays from the Holiday model
   - Calculates total working days

2. **Attendance Analysis:**
   - Counts present, absent, late, and half-day records
   - Calculates attendance percentage based on working days only
   - Provides daily breakdown with holiday information

3. **Distance Tracking:**
   - Sums up all completed visit distances for the month
   - Calculates average distance per visit
   - Provides detailed visit information

### 2. Distance Tracking System

1. **Automatic Tracking:**
   - When user location is updated via `/api/admin/users/{id}/location`
   - System automatically updates route points for active visits
   - Calculates cumulative distance using Haversine formula

2. **Manual Visit Control:**
   - Admin can start visit tracking when user begins a task
   - System records start location and initializes route tracking
   - User location updates automatically add route points
   - Admin completes visit tracking when task is finished
   - Final distance is calculated and stored

3. **Distance Calculation:**
   - Uses Haversine formula for accurate GPS distance calculation
   - Accounts for Earth's curvature
   - Results in kilometers with 2 decimal precision

## Database Schema Changes

### New Models:
1. **Holiday** - Stores holiday information
2. **VisitLocation** - Enhanced with distance tracking fields:
   - `distanceTraveled` - Total distance in km
   - `startLocation` - Visit start coordinates and timestamp
   - `endLocation` - Visit end coordinates and timestamp
   - `routePoints` - Array of GPS points during the visit

## Usage Examples

### 1. Setting Up Holidays
```javascript
// Initialize default holidays for 2024
await axios.post('/api/holidays/initialize', { year: 2024 });

// Add custom company holiday
await axios.post('/api/holidays', {
  name: "Company Foundation Day",
  date: "2024-03-15",
  type: "company",
  description: "Annual company celebration"
});
```

### 2. Generating Monthly Report
```javascript
// Get report for specific user
const report = await axios.get('/api/reports/monthly/USER_ID?year=2024&month=1');

console.log(`Attendance: ${report.data.report.attendanceAnalysis.attendancePercentage}%`);
console.log(`Distance Traveled: ${report.data.report.visitSummary.totalDistanceTraveled} km`);
```

### 3. Tracking Visit Distance
```javascript
// When user starts a visit
await axios.post('/api/visit-location/VISIT_ID/start', {
  latitude: 28.6139,
  longitude: 77.2090
});

// System automatically tracks route as user moves
// (via existing location update endpoint)

// When user completes visit
await axios.post('/api/visit-location/VISIT_ID/complete', {
  latitude: 28.6129,
  longitude: 77.2080
});
```

## Benefits

1. **Accurate Attendance Reporting:**
   - Excludes non-working days from calculations
   - Provides realistic attendance percentages
   - Easy holiday management

2. **Comprehensive Distance Tracking:**
   - Real-time route tracking
   - Accurate distance calculations
   - Monthly travel summaries for expense management

3. **Better Management Insights:**
   - Detailed monthly reports for each employee
   - Organization-wide statistics
   - Data-driven decision making

## Notes

- All distances are calculated in kilometers
- Attendance percentages are based on working days only
- Holiday management supports recurring holidays
- Distance tracking works automatically with existing location updates
- Reports can be generated for any month/year combination