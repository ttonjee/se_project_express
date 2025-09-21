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

// Server errors (500)
class ServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, ERROR_CODES.SERVER_ERROR);
  }
}

module.exports = ServerError;
