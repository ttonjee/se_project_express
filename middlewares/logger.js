const express = require("express");
const winston = require("winston");
const { optionalAuthenticate } = require("../middlewares/auth");

const router = express.Router();

// Create a separate logger for frontend logs
const frontendLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: "frontend.log",
      level: "info",
    }),
    new winston.transports.File({
      filename: "frontend-error.log",
      level: "error",
    }),
  ],
});

// Endpoint to receive frontend logs
router.post("/", optionalAuthenticate, (req, res) => {
  try {
    const { level, message, meta } = req.body;

    // Add user information if authenticated
    const logData = {
      ...meta,
      userId: req.user?._id || "anonymous",
      source: "frontend",
    };

    // Log to appropriate level
    frontendLogger.log(level, message, logData);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Invalid log data" });
  }
});

module.exports = router;
