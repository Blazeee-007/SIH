const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const internshipRoutes = require('./internshipRoutes');
const applicationRoutes = require('./applicationRoutes');
const taskRoutes = require('./taskRoutes');
const submissionRoutes = require('./submissionRoutes');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Prashikshan API v1',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      internships: '/api/internships',
      applications: '/api/applications',
      tasks: '/api/tasks',
      submissions: '/api/submissions'
    }
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/internships', internshipRoutes);
router.use('/applications', applicationRoutes);
router.use('/tasks', taskRoutes);
router.use('/submissions', submissionRoutes);

module.exports = router;
