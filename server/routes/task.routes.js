const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middleware/auth.middleware');
const {
  listTasks,
  createTask,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  myTasks
} = require('../controllers/task.controller');

const router = express.Router();

router.use(verifyToken);

router.get('/', listTasks);
router.get('/my', myTasks);
router.post(
  '/',
  [body('title').notEmpty(), body('projectId').notEmpty(), body('priority').optional().isIn(['high', 'medium', 'low'])],
  createTask
);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.patch('/:id/status', [body('status').isIn(['backlog', 'in-progress', 'done'])], updateTaskStatus);
router.delete('/:id', deleteTask);

module.exports = router;
