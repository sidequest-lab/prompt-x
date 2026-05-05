const mongoose = require("mongoose");
const Review = require("../models/Review");
const Prompt = require("../models/Prompt");
const ApiError = require("../utils/ApiError");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");
const { ACTIVITY_TYPES } = require("../constants/prompt");
const { trackActivity } = require("./activityService");
const { recalculatePromptRanking } = require("./rankingService");
const { calculateEngagementScore } = require("./engagementService");

async function syncPromptReviewStats(promptId) {
  const normalizedPromptId = new mongoose.Types.ObjectId(promptId);
  const [aggregate] = await Review.aggregate([
    {
      $match: {
        prompt: normalizedPromptId,
      },
    },
    {
      $group: {
        _id: "$prompt",
        reviewCount: { $sum: 1 },
        ratingAverage: { $avg: "$rating" },
      },
    },
  ]);

  const prompt = await Prompt.findById(promptId).select(
    "views favoriteCount likeCount"
  );

  await Prompt.findByIdAndUpdate(promptId, {
    reviewCount: aggregate?.reviewCount || 0,
    ratingCount: aggregate?.reviewCount || 0,
    ratingAverage: Number((aggregate?.ratingAverage || 0).toFixed(2)),
    engagementScore: calculateEngagementScore({
      ...prompt?.toObject(),
      reviewCount: aggregate?.reviewCount || 0,
    }),
  });

  await recalculatePromptRanking(promptId);
}

async function addReview(promptId, userId, payload) {
  const prompt = await Prompt.findById(promptId);

  if (!prompt) {
    throw new ApiError(404, "Prompt not found");
  }

  if (prompt.author.toString() === userId.toString()) {
    throw new ApiError(400, "You cannot review your own prompt");
  }

  const existingReview = await Review.findOne({
    prompt: promptId,
    user: userId,
  }).lean();

  if (existingReview) {
    throw new ApiError(409, "You have already reviewed this prompt");
  }

  const review = await Review.create({
    prompt: promptId,
    user: userId,
    rating: payload.rating,
    comment: payload.comment,
  });

  await syncPromptReviewStats(promptId);
  await trackActivity({
    userId,
    promptId,
    type: ACTIVITY_TYPES.REVIEW,
    tagsSnapshot: prompt.tags,
    categorySnapshot: prompt.category,
  });

  return Review.findById(review._id).populate("user", "name avatarUrl").lean();
}

async function listPromptReviews(promptId, query) {
  const { page, limit, skip } = getPagination(query);
  const [items, total] = await Promise.all([
    Review.find({ prompt: promptId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name avatarUrl")
      .lean(),
    Review.countDocuments({ prompt: promptId }),
  ]);

  return {
    items,
    meta: buildPaginationMeta({ total, page, limit }),
  };
}

async function updateReview(reviewId, userId, payload) {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (review.user.toString() !== userId.toString()) {
    throw new ApiError(403, "You cannot update this review");
  }

  review.rating = payload.rating;
  review.comment = payload.comment;
  await review.save();
  await syncPromptReviewStats(review.prompt);

  return Review.findById(review._id).populate("user", "name avatarUrl").lean();
}

async function deleteReview(reviewId, user) {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  const isOwner = review.user.toString() === user._id.toString();
  const isAdmin = user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You cannot delete this review");
  }

  const promptId = review.prompt;
  await review.deleteOne();
  await syncPromptReviewStats(promptId);
}

module.exports = {
  addReview,
  listPromptReviews,
  updateReview,
  deleteReview,
};
