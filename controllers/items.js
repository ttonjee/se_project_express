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

const getItemById = async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.itemId).orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = ERROR_CODES.NOT_FOUND;
      throw error;
    });
    res.json(item);
  } catch (err) {
    console.error(err);
  }
};

const createItem = async (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  try {
    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    res.status(201).json(item);
  } catch (err) {
    console.error("Error creating item:", err);
    if (err.name === "ValidationError") {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .json({ message: "Invalid data" });
    }
    res.status(ERROR_CODES.SERVER_ERROR).json({ message: "Server error" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndDelete(req.params.itemId).orFail(
      () => {
        const error = new Error("Item not found");
        error.statusCode = ERROR_CODES.NOT_FOUND;
        throw error;
      }
    );
    res.json(item);
  } catch (err) {
    console.error(err);
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
    res.json(item);
  } catch (err) {
    console.error(err);
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
    res.json(item);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
