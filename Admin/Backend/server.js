const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes.js');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes.js');
const attendanceRoutes = require('./routes/attendanceRoutes.js');
const visitLocationRoutes = require('./routes/visitLocation.js');
const masterRoutes = require('./routes/masterRoutes.js');

// Import models to ensure they're registered
require('./models/location');
require('./models/Attendance');
require('./models/Master');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Master routes
app.use('/api/master', masterRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);
app.use('/api/admin', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', attendanceRoutes);
app.use('/api', visitLocationRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));