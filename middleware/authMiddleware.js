const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // Attach minimal user info
    req.user = { id: payload.id };
    // If you want the full user from DB, uncomment below
    // req.userDoc = await User.findById(payload.id).select('-password');
    next();
  } catch (err) {
    console.error('JWT error', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { requireAuth };
