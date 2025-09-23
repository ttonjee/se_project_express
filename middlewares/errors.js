const handleGeneralError = (err, req, res, _next) => {
  const { statusCode = 500, message = "An error occurred on the server" } = err;
  return res.status(statusCode).send({ message });
};

module.exports = {
  handleGeneralError,
};
