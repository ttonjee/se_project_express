const express = require("express");
const usersRouter = require("./users");
const itemsRouter = require("./items");
const { login, createUser } = require("../controllers/users");
const { validateUserSignin, validateUserSignup } = require("../middlewares/validation");

const router = express.Router();

router.post("/signin", validateUserSignin, login);
router.post("/signup", validateUserSignup, createUser);

router.use("/items", itemsRouter);

router.use("/users", usersRouter);

module.exports = router;
