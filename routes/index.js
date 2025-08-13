const express = require("express");
const usersRouter = require("./users");
const itemsRouter = require("./items");
const { login, createUser } = require("../controllers/users");

const router = express.Router();

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/items", itemsRouter);

router.use("/users", usersRouter);

module.exports = router;
