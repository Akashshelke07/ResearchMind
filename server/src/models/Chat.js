// server/src/models/Chat.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    tokens: Number,
    processingTime: Number,
    model: String
  }
});

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Conversation'
  },
  messages: [messageSchema],
  context: {
    documentId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Document'
    },
    paperType: {
      type: String,
      enum: ['research', 'review', 'thesis', 'conference', 'journal'],
      default: 'research'
    },
    subject: String,
    stage: {
      type: String,
      enum: ['planning', 'writing', 'editing', 'reviewing'],
      default: 'planning'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update last activity
chatSchema.pre('save', function(next) {
  this.lastActivity = Date.now();
  
  // Auto-generate title from first user message if not set
  if (this.title === 'New Conversation' && this.messages.length > 0) {
    const firstUserMessage = this.messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      this.title = firstUserMessage.content.substring(0, 50) + 
                   (firstUserMessage.content.length > 50 ? '...' : '');
    }
  }
  
  next();
});

// Instance method to add message
chatSchema.methods.addMessage = function(role, content, metadata = {}) {
  this.messages.push({
    role,
    content,
    metadata
  });
  this.lastActivity = Date.now();
  return this.save();
};

// Instance method to get recent context
chatSchema.methods.getRecentContext = function(limit = 10) {
  return this.messages
    .slice(-limit)
    .map(msg => `${msg.role}: ${msg.content}`)
    .join('\n\n');
};

// Static method to get user's active chats
chatSchema.statics.getActiveChats = function(userId) {
  return this.find({ 
    user: userId, 
    isActive: true 
  }).sort({ lastActivity: -1 });
};

// Index for better performance
chatSchema.index({ user: 1, lastActivity: -1 });
chatSchema.index({ isActive: 1 });

module.exports = mongoose.model('Chat', chatSchema);