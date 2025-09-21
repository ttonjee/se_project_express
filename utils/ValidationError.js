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

// Validation errors (400)
class ValidationError extends AppError {
  constructor(message = "Invalid input data") {
    super(message, ERROR_CODES.BAD_REQUEST);
  }
}

module.exports = ValidationError;
