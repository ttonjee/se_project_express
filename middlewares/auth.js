const jwt = require("jsonwebtoken");
const ERROR_CODES = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const authenticate = (req, res, next) => {
  const { authorization } = req.headers;

  // Check if authorization header exists and has correct format
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(ERROR_CODES.UNAUTHORIZED).json({
      message: "Authorization required",
      error: "Missing or invalid authorization header",
    });
  }

  const token = authorization.replace("Bearer ", "");

  // Validate token is not empty
  if (!token) {
    return res.status(ERROR_CODES.UNAUTHORIZED).json({
      message: "Authorization required",
      error: "Token is required",
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    // Add additional validation if needed
    if (!payload._id) {
      return res.status(ERROR_CODES.UNAUTHORIZED).json({
        message: "Authorization required",
        error: "Invalid token payload",
      });
    }

    req.user = payload;
    return next();
  } catch (err) {
    // Handle different JWT errors
    let errorMessage = "Authorization required";

    if (err.name === "TokenExpiredError") {
      errorMessage = "Token has expired";
    } else if (err.name === "JsonWebTokenError") {
      errorMessage = "Invalid token";
    } else if (err.name === "NotBeforeError") {
      errorMessage = "Token not active";
    }

    return res.status(ERROR_CODES.UNAUTHORIZED).json({
      message: "Authorization required",
      error: errorMessage,
    });
  }
};

module.exports = { authenticate };
