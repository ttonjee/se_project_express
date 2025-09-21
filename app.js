const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const User = require("./models/user");
const indexRouter = require("./routes/index");
const { ERROR_CODES, NotFoundError } = require("./utils/errors");
const { errorLogger, handleGeneralError, handleCelebrateError } = require("./middlewares/errors");

const app = express();

// Configure CORS to allow requests from frontend
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3004',
    'https://flexx.crabdance.com'
  ],
  credentials: true
}));
app.use(express.json());

const { PORT = 3001, NODE_ENV } = process.env;

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(async () => {
    console.log("Connected to MongoDB");

    if (NODE_ENV !== "production") {
      await User.syncIndexes();
      console.log("User indexes synced");
    }
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// Main router
app.use("/api", indexRouter);

// 404 handler - must come before error handlers
app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

// Error handlers (in correct order):
// 1. Error logger - logs all errors
app.use(errorLogger);

// 2. Celebrate validation error handler
app.use(handleCelebrateError);

// 3. Centralized error handler
app.use(handleGeneralError);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
