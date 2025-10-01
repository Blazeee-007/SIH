const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('mentor'), (req, res) => {
  res.json({ message: 'Create task' });
});

router.get('/', (req, res) => {
  res.json({ message: 'Get tasks' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get task by ID' });
});

router.put('/:id', authorize('mentor', 'admin'), (req, res) => {
  res.json({ message: 'Update task' });
});

router.delete('/:id', authorize('mentor', 'admin'), (req, res) => {
  res.json({ message: 'Delete task' });
});

module.exports = router;
