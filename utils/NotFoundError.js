const AppError = require("./AppError");
const { ERROR_CODES } = require("./constants");

// Not found errors (404)
class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, ERROR_CODES.NOT_FOUND);
  }
}

module.exports = NotFoundError;
