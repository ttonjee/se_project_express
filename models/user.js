const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Needed for findUserByCredentials
const validator = require("validator");

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
        return validator.isURL(v);
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
    minlength: 6,
    select: false, // <-- This hides it by default
  },
});

// 🔐 Custom static method for login
userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select("+password"); // explicitly include password
  if (!user) throw new Error("Invalid email or password");

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) throw new Error("Invalid email or password");

  return user;
};

module.exports = mongoose.model("User", userSchema);
