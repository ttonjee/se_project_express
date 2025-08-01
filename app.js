const express = require("express");
const mongoose = require("mongoose");
const ERROR_CODES = require("./utils/errors");
const indexRouter = require("./routes/index"); // <-- Import the index router

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
app.use(express.json());

// Mock user middleware
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };
  next();
});

// Mount all routes
app.use("/", indexRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res
    .status(ERROR_CODES.SERVER_ERROR)
    .json({ message: "An error has occurred on the server." });
});

// 404 handler (should be last)
app.use((req, res) => {
  res
    .status(ERROR_CODES.NOT_FOUND)
    .json({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
