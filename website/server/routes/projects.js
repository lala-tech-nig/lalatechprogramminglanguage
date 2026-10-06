const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/projects');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `project_${uuidv4()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  cb(null, allowed.includes(file.mimetype));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// GET all projects
router.get('/', async (req, res) => {
  try {
    const { dialect, sort = 'newest', page = 1, limit = 12 } = req.query;
    const query = {};
    if (dialect && dialect !== 'all') query.dialect = dialect;

    const sortObj = sort === 'popular' ? { likes: -1 } : { createdAt: -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [projects, total] = await Promise.all([
      Project.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)),
      Project.countDocuments(query)
    ]);

    res.json({ success: true, projects, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create project
router.post('/', upload.single('screenshot'), async (req, res) => {
  try {
    const { title, description, author, githubUrl, liveUrl, dialect, tags } = req.body;
    
    if (!title || !description || !author) {
      return res.status(400).json({ success: false, message: 'Title, description, and author are required.' });
    }

    const screenshotUrl = req.file ? `/uploads/projects/${req.file.filename}` : null;
    const parsedTags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean)) : [];

    const project = new Project({
      title, description, author, githubUrl, liveUrl,
      dialect: dialect || 'english',
      tags: parsedTags,
      screenshotUrl
    });

    await project.save();
    res.status(201).json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST like a project
router.post('/:id/like', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, likes: project.likes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE project (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { adminPassword } = req.body;
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
