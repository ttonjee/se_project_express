const express = require("express");
const usersRouter = require("./users");
const itemsRouter = require("./items");

const router = express.Router();

router.use("/users", usersRouter);
router.use("/items", itemsRouter);

module.exports = router;
