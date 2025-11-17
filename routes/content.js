const express = require('express');
const File = require('../models/File');

const router = express.Router();

// GET /api/content - all files
router.get('/', async (req, res) => {
  const files = await File.find().sort({ createdAt: -1 }).limit(500);
  res.json(files);
});

// GET /api/content/:type - files by type (images, music, videos, documents)
router.get('/:type', async (req, res) => {
  const param = req.params.type;
  let fileType = param;
  // allow plural forms like images -> image
  if (param.endsWith('s')) fileType = param.slice(0, -1);
  const files = await File.find({ fileType }).sort({ createdAt: -1 }).limit(500);
  res.json(files);
});

module.exports = router;
