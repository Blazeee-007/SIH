class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

class ApiError extends Error {
  constructor(statusCode, message = 'Something went wrong', errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

const sendSuccess = (res, statusCode, data, message) => {
  return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
};

const sendError = (res, statusCode, message, errors = []) => {
  return res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    errors
  });
};

module.exports = {
  ApiResponse,
  ApiError,
  sendSuccess,
  sendError
};
