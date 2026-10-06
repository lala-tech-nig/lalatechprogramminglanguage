const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 2000 },
  author: { type: String, required: true, trim: true, maxlength: 80 },
  githubUrl: { type: String, trim: true },
  liveUrl: { type: String, trim: true },
  dialect: {
    type: String,
    enum: ['english', 'yoruba', 'hausa', 'igbo', 'mixed'],
    default: 'english'
  },
  tags: [{ type: String, trim: true, maxlength: 30 }],
  screenshotUrl: { type: String },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
