const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const { ApiError } = require('../utils/response');
const {
  createInternship,
  getInternshipById,
  getAllInternships,
  updateInternship,
  deleteInternship,
  approveInternship,
  getInternshipsByMentor
} = require('../models/internshipModel');

const createNewInternship = asyncHandler(async (req, res) => {
  const internshipData = {
    ...req.body,
    mentor_id: req.user.id
  };

  const internship = await createInternship(internshipData);
  sendSuccess(res, 201, { internship }, 'Internship created successfully');
});

const getInternships = asyncHandler(async (req, res) => {
  const filters = {
    status: req.query.status,
    search: req.query.search,
    limit: parseInt(req.query.limit) || 20,
    offset: parseInt(req.query.offset) || 0
  };

  if (req.user.role === 'mentor') {
    filters.mentor_id = req.user.id;
  } else if (req.user.role === 'student') {
    filters.status = 'published';
    filters.is_approved = 1;
  }

  const internships = await getAllInternships(filters);
  sendSuccess(res, 200, { internships, count: internships.length });
});

const getInternship = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const internship = await getInternshipById(id);

  if (!internship) {
    throw new ApiError(404, 'Internship not found');
  }

  sendSuccess(res, 200, { internship });
});

const updateInternshipDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const internship = await getInternshipById(id);

  if (!internship) {
    throw new ApiError(404, 'Internship not found');
  }

  if (req.user.role === 'mentor' && internship.mentor_id !== req.user.id) {
    throw new ApiError(403, 'You can only update your own internships');
  }

  const updatedInternship = await updateInternship(id, req.body);
  sendSuccess(res, 200, { internship: updatedInternship }, 'Internship updated successfully');
});

const removeInternship = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const internship = await getInternshipById(id);

  if (!internship) {
    throw new ApiError(404, 'Internship not found');
  }

  if (req.user.role === 'mentor' && internship.mentor_id !== req.user.id) {
    throw new ApiError(403, 'You can only delete your own internships');
  }

  await deleteInternship(id);
  sendSuccess(res, 200, null, 'Internship deleted successfully');
});

const approveInternshipById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const internship = await approveInternship(id);

  if (!internship) {
    throw new ApiError(404, 'Internship not found');
  }

  sendSuccess(res, 200, { internship }, 'Internship approved successfully');
});

module.exports = {
  createNewInternship,
  getInternships,
  getInternship,
  updateInternshipDetails,
  removeInternship,
  approveInternshipById
};
