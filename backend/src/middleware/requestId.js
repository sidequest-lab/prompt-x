const crypto = require("crypto");

function requestId(req, res, next) {
  const currentRequestId = req.headers["x-request-id"] || crypto.randomUUID();

  req.requestId = currentRequestId;
  res.setHeader("x-request-id", currentRequestId);

  return next();
}

module.exports = requestId;
