const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { AuthError } = require("../utils/errors");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v, {
          protocols: ["http", "https"],
          require_protocol: true,
        });
      },
      message: "Invalid URL format for avatar",
    },
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false,
  },
});

// Static method to find user by credentials with custom AuthError
userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select("+password");
  if (!user || !user.password) throw new AuthError("Invalid email or password");

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) throw new AuthError("Invalid email or password");

  return user;
};

module.exports = mongoose.model("User", userSchema);
