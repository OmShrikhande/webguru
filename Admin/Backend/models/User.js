const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  mobile: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  joiningDate: { 
    type: Date, 
    required: true 
  },
  is_active: { 
    type: Boolean, 
    default: true 
  },
  department: { 
    type: String, 
    required: true 
  },
  adhar: { 
    type: String, 
    required: true 
  },
  pan: { 
    type: String, 
    required: true 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', UserSchema);