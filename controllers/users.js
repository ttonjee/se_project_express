const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { ValidationError, ConflictError, AuthError, NotFoundError, ServerError } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const SALT_ROUNDS = 10;

const createUser = async (req, res, next) => {
  try {
    const { email, password, name, avatar } = req.body;

    console.log("Signup attempt for:", email);

    if (!password || password.length < 6) {
      return next(new ValidationError("Password must be at least 6 characters long."));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ConflictError("Email already exists"));
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
      return next(new ValidationError("Invalid data"));
    }

    if (err.code === 11000) {
      return next(new ConflictError("Email already exists"));
    }

    return next(new ServerError("An error occurred on the server"));
  }
};
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ValidationError("Email and password are required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (user.isBlocked || user.role === "guest") {
        return next(new AuthError("Access denied"));
      }

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.status(200).json({ token, email: user.email });
    })
    .catch((err) => {
      if (err.name === "AuthError") {
        return next(new AuthError(err.message));
      }
      console.error("Login error:", err);
      return next(new ServerError("An error occurred on the server"));
    });
};
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError("User not found");
    })
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new ValidationError("Invalid user ID"));
      }
      return next(err);
    });
};

const updateUserProfile = (req, res, next) => {
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
      throw new NotFoundError("User not found");
    })
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new ValidationError("Invalid data"));
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUserProfile,
};
