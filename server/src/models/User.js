// server/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  subscription: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  usage: {
    monthlyRequests: {
      type: Number,
      default: 0
    },
    lastResetDate: {
      type: Date,
      default: Date.now
    },
    documentsCount: {
      type: Number,
      default: 0
    },
    plagiarismChecks: {
      type: Number,
      default: 0
    },
    voiceMinutes: {
      type: Number,
      default: 0
    }
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      browser: {
        type: Boolean,
        default: true
      }
    }
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  verificationToken: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check if user can make more requests (free tier)
userSchema.methods.canMakeRequest = function() {
  if (this.subscription === 'premium') return true;
  
  const now = new Date();
  const lastReset = new Date(this.usage.lastResetDate);
  
  // Reset monthly counter if it's a new month
  if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
    this.usage.monthlyRequests = 0;
    this.usage.plagiarismChecks = 0;
    this.usage.voiceMinutes = 0;
    this.usage.lastResetDate = now;
  }
  
  return this.usage.monthlyRequests < (process.env.FREE_TIER_REQUESTS_PER_MONTH || 50);
};

// Method to increment usage
userSchema.methods.incrementUsage = function(type = 'request') {
  switch (type) {
    case 'request':
      this.usage.monthlyRequests += 1;
      break;
    case 'plagiarism':
      this.usage.plagiarismChecks += 1;
      break;
    case 'document':
      this.usage.documentsCount += 1;
      break;
    case 'voice':
      this.usage.voiceMinutes += 1;
      break;
  }
  return this.save();
};

module.exports = mongoose.model('User', userSchema);