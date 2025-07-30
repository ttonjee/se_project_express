const express = require("express");
const mongoose = require("mongoose");
const app = express();

const itemsRouter = require("./routes/items");
const usersRouter = require("./routes/users");

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

// Mount routes with namespaces
app.use("/users", usersRouter);
app.use("/items", itemsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
