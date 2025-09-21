const ClothingItem = require("../models/clothingItem");
const { ValidationError, NotFoundError, ForbiddenError, ServerError } = require("../utils/errors");

const getItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find({});
    return res.json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    return next(new ServerError("Server error"));
  }
};

const createItem = async (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  try {
    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(201).json(item);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new ValidationError("Invalid data"));
    }
    return next(new ServerError("Server error"));
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findById(req.params.itemId).orFail(() => {
      throw new NotFoundError("Item not found");
    });

    if (item.owner.toString() !== req.user._id) {
      return next(new ForbiddenError("You are not authorized to delete this item."));
    }

    await item.deleteOne();
    return res.status(200).json({ message: "Item deleted successfully." });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new ValidationError("Invalid ID"));
    }
    return next(err);
  }
};

const likeItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).orFail(() => {
      throw new NotFoundError("Item not found");
    });
    return res.json(item);
  } catch (err) {
    if (err.name === "CastError") {
      return next(new ValidationError("Invalid ID"));
    }
    return next(err);
  }
};

const dislikeItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).orFail(() => {
      throw new NotFoundError("Item not found");
    });
    return res.json(item);
  } catch (err) {
    if (err.name === "CastError") {
      return next(new ValidationError("Invalid ID"));
    }
    return next(err);
  }
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
