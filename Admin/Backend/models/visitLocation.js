const mongoose = require('mongoose');

const VisitLocationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    }
  },
  address: {
    type: String,
    required: true,
  },
  visitStatus: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  visitDate: {
    type: Date,
    default: null
  },
  notificationSent: {
    type: Boolean,
    default: false
  },
  notificationTime: {
    type: Date,
    default: null
  },
  adminNotes: {
    type: String,
    default: ''
  },
  userFeedback: {
    type: String,
    default: ''
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

module.exports = mongoose.model('VisitLocation', VisitLocationSchema);