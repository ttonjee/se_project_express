const AppError = require("./AppError");
const { ERROR_CODES } = require("./constants");

// Authentication errors (401)
class AuthError extends AppError {
  constructor(message = "Authentication required") {
    super(message, ERROR_CODES.UNAUTHORIZED);
  }
}

module.exports = AuthError;
