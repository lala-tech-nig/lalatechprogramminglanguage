const express = require('express');
const router = express.Router();
const IdeProject = require('../models/IdeProject');
const authMiddleware = require('../middleware/auth');

// All routes require auth
router.use(authMiddleware);

// GET /api/ide-projects — list user's projects
router.get('/', async (req, res) => {
  try {
    const projects = await IdeProject.find({ userId: req.user._id })
      .select('-files')
      .sort({ updatedAt: -1 });
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/ide-projects — create a new project
router.post('/', async (req, res) => {
  try {
    const { name, files } = req.body;
    const project = await IdeProject.create({
      userId: req.user._id,
      name: name || 'My Project',
      files: files || {},
      fileCount: files ? Object.keys(files).length : 0,
    });
    res.status(201).json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/ide-projects/:id — get one project (with files)
router.get('/:id', async (req, res) => {
  try {
    const project = await IdeProject.findOne({ _id: req.params.id, userId: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/ide-projects/:id — full save (upsert files)
router.put('/:id', async (req, res) => {
  try {
    const { name, files } = req.body;
    const update = { updatedAt: new Date() };
    if (name !== undefined) update.name = name;
    if (files !== undefined) { update.files = files; update.fileCount = Object.keys(files).length; }
    const project = await IdeProject.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: update },
      { new: true, select: '-files' }
    );
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/ide-projects/:id
router.delete('/:id', async (req, res) => {
  try {
    const project = await IdeProject.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
