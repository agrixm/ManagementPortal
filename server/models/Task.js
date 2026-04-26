const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['backlog', 'in-progress', 'done'], default: 'backlog' },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    deadline: { type: Date },
    milestoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Milestone', default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
