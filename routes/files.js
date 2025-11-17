const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { requireAuth } = require('../middleware/authMiddleware');
const File = require('../models/File');

const router = express.Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const safe = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, safe);
  }
});

const upload = multer({ storage });

// POST /api/files/upload (protected)
router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    // infer fileType from mimetype
    const { originalname, filename, mimetype, size, path: fpath } = req.file;
    let fileType = 'document';
    if (mimetype.startsWith('image/')) fileType = 'image';
    else if (mimetype.startsWith('audio/')) fileType = 'music';
    else if (mimetype.startsWith('video/')) fileType = 'video';

    const fileDoc = new File({ filename, originalName: originalname, mimetype, size, path: `/uploads/${filename}`, uploader: req.user.id, fileType });
    await fileDoc.save();
    return res.json({ message: 'File uploaded', file: fileDoc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Upload failed' });
  }
});

// GET /api/files - list files (optionally ?type=image)
router.get('/', async (req, res) => {
  const { type } = req.query;
  const filter = {};
  if (type) filter.fileType = type;
  const docs = await File.find(filter).sort({ createdAt: -1 }).limit(200);
  res.json(docs);
});

module.exports = router;
