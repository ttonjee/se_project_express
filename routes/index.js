const express = require("express");
const usersRouter = require("./users");
const itemsRouter = require("./items");
const { login, createUser } = require("../controllers/users");

const router = express.Router();

// Auth routes
router.post("/signin", login);
router.post("/signup", createUser);

// Other routes
router.use("/users", usersRouter);
router.use("/items", itemsRouter);

module.exports = router;
