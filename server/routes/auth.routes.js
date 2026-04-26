const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middleware/auth.middleware');
const { register, login, googleLogin, refresh, logout, me } = require('../controllers/auth.controller');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').trim().isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 })
  ],
  register
);
router.post('/login', [body('email').trim().isEmail().normalizeEmail(), body('password').notEmpty()], login);
router.post('/google', [body('credential').notEmpty()], googleLogin);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', verifyToken, me);

module.exports = router;
