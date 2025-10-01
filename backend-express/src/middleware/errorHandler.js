const logger = require('../utils/logger');
const { ApiError } = require('../utils/response');
const config = require('../config');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map(e => e.message);
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  if (err.code === 'SQLITE_CONSTRAINT') {
    statusCode = 409;
    message = 'Resource already exists or constraint violation';
  }

  logger.error(`Error: ${message}`, {
    statusCode,
    path: req.path,
    method: req.method,
    ip: req.ip,
    user: req.user?.id,
    stack: err.stack,
    errors
  });

  const response = {
    success: false,
    statusCode,
    message,
    ...(errors.length > 0 && { errors })
  };

  if (config.nodeEnv === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Route ${req.originalUrl} not found`);
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler
};
