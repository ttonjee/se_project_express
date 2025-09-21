// Base error class that all custom errors extend from
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;

    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
