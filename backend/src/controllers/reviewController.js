const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const reviewService = require("../services/reviewService");

const addReview = asyncHandler(async (req, res) => {
  const review = await reviewService.addReview(
    req.params.id,
    req.user._id,
    req.body
  );
  return sendSuccess(res, { review }, 201);
});

const listReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.listPromptReviews(req.params.id, req.query);
  return sendSuccess(res, { reviews: result.items, meta: result.meta });
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await reviewService.updateReview(
    req.params.id,
    req.user._id,
    req.body
  );
  return sendSuccess(res, { review });
});

const deleteReview = asyncHandler(async (req, res) => {
  await reviewService.deleteReview(req.params.id, req.user);
  return sendSuccess(res, { message: "Review deleted successfully" });
});

module.exports = {
  addReview,
  listReviews,
  updateReview,
  deleteReview,
};
