const ClothingItem = require("../models/clothingItem");
const ERROR_CODES = require("../utils/errors");

const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find({});
    return res.json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .json({ message: "Server error" });
  }
};
const createItem = async (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  try {
    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(201).json(item);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .json({ message: "Invalid data" });
    }
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.itemId).orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = ERROR_CODES.NOT_FOUND;
      throw error;
    });

    // Check ownership
    if (item.owner.toString() !== req.user._id) {
      return res
        .status(ERROR_CODES.FORBIDDEN)
        .json({ message: "You are not authorized to delete this item." });
    }

    await item.deleteOne();
    return res.status(200).json({ message: "Item deleted successfully." });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .json({ message: "Invalid ID" });
    }
    if (err.statusCode === ERROR_CODES.NOT_FOUND) {
      return res.status(ERROR_CODES.NOT_FOUND).json({ message: err.message });
    }
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

const likeItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = ERROR_CODES.NOT_FOUND;
      throw error;
    });
    return res.json(item);
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .json({ message: "Invalid ID" });
    }
    if (err.statusCode === ERROR_CODES.NOT_FOUND) {
      return res.status(ERROR_CODES.NOT_FOUND).json({ message: err.message });
    }
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

const dislikeItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = ERROR_CODES.NOT_FOUND;
      throw error;
    });
    return res.json(item);
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .json({ message: "Invalid ID" });
    }
    if (err.statusCode === ERROR_CODES.NOT_FOUND) {
      return res.status(ERROR_CODES.NOT_FOUND).json({ message: err.message });
    }
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
