const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('admin'), (req, res) => {
  res.json({ message: 'Get all users - Admin only' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get user by ID' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Update user' });
});

router.delete('/:id', authorize('admin'), (req, res) => {
  res.json({ message: 'Delete user - Admin only' });
});

module.exports = router;
