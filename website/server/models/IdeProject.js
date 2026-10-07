const mongoose = require('mongoose');

const ideProjectSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name:      { type: String, required: true, trim: true, maxlength: 120, default: 'My Project' },
  files:     { type: mongoose.Schema.Types.Mixed, default: {} },  // { "filename": { content, lang, created, modified } }
  fileCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('IdeProject', ideProjectSchema);
