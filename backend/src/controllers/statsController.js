const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const statsService = require("../services/statsService");

const getOverview = asyncHandler(async (_req, res) => {
  const stats = await statsService.getOverviewStats();
  return sendSuccess(res, { stats });
});

module.exports = {
  getOverview,
};
