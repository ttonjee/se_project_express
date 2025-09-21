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

// Authorization/Forbidden errors (403)
class ForbiddenError extends AppError {
  constructor(message = "Access denied") {
    super(message, ERROR_CODES.FORBIDDEN);
  }
}

module.exports = ForbiddenError;
