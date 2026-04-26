const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const {
  listProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/project.controller');

const router = express.Router();

router.use(verifyToken);

router.get('/', listProjects);
router.post('/', requireRole('admin', 'manager'), [body('name').notEmpty()], createProject);
router.get('/:id', getProjectById);
router.put('/:id', requireRole('admin', 'manager'), updateProject);
router.delete('/:id', requireRole('admin'), deleteProject);
router.post('/:id/members', requireRole('admin', 'manager'), [body('userId').notEmpty()], addMember);
router.delete('/:id/members/:uid', requireRole('admin', 'manager'), removeMember);

module.exports = router;
