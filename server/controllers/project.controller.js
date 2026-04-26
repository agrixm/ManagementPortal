const { validationResult } = require('express-validator');
const Project = require('../models/Project');

async function listProjects(req, res) {
  const filter = {};

  if (req.user.role === 'employee') {
    filter.members = req.user._id;
  }

  const projects = await Project.find(filter)
    .populate('members', 'name email role availability')
    .populate('createdBy', 'name email role')
    .sort({ createdAt: -1 });

  res.json(projects);
}

async function createProject(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, members = [], deadline, status } = req.body;
  const dedupMembers = [...new Set([req.user._id.toString(), ...members])];

  const project = await Project.create({
    name,
    description,
    members: dedupMembers,
    deadline,
    status,
    createdBy: req.user._id
  });

  const populated = await Project.findById(project._id)
    .populate('members', 'name email role availability')
    .populate('createdBy', 'name email role');

  return res.status(201).json(populated);
}

async function getProjectById(req, res) {
  const project = await Project.findById(req.params.id)
    .populate('members', 'name email role availability')
    .populate('createdBy', 'name email role');

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  return res.json(project);
}

async function updateProject(req, res) {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
    .populate('members', 'name email role availability')
    .populate('createdBy', 'name email role');

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  return res.json(project);
}

async function deleteProject(req, res) {
  const removed = await Project.findByIdAndDelete(req.params.id);
  if (!removed) {
    return res.status(404).json({ message: 'Project not found' });
  }

  return res.json({ message: 'Project deleted' });
}

async function addMember(req, res) {
  const { userId } = req.body;
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  if (!project.members.some((member) => member.toString() === userId)) {
    project.members.push(userId);
    await project.save();
  }

  const populated = await Project.findById(project._id)
    .populate('members', 'name email role availability')
    .populate('createdBy', 'name email role');

  return res.json(populated);
}

async function removeMember(req, res) {
  const { uid } = req.params;
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  project.members = project.members.filter((member) => member.toString() !== uid);
  await project.save();

  const populated = await Project.findById(project._id)
    .populate('members', 'name email role availability')
    .populate('createdBy', 'name email role');

  return res.json(populated);
}

module.exports = {
  listProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
};
