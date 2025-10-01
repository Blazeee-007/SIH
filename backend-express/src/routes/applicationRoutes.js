const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('student'), (req, res) => {
  res.json({ message: 'Create application' });
});

router.get('/', (req, res) => {
  res.json({ message: 'Get applications' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get application by ID' });
});

router.put('/:id', authorize('mentor', 'admin'), (req, res) => {
  res.json({ message: 'Update application status' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete/withdraw application' });
});

module.exports = router;
