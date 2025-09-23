const AppError = require("./AppError");
const { ERROR_CODES } = require("./constants");

// Authorization/Forbidden errors (403)
class ForbiddenError extends AppError {
  constructor(message = "Access denied") {
    super(message, ERROR_CODES.FORBIDDEN);
  }
}

module.exports = ForbiddenError;
