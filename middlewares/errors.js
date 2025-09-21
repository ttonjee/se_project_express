const { isCelebrateError } = require("celebrate");
const { ERROR_CODES, AppError, ValidationError, AuthError, NotFoundError, ConflictError, ServerError } = require("../utils/errors");

// Error logging middleware - logs all errors but doesn't handle them
const errorLogger = (err, req, res, next) => {
  console.error("Error occurred:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });
  
  // Pass the error to the next error handler
  next(err);
};

const handleCelebrateError = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    const errorMessage =
      err.details.get("body") ||
      err.details.get("params") ||
      err.details.get("query");

    return res.status(ERROR_CODES.BAD_REQUEST).json({
      message: errorMessage.details[0].message
    });
  }

  next(err);
};

const handleGeneralError = (err, req, res, next) => {
  // Error has already been logged by errorLogger middleware

  // Handle custom AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(ERROR_CODES.BAD_REQUEST).json({
      message: messages.join(", ")
    });
  }

  // Handle MongoDB CastError (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(ERROR_CODES.BAD_REQUEST).json({
      message: "Invalid ID format"
    });
  }

  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(ERROR_CODES.CONFLICT).json({
      message: `${field} already exists`
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(ERROR_CODES.UNAUTHORIZED).json({
      message: "Invalid token"
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(ERROR_CODES.UNAUTHORIZED).json({
      message: "Token has expired"
    });
  }

  // Handle custom error objects with status codes (legacy support)
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message || "An error occurred"
    });
  }

  // Default server error
  return res.status(ERROR_CODES.SERVER_ERROR).json({
    message: "Internal server error"
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
  errorLogger,
  handleCelebrateError,
  handleGeneralError,
  handleNotFound,
};
