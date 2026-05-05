const Favorite = require("../models/Favorite");
const Prompt = require("../models/Prompt");
const ApiError = require("../utils/ApiError");
const { ACTIVITY_TYPES } = require("../constants/prompt");
const { trackActivity } = require("./activityService");
const { recalculatePromptRanking } = require("./rankingService");
const { calculateEngagementScore } = require("./engagementService");

async function syncPromptFavoriteStats(promptId) {
  const [favoriteCount, prompt] = await Promise.all([
    Favorite.countDocuments({ prompt: promptId }),
    Prompt.findById(promptId).select("views reviewCount likeCount"),
  ]);

  if (!prompt) {
    return null;
  }

  await Prompt.findByIdAndUpdate(promptId, {
    favoriteCount,
    engagementScore: calculateEngagementScore({
      ...prompt.toObject(),
      favoriteCount,
    }),
  });

  await recalculatePromptRanking(promptId);

  return favoriteCount;
}

async function addFavorite(promptId, userId) {
  const prompt = await Prompt.findById(promptId);

  if (!prompt) {
    throw new ApiError(404, "Prompt not found");
  }

  if (prompt.author.toString() === userId.toString()) {
    throw new ApiError(400, "You cannot favorite your own prompt");
  }

  try {
    await Favorite.create({
      user: userId,
      prompt: promptId,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "Prompt already favorited");
    }

    throw error;
  }

  await syncPromptFavoriteStats(promptId);
  await trackActivity({
    userId,
    promptId,
    type: ACTIVITY_TYPES.FAVORITE,
    tagsSnapshot: prompt.tags,
    categorySnapshot: prompt.category,
  });

  return Prompt.findById(promptId).populate("author", "name avatarUrl").lean();
}

async function removeFavorite(promptId, userId) {
  const result = await Favorite.deleteOne({
    prompt: promptId,
    user: userId,
  });

  if (!result.deletedCount) {
    throw new ApiError(404, "Favorite not found");
  }

  await syncPromptFavoriteStats(promptId);

  return Prompt.findById(promptId).populate("author", "name avatarUrl").lean();
}

async function attachFavoriteState(prompts, userId) {
  if (!userId) {
    return prompts.map((prompt) => ({
      ...prompt,
      isFavorited: false,
    }));
  }

  const promptIds = prompts.map((prompt) => prompt._id).filter(Boolean);

  if (!promptIds.length) {
    return prompts;
  }

  const favorites = await Favorite.find({
    user: userId,
    prompt: { $in: promptIds },
  })
    .select("prompt")
    .lean();

  const favoritePromptIds = new Set(
    favorites.map((favorite) => favorite.prompt.toString())
  );

  return prompts.map((prompt) => ({
    ...prompt,
    isFavorited: favoritePromptIds.has(prompt._id.toString()),
  }));
}

module.exports = {
  addFavorite,
  removeFavorite,
  syncPromptFavoriteStats,
  attachFavoriteState,
};
