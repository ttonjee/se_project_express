const express = require("express");
const { getCurrentUser, updateUserProfile } = require("../controllers/users");

const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.get("/me", authenticate, getCurrentUser);
router.patch("/me", authenticate, updateUserProfile);

module.exports = router;
