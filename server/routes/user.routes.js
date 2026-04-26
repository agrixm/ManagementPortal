const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvailability,
  deleteUser
} = require('../controllers/user.controller');

const router = express.Router();

router.use(verifyToken);

router.get('/', requireRole('admin', 'manager'), getUsers);
router.post(
  '/',
  requireRole('admin', 'manager'),
  [
    body('name').notEmpty(),
    body('email').trim().isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('role').optional().isIn(['admin', 'manager', 'employee']),
    body('availability').optional().isIn(['free', 'busy', 'overloaded'])
  ],
  createUser
);
router.get('/:id', getUserById);
router.put('/:id', [body('email').optional().isEmail()], updateUser);
router.put('/:id/availability', [body('availability').isIn(['free', 'busy', 'overloaded'])], updateAvailability);
router.delete('/:id', requireRole('admin'), deleteUser);

module.exports = router;
