const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String },
  mimetype: { type: String },
  size: { type: Number },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileType: { type: String },
  path: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', FileSchema);
