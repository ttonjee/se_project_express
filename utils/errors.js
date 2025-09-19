// Error status codes (matching your backend)
export const ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

// Base error class that all custom errors extend from
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;

    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation errors (400)
export class ValidationError extends AppError {
  constructor(message = "Invalid input data") {
    super(message, ERROR_CODES.BAD_REQUEST);
  }
}

// Authentication errors (401)
export class AuthError extends AppError {
  constructor(message = "Authentication required") {
    super(message, ERROR_CODES.UNAUTHORIZED);
  }
}

// Authorization/Forbidden errors (403)
export class ForbiddenError extends AppError {
  constructor(message = "Access denied") {
    super(message, ERROR_CODES.FORBIDDEN);
  }
}

// Not found errors (404)
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, ERROR_CODES.NOT_FOUND);
  }
}

// Conflict errors (409) - for duplicate resources
export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, ERROR_CODES.CONFLICT);
  }
}

// Server errors (500)
export class ServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, ERROR_CODES.SERVER_ERROR);
  }
}

// Network errors (connection issues)
export class NetworkError extends AppError {
  constructor(message = "Network connection failed") {
    super(message, 0); // 0 indicates network error
  }
}

// Helper function to create error from status code
export const createErrorFromStatus = (statusCode, message) => {
  switch (statusCode) {
    case ERROR_CODES.BAD_REQUEST:
      return new ValidationError(message);
    case ERROR_CODES.UNAUTHORIZED:
      return new AuthError(message);
    case ERROR_CODES.FORBIDDEN:
      return new ForbiddenError(message);
    case ERROR_CODES.NOT_FOUND:
      return new NotFoundError(message);
    case ERROR_CODES.CONFLICT:
      return new ConflictError(message);
    case ERROR_CODES.SERVER_ERROR:
      return new ServerError(message);
    default:
      return new AppError(message, statusCode);
  }
};
