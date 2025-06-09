const mongoose = require('mongoose');

// Defining the Master schema
const MasterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Removed required: true to allow temporary records
  username: { type: String, default: '' },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  zipCode: { type: String, default: '' },
  country: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  position: { type: String, default: 'Master Administrator' },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
  emergencyContact: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    relationship: { type: String, default: '' }
  },
  loginHistory: [{
    loginTime: { type: Date, default: Date.now },
    logoutTime: { type: Date },
    ipAddress: { type: String },
    userAgent: { type: String }
  }],
  otp: String,
  otpExpires: Date,
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Updating the updatedAt field before saving
MasterSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Master', MasterSchema);