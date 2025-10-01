const { verifyToken } = require('../utils/jwt');
const { ApiError } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');
const { getUserById } = require('../models/userModel');

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : req.cookies.token;

  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    throw new ApiError(401, 'Invalid or expired token');
  }

  const user = await getUserById(decoded.userId);
  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  if (!user.is_active) {
    throw new ApiError(403, 'Account has been deactivated');
  }

  req.user = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };

  next();
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'You do not have permission to access this resource');
    }

    next();
  };
};

const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : req.cookies.token;

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      const user = await getUserById(decoded.userId);
      if (user && user.is_active) {
        req.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    }
  }

  next();
});

module.exports = {
  authenticate,
  authorize,
  optionalAuth
};
