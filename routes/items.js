const express = require("express");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/items");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.get("/", getItems); // public

// protected routes
router.post("/", authenticate, createItem);
router.delete("/:itemId", authenticate, deleteItem);
router.put("/:itemId/likes", authenticate, likeItem);
router.delete("/:itemId/likes", authenticate, dislikeItem);

module.exports = router;
