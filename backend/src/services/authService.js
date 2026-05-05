const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
} = require("../utils/tokens");

async function issueAuthTokens(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  user.refreshTokenHash = hashToken(refreshToken);
  user.lastLoginAt = new Date();
  await user.save();

  return {
    accessToken,
    refreshToken,
  };
}

async function register(payload) {
  const existingUser = await User.findOne({ email: payload.email }).lean();

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const passwordHash = await User.hashPassword(payload.password);
  const user = await User.create({
    name: payload.name,
    email: payload.email,
    passwordHash,
  });

  const tokens = await issueAuthTokens(user);

  return {
    user: user.toSafeObject(),
    tokens,
  };
}

async function login(payload) {
  const user = await User.findOne({ email: payload.email }).select(
    "+passwordHash +refreshTokenHash"
  );

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(payload.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const tokens = await issueAuthTokens(user);

  return {
    user: user.toSafeObject(),
    tokens,
  };
}

async function refresh(refreshToken) {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(payload.sub).select("+refreshTokenHash");

  if (!user || !user.refreshTokenHash) {
    throw new ApiError(401, "Refresh session is invalid");
  }

  if (user.refreshTokenHash !== hashToken(refreshToken)) {
    throw new ApiError(401, "Refresh token has been rotated");
  }

  const tokens = await issueAuthTokens(user);

  return {
    user: user.toSafeObject(),
    tokens,
  };
}

async function logout(userId) {
  const user = await User.findById(userId).select("+refreshTokenHash");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.refreshTokenHash = null;
  await user.save();

  return {
    success: true,
  };
}

module.exports = {
  register,
  login,
  refresh,
  logout,
};
