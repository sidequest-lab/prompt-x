const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const { verifyAccessToken } = require("../utils/tokens");

async function requireAuth(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication required"));
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select(
      "_id name email role bio avatarUrl favoriteTags"
    );

    if (!user) {
      return next(new ApiError(401, "User session is invalid"));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired access token"));
  }
}

async function optionalAuth(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select(
      "_id name email role bio avatarUrl favoriteTags"
    );

    if (user) {
      req.user = user;
    }
  } catch (error) {
    req.user = null;
  }

  return next();
}

module.exports = {
  requireAuth,
  optionalAuth,
};
