const AppError = require("./AppError");
const { ERROR_CODES } = require("./constants");

// Conflict errors (409) - for duplicate resources
class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, ERROR_CODES.CONFLICT);
  }
}

module.exports = ConflictError;
