const express = require("express");
const usersRouter = require("./users");
const itemsRouter = require("./items");
const { login, createUser } = require("../controllers/users");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/items", itemsRouter);

router.use(authenticate);

router.use("/users", usersRouter);

router.use("/items", itemsRouter);

module.exports = router;
