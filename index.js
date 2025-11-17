require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const authRouter = require('./routes/auth');
const filesRouter = require('./routes/files');
const contentRouter = require('./routes/content');

const PORT = process.env.PORT || 4000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json());
app.use(`/uploads`, express.static(path.join(process.cwd(), UPLOAD_DIR)));

// Connect to MongoDB if URI provided, otherwise log and continue with in-memory fallback
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('MONGO_URI not set — running without MongoDB. Create .env and set MONGO_URI to enable persistence.');
}

app.use('/api/auth', authRouter);
app.use('/api/files', filesRouter);
app.use('/api/content', contentRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
