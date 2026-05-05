const mongoose = require("mongoose");
const User = require("../models/User");
const Prompt = require("../models/Prompt");
const Favorite = require("../models/Favorite");
const Like = require("../models/Like");
const Review = require("../models/Review");
const UserActivity = require("../models/UserActivity");
const ApiError = require("../utils/ApiError");
const { PROMPT_STATUS } = require("../constants/prompt");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");
const { attachFavoriteState } = require("./favoriteService");
const { attachLikeState } = require("./likeService");

async function getUserById(userId) {
  const user = await User.findById(userId).select(
    "_id name role bio avatarUrl favoriteTags createdAt updatedAt"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
}

async function updateCurrentUser(userId, payload) {
  const user = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  }).select("_id name email role bio avatarUrl favoriteTags createdAt updatedAt");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
}

async function getCreatorProfile(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid creator id");
  }

  const [creator] = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "prompts",
        localField: "_id",
        foreignField: "author",
        as: "prompts",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        bio: 1,
        avatarUrl: 1,
        favoriteTags: 1,
        stats: {
          activePrompts: {
            $size: {
              $filter: {
                input: "$prompts",
                as: "prompt",
                cond: { $eq: ["$$prompt.status", PROMPT_STATUS.PUBLISHED] },
              },
            },
          },
          totalViews: { $sum: "$prompts.views" },
          averageRating: { $avg: "$prompts.ratingAverage" },
        },
      },
    },
  ]);

  if (!creator) {
    throw new ApiError(404, "Creator not found");
  }

  return creator;
}

async function listCreators(query = {}) {
  const { page, limit, skip } = getPagination(query);
  const search = query.search?.trim();
  const pipeline = [
    {
      $lookup: {
        from: "prompts",
        localField: "_id",
        foreignField: "author",
        as: "prompts",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        bio: 1,
        avatarUrl: 1,
        favoriteTags: 1,
        activePrompts: {
          $size: {
            $filter: {
              input: "$prompts",
              as: "prompt",
              cond: { $eq: ["$$prompt.status", PROMPT_STATUS.PUBLISHED] },
            },
          },
        },
        averageRating: { $avg: "$prompts.ratingAverage" },
        totalViews: { $sum: "$prompts.views" },
      },
    },
    { $match: { activePrompts: { $gt: 0 } } },
  ];

  if (search) {
    pipeline.push({
      $match: {
        name: {
          $regex: search,
          $options: "i",
        },
      },
    });
  }

  pipeline.push(
    { $sort: { totalViews: -1, averageRating: -1, activePrompts: -1 } },
    {
      $facet: {
        items: [{ $skip: skip }, { $limit: limit }],
        meta: [{ $count: "total" }],
      },
    }
  );

  const [result] = await User.aggregate(pipeline);
  const items = result?.items || [];
  const total = result?.meta?.[0]?.total || 0;

  return {
    items,
    meta: buildPaginationMeta({ total, page, limit }),
  };
}

async function getCreatorPrompts(userId, { limit = 12, skip = 0 }) {
  const [items, total] = await Promise.all([
    Prompt.find({
      author: userId,
      status: PROMPT_STATUS.PUBLISHED,
    })
      .sort({ rankingScore: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name avatarUrl")
      .lean(),
    Prompt.countDocuments({
      author: userId,
      status: PROMPT_STATUS.PUBLISHED,
    }),
  ]);

  return {
    items,
    total,
  };
}

async function getCurrentWorkspace(userId, { limit = 6 } = {}) {
  const normalizedLimit = Math.min(Math.max(Number(limit) || 6, 1), 24);
  const user = await User.findById(userId).select(
    "_id name email role bio avatarUrl favoriteTags createdAt updatedAt"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const [
    savedFavorites,
    likedEntries,
    authoredPromptsRaw,
    recentActivityRaw,
    publishedPromptCount,
    totalSavedCount,
    totalLikedCount,
    reviewsWrittenCount,
  ] = await Promise.all([
    Favorite.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(normalizedLimit)
      .populate({
        path: "prompt",
        match: { status: PROMPT_STATUS.PUBLISHED },
        populate: { path: "author", select: "name avatarUrl" },
      })
      .lean(),
    Like.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(normalizedLimit)
      .populate({
        path: "prompt",
        match: { status: PROMPT_STATUS.PUBLISHED },
        populate: { path: "author", select: "name avatarUrl" },
      })
      .lean(),
    Prompt.find({
      author: userId,
      status: PROMPT_STATUS.PUBLISHED,
    })
      .sort({ rankingScore: -1, createdAt: -1 })
      .limit(normalizedLimit)
      .populate("author", "name avatarUrl")
      .lean(),
    UserActivity.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(normalizedLimit)
      .populate({
        path: "prompt",
        match: { status: PROMPT_STATUS.PUBLISHED },
        populate: { path: "author", select: "name avatarUrl" },
      })
      .lean(),
    Prompt.countDocuments({
      author: userId,
      status: PROMPT_STATUS.PUBLISHED,
    }),
    Favorite.countDocuments({ user: userId }),
    Like.countDocuments({ user: userId }),
    Review.countDocuments({ user: userId }),
  ]);

  const savedPromptsRaw = savedFavorites
    .map((entry) => entry.prompt)
    .filter(Boolean);
  const likedPromptsRaw = likedEntries.map((entry) => entry.prompt).filter(Boolean);
  const recentActivity = recentActivityRaw
    .filter((entry) => entry.prompt)
    .map((entry) => ({
      _id: entry._id,
      type: entry.type,
      createdAt: entry.createdAt,
      prompt: entry.prompt,
    }));

  const authoredPrompts = await attachLikeState(
    await attachFavoriteState(authoredPromptsRaw, userId),
    userId
  );
  const savedPrompts = await attachLikeState(
    await attachFavoriteState(savedPromptsRaw, userId),
    userId
  );
  const likedPrompts = await attachLikeState(
    await attachFavoriteState(likedPromptsRaw, userId),
    userId
  );

  const totals = await Prompt.aggregate([
    {
      $match: {
        author: new mongoose.Types.ObjectId(userId),
        status: PROMPT_STATUS.PUBLISHED,
      },
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" },
        totalReviewsReceived: { $sum: "$reviewCount" },
        averageRankingScore: { $avg: "$rankingScore" },
      },
    },
  ]);

  return {
    user,
    metrics: {
      publishedPromptCount,
      savedCount: totalSavedCount,
      likedCount: totalLikedCount,
      reviewsWrittenCount,
      totalViews: totals[0]?.totalViews || 0,
      reviewsReceivedCount: totals[0]?.totalReviewsReceived || 0,
      averageRankingScore: Number(
        ((totals[0]?.averageRankingScore || 0)).toFixed(2)
      ),
    },
    authoredPrompts,
    savedPrompts,
    likedPrompts,
    recentActivity,
  };
}

module.exports = {
  getUserById,
  updateCurrentUser,
  getCreatorProfile,
  listCreators,
  getCreatorPrompts,
  getCurrentWorkspace,
};
