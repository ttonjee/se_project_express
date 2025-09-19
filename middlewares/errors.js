const { isCelebrateError } = require("celebrate");
const ERROR_CODES = require("../utils/errors");

const handleCelebrateError = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    const errorMessage =
      err.details.get("body") ||
      err.details.get("params") ||
      err.details.get("query");

    return res.status(ERROR_CODES.BAD_REQUEST).json({
      message: "Validation error",
      error: errorMessage.details[0].message,
    });
  }

  next(err);
};

const handleGeneralError = (err, req, res, next) => {
  console.error("Error:", err);

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(ERROR_CODES.BAD_REQUEST).json({
      message: "Validation error",
      error: messages.join(", "),
    });
  }

  // Handle MongoDB CastError (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(ERROR_CODES.BAD_REQUEST).json({
      message: "Invalid ID format",
      error: "Please provide a valid ID",
    });
  }

  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(ERROR_CODES.CONFLICT).json({
      message: "Conflict error",
      error: `${field} already exists`,
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(ERROR_CODES.UNAUTHORIZED).json({
      message: "Authentication error",
      error: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(ERROR_CODES.UNAUTHORIZED).json({
      message: "Authentication error",
      error: "Token has expired",
    });
  }

  // Handle custom error objects with status codes
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message || "An error occurred",
      error: err.error || err.message,
    });
  }

  // Default server error
  return res.status(ERROR_CODES.SERVER_ERROR).json({
    message: "Internal server error",
    error: "Something went wrong on the server",
  });
};

// Optional: Middleware to handle 404 errors
const handleNotFound = (req, res) => {
  return res.status(ERROR_CODES.NOT_FOUND).json({
    message: "Route not found",
    error: `Cannot ${req.method} ${req.path}`,
  });
};

module.exports = {
  handleCelebrateError,
  handleGeneralError,
  handleNotFound,
};
