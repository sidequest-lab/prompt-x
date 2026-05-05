const logger = require("../config/logger");

function errorHandler(error, req, res, _next) {
  const statusCode = error.statusCode || 500;
  const isOperational = statusCode < 500;

  logger[isOperational ? "warn" : "error"]("Request failed", {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message: error.message,
    details: error.details,
    stack: error.stack,
  });

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500 && process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
    details: error.details || undefined,
  });
}

module.exports = errorHandler;
