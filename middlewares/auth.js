const jwt = require("jsonwebtoken");
const ERROR_CODES = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const authenticate = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(ERROR_CODES.UNAUTHORIZED)
      .json({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res
      .status(ERROR_CODES.UNAUTHORIZED)
      .json({ message: "Authorization required" });
  }
};

module.exports = { authenticate };
