const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    recipients: {
      type: String,
      enum: ['department', 'all'],
      required: true
    },
    department: {
      type: String,
      default: null
    },
    sendToActiveOnly: {
      type: Boolean,
      default: false
    },
    targetUserIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    recipientsCount: {
      type: Number,
      default: 0
    },
    sentBy: {
      adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
      },
      name: {
        type: String,
        default: 'Admin'
      },
      role: {
        type: String,
        default: 'Admin'
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Alert', alertSchema);