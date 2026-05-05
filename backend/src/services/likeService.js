const Like = require("../models/Like");
const Prompt = require("../models/Prompt");
const ApiError = require("../utils/ApiError");
const { ACTIVITY_TYPES } = require("../constants/prompt");
const { trackActivity } = require("./activityService");
const { recalculatePromptRanking } = require("./rankingService");
const { calculateEngagementScore } = require("./engagementService");

async function syncPromptLikeStats(promptId) {
  const [likeCount, prompt] = await Promise.all([
    Like.countDocuments({ prompt: promptId }),
    Prompt.findById(promptId).select("views reviewCount favoriteCount"),
  ]);

  if (!prompt) {
    return null;
  }

  await Prompt.findByIdAndUpdate(promptId, {
    likeCount,
    engagementScore: calculateEngagementScore({
      ...prompt.toObject(),
      likeCount,
    }),
  });

  await recalculatePromptRanking(promptId);

  return likeCount;
}

async function addLike(promptId, userId) {
  const prompt = await Prompt.findById(promptId);

  if (!prompt) {
    throw new ApiError(404, "Prompt not found");
  }

  if (prompt.author.toString() === userId.toString()) {
    throw new ApiError(400, "You cannot like your own prompt");
  }

  try {
    await Like.create({
      user: userId,
      prompt: promptId,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "Prompt already liked");
    }

    throw error;
  }

  await syncPromptLikeStats(promptId);
  await trackActivity({
    userId,
    promptId,
    type: ACTIVITY_TYPES.LIKE,
    tagsSnapshot: prompt.tags,
    categorySnapshot: prompt.category,
  });

  return Prompt.findById(promptId).populate("author", "name avatarUrl").lean();
}

async function removeLike(promptId, userId) {
  const result = await Like.deleteOne({
    prompt: promptId,
    user: userId,
  });

  if (!result.deletedCount) {
    throw new ApiError(404, "Like not found");
  }

  await syncPromptLikeStats(promptId);

  return Prompt.findById(promptId).populate("author", "name avatarUrl").lean();
}

async function attachLikeState(prompts, userId) {
  if (!userId) {
    return prompts.map((prompt) => ({
      ...prompt,
      isLiked: false,
    }));
  }

  const promptIds = prompts.map((prompt) => prompt._id).filter(Boolean);

  if (!promptIds.length) {
    return prompts;
  }

  const likes = await Like.find({
    user: userId,
    prompt: { $in: promptIds },
  })
    .select("prompt")
    .lean();

  const likedPromptIds = new Set(likes.map((like) => like.prompt.toString()));

  return prompts.map((prompt) => ({
    ...prompt,
    isLiked: likedPromptIds.has(prompt._id.toString()),
  }));
}

module.exports = {
  addLike,
  removeLike,
  syncPromptLikeStats,
  attachLikeState,
};
