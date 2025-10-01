const express = require('express');
const { body } = require('express-validator');
const {
  createNewInternship,
  getInternships,
  getInternship,
  updateInternshipDetails,
  removeInternship,
  approveInternshipById
} = require('../controllers/internshipController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  authorize('mentor'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('company').trim().notEmpty().withMessage('Company name is required'),
    body('duration').trim().notEmpty().withMessage('Duration is required')
  ],
  validate,
  createNewInternship
);

router.get('/', getInternships);

router.get('/:id', getInternship);

router.put('/:id', authorize('mentor', 'admin'), updateInternshipDetails);

router.delete('/:id', authorize('mentor', 'admin'), removeInternship);

router.post('/:id/approve', authorize('admin'), approveInternshipById);

module.exports = router;
