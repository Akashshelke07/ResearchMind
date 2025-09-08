// server/src/models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  originalFilename: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'docx'],
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  extractedText: {
    type: String,
    required: true
  },
  wordCount: {
    type: Number,
    default: 0
  },
  pageCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  metadata: {
    author: String,
    subject: String,
    keywords: [String],
    language: {
      type: String,
      default: 'en'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  analysis: {
    lastAnalyzed: Date,
    grammarScore: Number,
    clarityScore: Number,
    originalityScore: Number,
    structureScore: Number,
    overallScore: Number,
    suggestions: [String],
    issues: [{
      type: String,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      description: String,
      location: String
    }]
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update timestamps
documentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate word count if extractedText is provided
  if (this.extractedText && this.isModified('extractedText')) {
    this.wordCount = this.extractedText.split(/\s+/).filter(word => word.length > 0).length;
  }
  
  next();
});

// Instance method to check if document can be analyzed again
documentSchema.methods.canAnalyze = function() {
  if (!this.analysis.lastAnalyzed) return true;
  
  const hoursSinceAnalysis = (Date.now() - this.analysis.lastAnalyzed) / (1000 * 60 * 60);
  return hoursSinceAnalysis >= 1; // Can analyze once per hour
};

// Static method to get user's document count
documentSchema.statics.getUserDocumentCount = function(userId) {
  return this.countDocuments({ user: userId });
};

// Index for faster queries
documentSchema.index({ user: 1, createdAt: -1 });
documentSchema.index({ status: 1 });
documentSchema.index({ 'metadata.uploadedAt': -1 });

module.exports = mongoose.model('Document', documentSchema);