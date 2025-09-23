const AppError = require("./AppError");
const { ERROR_CODES } = require("./constants");

// Server errors (500)
class ServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, ERROR_CODES.SERVER_ERROR);
  }
}

module.exports = ServerError;
