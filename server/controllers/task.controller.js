const { validationResult } = require('express-validator');
const Task = require('../models/Task');

async function listTasks(req, res) {
  const { projectId, assignee, status } = req.query;
  const filter = {};

  if (projectId) filter.projectId = projectId;
  if (assignee) filter.assignedTo = assignee;
  if (status) filter.status = status;

  const tasks = await Task.find(filter)
    .populate('assignedTo', 'name email role availability')
    .populate('projectId', 'name status')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  res.json(tasks);
}

async function createTask(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const task = await Task.create({
    ...req.body,
    createdBy: req.user._id
  });

  const populated = await Task.findById(task._id)
    .populate('assignedTo', 'name email role availability')
    .populate('projectId', 'name status')
    .populate('createdBy', 'name email');

  return res.status(201).json(populated);
}

async function getTaskById(req, res) {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email role availability')
    .populate('projectId', 'name status')
    .populate('createdBy', 'name email');

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  return res.json(task);
}

async function updateTask(req, res) {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
    .populate('assignedTo', 'name email role availability')
    .populate('projectId', 'name status')
    .populate('createdBy', 'name email');

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  return res.json(task);
}

async function updateTaskStatus(req, res) {
  const { status } = req.body;
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  )
    .populate('assignedTo', 'name email role availability')
    .populate('projectId', 'name status')
    .populate('createdBy', 'name email');

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  return res.json(task);
}

async function deleteTask(req, res) {
  const removed = await Task.findByIdAndDelete(req.params.id);
  if (!removed) {
    return res.status(404).json({ message: 'Task not found' });
  }

  return res.json({ message: 'Task deleted' });
}

async function myTasks(req, res) {
  const tasks = await Task.find({ assignedTo: req.user._id })
    .populate('assignedTo', 'name email role availability')
    .populate('projectId', 'name status')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  return res.json(tasks);
}

module.exports = {
  listTasks,
  createTask,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  myTasks
};
