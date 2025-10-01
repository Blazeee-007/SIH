const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('student'), (req, res) => {
  res.json({ message: 'Submit task' });
});

router.get('/', (req, res) => {
  res.json({ message: 'Get submissions' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get submission by ID' });
});

router.put('/:id/grade', authorize('mentor'), (req, res) => {
  res.json({ message: 'Grade submission' });
});

module.exports = router;
