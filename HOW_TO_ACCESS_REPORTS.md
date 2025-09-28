# 📊 How to Access Attendance Reports

## 🎯 **Quick Access Guide**

### **Method 1: Through Navigation Menu (Recommended)**
1. **Start the application:**
   ```bash
   # Backend
   cd webguru/Admin/Backend
   npm run dev

   # Frontend  
   cd webguru/Admin/frontend
   npm start
   ```

2. **Login to Admin Panel:**
   - Go to: `http://localhost:3000`
   - Login with your admin credentials

3. **Access Monthly Reports:**
   - Look for **"Monthly Reports"** 📊 in the left sidebar menu
   - Click on it to open the reports page

4. **Generate Report:**
   - Select a user from the dropdown
   - Choose month and year
   - Click "Generate Report"

### **Method 2: Direct URL Access**
- **Monthly Reports:** `http://localhost:3000/monthly-reports`
- **Holiday Management:** `http://localhost:3000/holiday-management`

### **Method 3: API Direct Access**
```bash
# Get monthly report for specific user
GET http://localhost:5000/api/reports/monthly/{userId}?year=2024&month=1

# Get all users monthly report
GET http://localhost:5000/api/reports/monthly-all?year=2024&month=1
```

## 📋 **What You'll See in the Reports**

### **Single User Report:**
```
┌─────────────────────────────────────────┐
│ John Doe - January 2024                 │
├─────────────────────────────────────────┤
│ 📊 Attendance Summary                   │
│ • Working Days: 22                      │
│ • Present Days: 20                      │
│ • Absent Days: 2                        │
│ • Attendance %: 90.9%                   │
├─────────────────────────────────────────┤
│ 🚗 Travel Summary                       │
│ • Total Visits: 15                      │
│ • Distance Traveled: 245.67 km          │
│ • Average per Visit: 18.9 km            │
├─────────────────────────────────────────┤
│ 📅 Daily Breakdown                      │
│ Date    | Day    | Status  | Hours      │
│ 01-Jan  | Mon    | Present | 8.5h       │
│ 02-Jan  | Tue    | Present | 8.0h       │
│ 03-Jan  | Wed    | Absent  | -          │
│ 07-Jan  | Sun    | Weekend | -          │
│ 15-Jan  | Mon    | Holiday | Republic Day│
└─────────────────────────────────────────┘
```

### **All Users Report:**
```
┌─────────────────────────────────────────┐
│ Organization Report - January 2024      │
├─────────────────────────────────────────┤
│ 📈 Overall Statistics                   │
│ • Total Users: 25                       │
│ • Average Attendance: 87.5%             │
│ • Total Distance: 2,450 km              │
│ • Total Visits: 180                     │
├─────────────────────────────────────────┤
│ 👥 Individual User Summary              │
│ User      | Dept  | Attend% | Distance  │
│ John Doe  | Sales | 90.9%   | 245.67km  │
│ Jane Smith| HR    | 95.5%   | 123.45km  │
│ ...                                     │
└─────────────────────────────────────────┘
```

## 🔧 **Setup Requirements**

### **Before First Use:**
1. **Initialize Holidays:**
   - Go to "Holiday Management" 🗓️ in the sidebar
   - Click "Initialize Defaults" button
   - This adds Sundays and national holidays

2. **Ensure Data Exists:**
   - Users should have attendance records
   - Users should have completed visits for distance tracking

### **If Reports Show No Data:**
1. **Check Date Range:** Ensure you're looking at the right month/year
2. **Verify User Data:** Make sure the selected user has attendance records
3. **Initialize Holidays:** Run holiday initialization if not done
4. **Check Backend:** Ensure backend server is running on port 5000

## 🎨 **Navigation Menu Location**

The reports are now available in your admin sidebar:

```
🏠 Dashboard
👥 Users  
➕ Add User
📅 Attendance
📊 Monthly Reports     ← NEW!
🗓️ Holiday Management  ← NEW!
🔔 Send Alert
📈 Analytics
📋 Reports
⚙️ Settings
```

## 🚀 **Quick Start Steps**

1. **Start servers** (backend + frontend)
2. **Login** to admin panel
3. **Click "Holiday Management"** → **"Initialize Defaults"**
4. **Click "Monthly Reports"** → **Select user** → **Generate Report**

## 📱 **Mobile Access**
The reports are responsive and work on mobile devices. Access the same URLs from your mobile browser.

## 🔍 **Troubleshooting**

### **"No data found" message:**
- Check if attendance records exist for the selected period
- Verify the user has completed visits for distance data
- Ensure holidays are initialized

### **Navigation menu not showing new items:**
- Refresh the page (Ctrl+F5)
- Clear browser cache
- Restart the frontend server

### **API errors:**
- Check backend server is running on port 5000
- Verify JWT token is valid (try logging out and back in)
- Check browser console for error messages

## 📞 **Need Help?**
- Check the console logs for error messages
- Verify all servers are running
- Test with sample data first
- Use the API documentation for direct testing

**Happy Reporting! 📊✨**