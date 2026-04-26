const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee' },
    department: { type: String, default: '' },
    skills: { type: [String], default: [] },
    availability: { type: String, enum: ['free', 'busy', 'overloaded'], default: 'free' },
    avatar: { type: String, default: '' },
    // profile details
    bio: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    portfolio: { type: [String], default: [] },
    links: {
      type: [
        {
          label: { type: String, default: '' },
          url: { type: String, default: '' }
        }
      ],
      default: []
    },
    notifications: {
      type: [
        {
          message: { type: String },
          type: { type: String, default: 'info' },
          link: { type: String, default: '' },
          read: { type: Boolean, default: false },
          createdAt: { type: Date, default: Date.now }
        }
      ],
      default: []
    },
    refreshToken: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
