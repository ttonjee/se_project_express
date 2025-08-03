const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const auth = require("./middlewares/auth");
const indexRouter = require("./routes/index");
const ERROR_CODES = require("./utils/errors");

const app = express();

app.use(cors());
app.use(express.json());

const { PORT = 3001, NODE_ENV } = process.env;

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(async () => {
    console.log("Connected to MongoDB");

    // Ensure indexes like 'unique: true' are enforced (development only)
    if (NODE_ENV !== "production") {
      // eslint-disable-next-line global-require
      const User = require("./models/user");
      await User.syncIndexes();
      console.log("User indexes synced");
    }
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// Auth middleware (must come before protected routes)
app.use(auth);

// Mount main router
app.use("/", indexRouter);

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res
    .status(ERROR_CODES.SERVER_ERROR)
    .json({ message: "An error has occurred on the server." });
});

// 404 handler (must come last)
app.use((req, res) => {
  res
    .status(ERROR_CODES.NOT_FOUND)
    .json({ message: "Requested resource not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
