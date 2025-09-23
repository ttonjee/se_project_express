const AppError = require("./AppError");
const { ERROR_CODES } = require("./constants");

// Validation errors (400)
class ValidationError extends AppError {
  constructor(message = "Invalid input data") {
    super(message, ERROR_CODES.BAD_REQUEST);
  }
}

module.exports = ValidationError;
