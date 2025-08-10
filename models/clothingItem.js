const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },
    weather: {
      type: String,
      required: true,
      enum: ["hot", "warm", "cold"], // adjust if needed
    },
    imageUrl: {
      type: String,
      required: true,
      validate: {
        validator: (v) => validator.isURL(v),
        message: "Invalid URL",
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("item", clothingItemSchema);
