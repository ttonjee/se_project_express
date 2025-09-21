// Error status codes
const ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

// Import all error classes
const AppError = require("./AppError");
const ValidationError = require("./ValidationError");
const AuthError = require("./AuthError");
const ForbiddenError = require("./ForbiddenError");
const NotFoundError = require("./NotFoundError");
const ConflictError = require("./ConflictError");
const ServerError = require("./ServerError");

// Helper function to create error from status code
const createErrorFromStatus = (statusCode, message) => {
  switch (statusCode) {
    case ERROR_CODES.BAD_REQUEST:
      return new ValidationError(message);
    case ERROR_CODES.UNAUTHORIZED:
      return new AuthError(message);
    case ERROR_CODES.FORBIDDEN:
      return new ForbiddenError(message);
    case ERROR_CODES.NOT_FOUND:
      return new NotFoundError(message);
    case ERROR_CODES.CONFLICT:
      return new ConflictError(message);
    case ERROR_CODES.SERVER_ERROR:
      return new ServerError(message);
    default:
      return new AppError(message, statusCode);
  }
};

module.exports = {
  ERROR_CODES,
  AppError,
  ValidationError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ServerError,
  createErrorFromStatus,
};
