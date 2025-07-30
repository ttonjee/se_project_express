const User = require("../models/user");
const ERROR_CODES = require("../utils/errors");

const getUsers = (req, res) => {
  console.log("Query params:", req.query); // more useful for GET requests

  User.find({})
    .then((users) => res.status(200).json(users))
    .catch((error) => {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Server error" });
    });
};
const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      console.error("Error creating user:", err); // <-- error logging
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: "Invalid data" });
      }
      res.status(500).json({ message: "Server error" });
    });
};

module.exports = {
  getUsers,
  createUser,
};
