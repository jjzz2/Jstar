const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    required: true
  },
  isTrashed: {
    type: Boolean,
    default: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  responses: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    data: mongoose.Schema.Types.Mixed,
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  settings: {
    allowAnonymous: {
      type: Boolean,
      default: false
    },
    requireLogin: {
      type: Boolean,
      default: true
    },
    maxResponses: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// 索引
formSchema.index({ title: 'text', description: 'text' });
formSchema.index({ author: 1 });
formSchema.index({ isPublished: 1 });
formSchema.index({ lastUpdated: -1 });

module.exports = mongoose.model('Form', formSchema);

