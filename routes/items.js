const express = require("express");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/items");
const { authenticate } = require("../middlewares/auth");
const {
  validateItemCreation,
  validateObjectId,
} = require("../middlewares/validation");

const router = express.Router();

router.get("/", getItems); // public

// protected routes
router.post("/", authenticate, validateItemCreation, createItem);
router.delete("/:itemId", authenticate, validateObjectId, deleteItem);
router.put("/:itemId/likes", authenticate, validateObjectId, likeItem);
router.delete("/:itemId/likes", authenticate, validateObjectId, dislikeItem);

module.exports = router;
