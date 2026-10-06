const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/community');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `community_${uuidv4()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  cb(null, allowed.includes(file.mimetype));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 8 * 1024 * 1024 } });

// GET community posts (public and/or admin)
router.get('/', async (req, res) => {
  try {
    const { type, status, sort = 'newest', page = 1, limit = 15, adminPassword } = req.query;
    const isAdmin = adminPassword === process.env.ADMIN_PASSWORD;

    const query = {};
    // Non-admins only see public posts
    if (!isAdmin) query.visibility = 'public';
    if (type && type !== 'all') query.type = type;
    if (status && status !== 'all') query.status = status;

    const sortObj = sort === 'popular' ? { upvotes: -1 } : { createdAt: -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [posts, total] = await Promise.all([
      CommunityPost.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)),
      CommunityPost.countDocuments(query)
    ]);

    res.json({ success: true, posts, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), isAdmin });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET stats
router.get('/stats', async (req, res) => {
  try {
    const [total, ideas, bugs, features, resolved] = await Promise.all([
      CommunityPost.countDocuments({ visibility: 'public' }),
      CommunityPost.countDocuments({ type: 'idea', visibility: 'public' }),
      CommunityPost.countDocuments({ type: 'bug', visibility: 'public' }),
      CommunityPost.countDocuments({ type: 'feature', visibility: 'public' }),
      CommunityPost.countDocuments({ status: 'resolved', visibility: 'public' })
    ]);
    res.json({ success: true, total, ideas, bugs, features, resolved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create community post
router.post('/', upload.single('screenshot'), async (req, res) => {
  try {
    const { type, title, description, author, visibility, dialect, version } = req.body;

    if (!type || !title || !description) {
      return res.status(400).json({ success: false, message: 'Type, title, and description are required.' });
    }

    const screenshotUrl = req.file ? `/uploads/community/${req.file.filename}` : null;

    const post = new CommunityPost({
      type, title, description,
      author: author || 'Anonymous',
      screenshotUrl,
      visibility: visibility || 'public',
      dialect: dialect || 'any',
      version: version || 'v1.0.0'
    });

    await post.save();
    res.status(201).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST upvote
router.post('/:id/upvote', async (req, res) => {
  try {
    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, upvotes: post.upvotes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH update post status (admin only)
router.patch('/:id/status', async (req, res) => {
  try {
    const { adminPassword, status, adminNotes } = req.body;
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    const update = {};
    if (status) update.status = status;
    if (adminNotes !== undefined) update.adminNotes = adminNotes;

    const post = await CommunityPost.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE post (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { adminPassword } = req.body;
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    const post = await CommunityPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
