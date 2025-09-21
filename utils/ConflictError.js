const AppError = require("./AppError");

// Error status codes
const ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

// Conflict errors (409) - for duplicate resources
class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, ERROR_CODES.CONFLICT);
  }
}

module.exports = ConflictError;
