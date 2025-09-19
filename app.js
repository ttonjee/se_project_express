const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const User = require("./models/user");
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

    if (NODE_ENV !== "production") {
      await User.syncIndexes();
      console.log("User indexes synced");
    }
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// Main router
app.use("/", indexRouter);

// Error handler
app.use((err, _, res, _next) => {
  console.error("Unhandled error:", err);
  res
    .status(ERROR_CODES.SERVER_ERROR)
    .json({ message: "An error has occurred on the server." });
});

// 404 handler
app.use((req, res) => {
  res
    .status(ERROR_CODES.NOT_FOUND)
    .json({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
