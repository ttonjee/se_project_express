const express = require("express");
const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUserProfile,
  login,
} = require("../controllers/users");

const router = express.Router();

router.post("/signin", login); // Login route

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.patch("/me", updateUserProfile);
router.get("/:userId", getUserById);

module.exports = router;
