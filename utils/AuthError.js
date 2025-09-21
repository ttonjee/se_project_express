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

// Authentication errors (401)
class AuthError extends AppError {
  constructor(message = "Authentication required") {
    super(message, ERROR_CODES.UNAUTHORIZED);
  }
}

module.exports = AuthError;
