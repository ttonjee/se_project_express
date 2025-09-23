const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
require("dotenv").config();
const User = require("./models/user");
const indexRouter = require("./routes/index");
const { NotFoundError } = require("./utils/errors");
const { handleGeneralError } = require("./middlewares/errors");
const { requestLogger, errorLogger } = require("./middlewares/logger");

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

// Request logger
app.use(requestLogger);

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
// 1. Celebrate validation error handler
app.use(errors());

// 2. Error logger
app.use(errorLogger);

// 3. Centralized error handler
app.use(handleGeneralError);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
