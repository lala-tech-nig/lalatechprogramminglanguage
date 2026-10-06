const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['idea', 'bug', 'feature'],
    required: true
  },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, maxlength: 3000 },
  author: { type: String, default: 'Anonymous', trim: true, maxlength: 60 },
  screenshotUrl: { type: String },
  visibility: {
    type: String,
    enum: ['public', 'admin'],
    default: 'public'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'declined'],
    default: 'open'
  },
  upvotes: { type: Number, default: 0 },
  dialect: {
    type: String,
    enum: ['english', 'yoruba', 'hausa', 'igbo', 'any'],
    default: 'any'
  },
  version: { type: String, default: 'v1.0.0' },
  adminNotes: { type: String, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CommunityPost', communityPostSchema);
