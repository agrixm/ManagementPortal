const express = require('express');
const { echoCookies } = require('../controllers/debug.controller');

const router = express.Router();

// Protected debug endpoint: requires header 'x-debug-key' to match env DEBUG_KEY
router.get('/cookies', (req, res) => {
  const expected = process.env.DEBUG_KEY || '';
  const provided = req.get('x-debug-key') || '';
  if (!expected || provided !== expected) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  return echoCookies(req, res);
});

module.exports = router;
