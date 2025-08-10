const express = require("express");
const usersRouter = require("./users");
const itemsRouter = require("./items");
const { login, createUser } = require("../controllers/users");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Public auth routes
router.post("/signin", login);
router.post("/signup", createUser);

// Protected routes
router.use("/users", authenticate, usersRouter);
router.use("/items", authenticate, itemsRouter);

module.exports = router;
