const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ERROR_CODES = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const { AuthError } = require("../models/user");

const SALT_ROUNDS = 10;

const createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    console.log("Signup attempt for:", email);

    if (!password || password.length < 6) {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .json({ message: "Password must be at least 6 characters long." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(ERROR_CODES.CONFLICT)
        .json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      avatar: newUser.avatar,
      email: newUser.email,
      // Don't return password!
    });
  } catch (err) {
    console.error("Signup error:", err);

    if (err.name === "ValidationError") {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .json({ message: "Invalid data" });
    }

    if (err.code === 11000) {
      return res
        .status(ERROR_CODES.CONFLICT)
        .json({ message: "Email already exists" });
    }

    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .json({ message: "An error occurred on the server" });
  }
};
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .json({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (user.isBlocked || user.role === "guest") {
        return res
          .status(ERROR_CODES.FORBIDDEN)
          .json({ message: "Access denied" });
      }

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.status(200).json({ token, email: user.email });
    })
    .catch((err) => {
      if (err instanceof AuthError) {
        return res
          .status(ERROR_CODES.UNAUTHORIZED)
          .json({ message: err.message });
      }
      console.error("Login error:", err);
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .json({ message: "An error occurred on the server" });
    });
};
const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = ERROR_CODES.NOT_FOUND;
      throw error;
    })
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .json({ message: "Invalid user ID" });
      }
      if (err.statusCode === ERROR_CODES.NOT_FOUND) {
        return res.status(ERROR_CODES.NOT_FOUND).json({ message: err.message });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .json({ message: "An error has occurred on the server." });
    });
};

const updateUserProfile = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    }
  )
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = ERROR_CODES.NOT_FOUND;
      throw error;
    })
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .json({ message: "Invalid data" });
      }
      if (err.statusCode === ERROR_CODES.NOT_FOUND) {
        return res.status(ERROR_CODES.NOT_FOUND).json({ message: err.message });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .json({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUserProfile,
};
