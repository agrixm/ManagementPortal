const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { createAccessToken, createRefreshToken } = require('../utils/generateToken');
const { JWT_REFRESH_SECRET, NODE_ENV, GOOGLE_CLIENT_ID } = require('../config/env');

const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

function cookieOptions() {
  return {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}

async function issueSession(user, res) {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, cookieOptions());

  return {
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      availability: user.availability
    }
  };
}

async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!normalizedEmail) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hash,
    role: role || 'employee'
  });

  return res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
}

async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();
  console.log('Login attempt for:', normalizedEmail);
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) console.log('Login failed: user not found for', normalizedEmail);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const ok = await bcrypt.compare(password, user.password);
  console.log('Password compare result for', normalizedEmail, ok);
  if (!ok) {
    console.log('Login failed: incorrect password for', normalizedEmail);
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const payload = await issueSession(user, res);
  console.log('Login success for', normalizedEmail);
  return res.json(payload);
}

async function googleLogin(req, res) {
  const { credential } = req.body;

  if (!googleClient) {
    return res.status(500).json({ message: 'Google auth is not configured on server' });
  }

  if (!credential) {
    return res.status(400).json({ message: 'Missing Google credential' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID
    });

    const googlePayload = ticket.getPayload();
    if (!googlePayload?.email || !googlePayload?.email_verified) {
      return res.status(401).json({ message: 'Google account email not verified' });
    }

    const normalizedEmail = String(googlePayload.email).trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const randomPassword = crypto.randomBytes(24).toString('hex');
      const hash = await bcrypt.hash(randomPassword, 10);

      user = await User.create({
        name: googlePayload.name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        password: hash,
        avatar: googlePayload.picture || '',
        role: 'employee',
        availability: 'free'
      });
    }

    const payload = await issueSession(user, res);
    return res.json(payload);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Google credential' });
  }
}

async function refresh(req, res) {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: 'Missing refresh token' });
  }

  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET);
    const user = await User.findById(payload.sub);
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const accessToken = createAccessToken(user);
    return res.json({ accessToken });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
}

async function logout(req, res) {
  const token = req.cookies.refreshToken;

  if (token) {
    const user = await User.findOne({ refreshToken: token });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }

  res.clearCookie('refreshToken', cookieOptions());
  return res.json({ message: 'Logged out' });
}

async function me(req, res) {
  return res.json({ user: req.user });
}

module.exports = { register, login, googleLogin, refresh, logout, me };
