const Prompt = require("../models/Prompt");
const UserActivity = require("../models/UserActivity");
const { PROMPT_STATUS } = require("../constants/prompt");
const { attachFavoriteState } = require("./favoriteService");
const { attachLikeState } = require("./likeService");

const ACTIVITY_WEIGHTS = {
  view: 1,
  create: 1.5,
  like: 3,
  review: 4,
  favorite: 5,
};

function getRecencyMultiplier(createdAt) {
  const ageDays = Math.max(
    (Date.now() - new Date(createdAt || Date.now()).getTime()) /
      (1000 * 60 * 60 * 24),
    0
  );

  if (ageDays <= 1) {
    return 1;
  }

  if (ageDays <= 7) {
    return 0.7;
  }

  if (ageDays <= 30) {
    return 0.4;
  }

  return 0.2;
}

function incrementWeight(map, key, weight) {
  const normalizedKey = String(key || "").trim();

  if (!normalizedKey) {
    return;
  }

  map.set(normalizedKey, (map.get(normalizedKey) || 0) + weight);
}

function buildPreferenceWeights(user, activities) {
  const tagWeights = new Map();
  const categoryWeights = new Map();

  for (const tag of user.favoriteTags || []) {
    incrementWeight(tagWeights, tag, 4);
  }

  for (const activity of activities) {
    const activityWeight = ACTIVITY_WEIGHTS[activity.type] || 1;
    const weight = activityWeight * getRecencyMultiplier(activity.createdAt);

    for (const tag of activity.tagsSnapshot || []) {
      incrementWeight(tagWeights, tag, weight);
    }

    incrementWeight(categoryWeights, activity.categorySnapshot, weight * 1.35);
  }

  return {
    tagWeights,
    categoryWeights,
  };
}

function getTopKeys(map, limit) {
  return [...map.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([key]) => key);
}

function getPromptRecommendationScore(prompt, tagWeights, categoryWeights) {
  const tagMatchScore = (prompt.tags || []).reduce(
    (total, tag) => total + (tagWeights.get(tag) || 0),
    0
  );
  const categoryMatchScore = categoryWeights.get(prompt.category) || 0;
  const qualityScore = (prompt.aiScore?.overall || 0) * 0.18;
  const rankingBoost = Math.min(prompt.rankingScore || 0, 1000) * 0.04;
  const ratingBoost = (prompt.ratingAverage || 0) * 2.5;
  const freshnessBoost = getRecencyMultiplier(prompt.createdAt) * 3;

  return Number(
    (
      tagMatchScore * 8 +
      categoryMatchScore * 10 +
      qualityScore +
      rankingBoost +
      ratingBoost +
      freshnessBoost
    ).toFixed(4)
  );
}

function getRecommendationReason(prompt, tagWeights, categoryWeights) {
  const matchedTags = (prompt.tags || [])
    .filter((tag) => tagWeights.has(tag))
    .sort((left, right) => (tagWeights.get(right) || 0) - (tagWeights.get(left) || 0))
    .slice(0, 2);

  if (categoryWeights.has(prompt.category) && matchedTags.length) {
    return `Because you interacted with ${prompt.category} and ${matchedTags.join(", ")} prompts`;
  }

  if (categoryWeights.has(prompt.category)) {
    return `Because you often explore ${prompt.category} prompts`;
  }

  if (matchedTags.length) {
    return `Because you showed interest in ${matchedTags.join(", ")}`;
  }

  return "Recommended from top-ranked marketplace activity";
}

async function attachViewerState(prompts, userId) {
  const promptsWithFavoriteState = await attachFavoriteState(prompts, userId);
  return attachLikeState(promptsWithFavoriteState, userId);
}

async function getFallbackRecommendations(limit, excludePromptIds = []) {
  return Prompt.find({
    status: PROMPT_STATUS.PUBLISHED,
    _id: { $nin: excludePromptIds },
  })
    .sort({ rankingScore: -1, createdAt: -1 })
    .limit(limit)
    .populate("author", "name avatarUrl")
    .lean();
}

async function getRecommendedPrompts(user, limit = 10) {
  if (!user) {
    const prompts = await getFallbackRecommendations(limit);
    return attachViewerState(
      prompts.map((prompt) => ({
        ...prompt,
        recommendationScore: prompt.rankingScore || 0,
        recommendationReason: "Popular with the PromptX community",
      })),
      null
    );
  }

  const activities = await UserActivity.find({ user: user._id })
    .sort({ createdAt: -1 })
    .limit(150)
    .lean();

  const interactedPromptIds = [
    ...new Set(activities.map((activity) => activity.prompt?.toString()).filter(Boolean)),
  ];
  const { tagWeights, categoryWeights } = buildPreferenceWeights(user, activities);
  const preferredTags = getTopKeys(tagWeights, 12);
  const preferredCategories = getTopKeys(categoryWeights, 8);

  const candidateQuery = {
    status: PROMPT_STATUS.PUBLISHED,
    _id: { $nin: interactedPromptIds },
  };

  if (preferredTags.length || preferredCategories.length) {
    candidateQuery.$or = [];

    if (preferredTags.length) {
      candidateQuery.$or.push({ tags: { $in: preferredTags } });
    }

    if (preferredCategories.length) {
      candidateQuery.$or.push({ category: { $in: preferredCategories } });
    }
  }

  let candidates = await Prompt.find(candidateQuery)
    .sort({ rankingScore: -1, createdAt: -1 })
    .limit(Math.max(limit * 5, 30))
    .populate("author", "name avatarUrl")
    .lean();

  if (candidates.length < limit) {
    const fallbackPrompts = await getFallbackRecommendations(
      limit * 2,
      interactedPromptIds.concat(candidates.map((prompt) => prompt._id.toString()))
    );
    candidates = candidates.concat(fallbackPrompts);
  }

  const scoredPrompts = candidates
    .map((prompt) => ({
      ...prompt,
      recommendationScore: getPromptRecommendationScore(
        prompt,
        tagWeights,
        categoryWeights
      ),
      recommendationReason: getRecommendationReason(
        prompt,
        tagWeights,
        categoryWeights
      ),
    }))
    .sort(
      (left, right) =>
        right.recommendationScore - left.recommendationScore ||
        right.rankingScore - left.rankingScore
    )
    .slice(0, limit);

  if (scoredPrompts.length < limit) {
    const existingIds = scoredPrompts.map((prompt) => prompt._id.toString());
    const relaxedFallback = await getFallbackRecommendations(
      limit - scoredPrompts.length,
      existingIds
    );

    scoredPrompts.push(
      ...relaxedFallback.map((prompt) => ({
        ...prompt,
        recommendationScore: prompt.rankingScore || 0,
        recommendationReason:
          "Popular fallback because your activity already covers most prompts",
      }))
    );
  }

  return attachViewerState(scoredPrompts, user._id);
}

module.exports = {
  getRecommendedPrompts,
};
