const User = require("../models/user");
const ERROR_CODES = require("../utils/errors");

const getUsers = (req, res) => {
  return User.find({})
    .then((users) => res.status(200).json(users))
    .catch((error) => {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "Server error" });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = ERROR_CODES.NOT_FOUND;
      throw error;
    })
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      console.error("Error fetching user:", err);
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .json({ message: "Invalid ID" });
      }
      if (err.statusCode === ERROR_CODES.NOT_FOUND) {
        return res.status(ERROR_CODES.NOT_FOUND).json({ message: err.message });
      }
      res
        .status(ERROR_CODES.SERVER_ERROR)
        .json({ message: "An error has occurred on the server." });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  return User.create({ name, avatar })
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      console.error("Error creating user:", err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: "Invalid data" });
      }
      return res.status(500).json({ message: "Server error" });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
};
