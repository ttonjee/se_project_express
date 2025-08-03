const jwt = require("jsonwebtoken");
const ERROR_CODES = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

module.exports = (req, res, next) => {
  // Allow public access to these routes
  if (
    (req.method === "POST" &&
      (req.path === "/signin" || req.path === "/signup")) ||
    (req.method === "GET" && req.path === "/items")
  ) {
    return next();
  }

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(ERROR_CODES.UNAUTHORIZED)
      .json({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(ERROR_CODES.UNAUTHORIZED)
      .json({ message: "Authorization required" });
  }

  req.user = payload; // Attach payload to request
  return next();
};
