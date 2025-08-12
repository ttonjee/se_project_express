const express = require("express");
const {
  getItems,
  createItem,

  deleteItem,
} = require("../controllers/items");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.get("/", getItems);
router.post("/", authenticate, createItem);
router.delete("/:itemId", authenticate, deleteItem);

module.exports = router;
