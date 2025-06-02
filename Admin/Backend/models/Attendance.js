const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  checkIn: {
    time: {
      type: Date,
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    address: {
      type: String,
      default: ''
    }
  },
  checkOut: {
    time: {
      type: Date
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number] // [longitude, latitude]
      }
    },
    address: {
      type: String,
      default: ''
    }
  },
  totalHours: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half-day'],
    default: 'present'
  },
  notes: {
    type: String,
    default: ''
  },
  isManualEntry: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
AttendanceSchema.index({ userId: 1, date: 1 });
AttendanceSchema.index({ date: 1 });

// Calculate total hours before saving
AttendanceSchema.pre('save', function(next) {
  if (this.checkIn.time && this.checkOut.time) {
    const diffInMs = this.checkOut.time - this.checkIn.time;
    this.totalHours = Math.round((diffInMs / (1000 * 60 * 60)) * 100) / 100; // Round to 2 decimal places
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Attendance', AttendanceSchema);