const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    deadline: { type: Date },
    status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
