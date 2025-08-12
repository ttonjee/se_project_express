const express = require("express");
const {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/items");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.get("/", getItems);
router.post("/", authenticate, createItem);
router.patch("/:itemId", authenticate, updateItem);
router.delete("/:itemId", authenticate, deleteItem);

module.exports = router;
