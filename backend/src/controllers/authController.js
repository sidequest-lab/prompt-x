const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const authService = require("../services/authService");

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return sendSuccess(res, result, 201);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return sendSuccess(res, result);
});

const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refresh(req.body.refreshToken);
  return sendSuccess(res, result);
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);
  return sendSuccess(res, { message: "Logged out successfully" });
});

const me = asyncHandler(async (req, res) => {
  return sendSuccess(res, {
    user: req.user,
  });
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
};
