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

// Mock user middleware (add next!)
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };
  next();
});

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ message: "Requested resource not found, fr fr" });
// });

// // Error handler
// app.use((err, req, res) => {
//   console.error("Error stack", err.stack);
//   res
//     .status(ERROR_CODES.NOT_FOUND)
//     .json({ message: "Requested resource not found!" });
// });

app.use("/", indexRouter); // <-- Use the index router

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
