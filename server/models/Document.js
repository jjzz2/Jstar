const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['DOC', 'FORM'],
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
  tags: [{
    type: String,
    trim: true
  }],
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['read', 'write', 'admin'],
      default: 'read'
    }
  }]
}, {
  timestamps: true
});

// 索引
documentSchema.index({ title: 'text', content: 'text' });
documentSchema.index({ type: 1, isTrashed: 1 });
documentSchema.index({ author: 1 });
documentSchema.index({ lastUpdated: -1 });

module.exports = mongoose.model('Document', documentSchema);

