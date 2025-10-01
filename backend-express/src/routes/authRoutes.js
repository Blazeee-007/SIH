const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  refreshAccessToken,
  logout,
  getCurrentUser
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('role').isIn(['student', 'mentor']).withMessage('Role must be either student or mentor')
  ],
  validate,
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  login
);

router.post('/refresh', refreshAccessToken);

router.post('/logout', authenticate, logout);

router.get('/me', authenticate, getCurrentUser);

module.exports = router;
