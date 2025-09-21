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

// Not found errors (404)
class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, ERROR_CODES.NOT_FOUND);
  }
}

module.exports = NotFoundError;
