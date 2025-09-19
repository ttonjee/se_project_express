const express = require("express");
const { getCurrentUser, updateUserProfile } = require("../controllers/users");
const { authenticate } = require("../middlewares/auth");
const { validateUserUpdate } = require("../middlewares/validation");

const router = express.Router();

// Get current user - no validation needed for GET request
router.get("/me", authenticate, getCurrentUser);

// Update user profile - add validation middleware
router.patch("/me", authenticate, validateUserUpdate, updateUserProfile);

module.exports = router;
