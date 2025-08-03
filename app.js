const express = require("express");
const mongoose = require("mongoose");
const ERROR_CODES = require("./utils/errors");
const indexRouter = require("./routes/index");
const auth = require("./middlewares/auth");
const cors = require("cors");

const app = express();

app.use(cors());

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(async () => {
    console.log("Connected to MongoDB");

    // Force indexes (like 'unique: true') to be applied
    const User = require("./models/user");
    await User.syncIndexes();
    console.log("User indexes synced");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

app.use(express.json());

// Auth middleware must come BEFORE your routes that require authorization
app.use(auth);

// Mount all routes, including /signin and /signup handled in indexRouter
app.use("/", indexRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  res
    .status(ERROR_CODES.SERVER_ERROR)
    .json({ message: "An error has occurred on the server." });
});

// 404 handler (must be last)
app.use((req, res) => {
  res
    .status(ERROR_CODES.NOT_FOUND)
    .json({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
