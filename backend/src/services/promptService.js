const mongoose = require("mongoose");
const Prompt = require("../models/Prompt");
const ApiError = require("../utils/ApiError");
const slugify = require("../utils/slugify");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");
const {
  PROMPT_STATUS,
  ACTIVITY_TYPES,
  EVALUATION_STATUS,
} = require("../constants/prompt");
const { trackActivity } = require("./activityService");
const { recalculatePromptRanking } = require("./rankingService");
const { triggerPromptEvaluation } = require("../jobs/promptEvaluationJob");
const { attachFavoriteState } = require("./favoriteService");
const { attachLikeState } = require("./likeService");
const { calculateEngagementScore } = require("./engagementService");

async function generateUniqueSlug(title) {
  const baseSlug = slugify(title);
  let candidate = baseSlug;
  let suffix = 1;

  while (await Prompt.exists({ slug: candidate })) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function buildPromptFilters(query) {
  const filters = {
    status: query.status || PROMPT_STATUS.PUBLISHED,
  };

  if (query.category) {
    filters.category = query.category;
  }

  if (query.author) {
    filters.author = query.author;
  }

  if (query.tags) {
    filters.tags = {
      $in: query.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };
  }

  if (query.search) {
    filters.$text = {
      $search: query.search,
    };
  }

  return filters;
}

function getSort(sortBy) {
  switch (sortBy) {
    case "newest":
      return { createdAt: -1 };
    case "rating":
      return { ratingAverage: -1, reviewCount: -1 };
    case "views":
      return { views: -1, rankingScore: -1 };
    case "aiScore":
      return { "aiScore.overall": -1, rankingScore: -1 };
    case "ranking":
    default:
      return { rankingScore: -1, createdAt: -1 };
  }
}

async function createPrompt(userId, payload) {
  const slug = await generateUniqueSlug(payload.title);
  const prompt = await Prompt.create({
    ...payload,
    slug,
    author: userId,
    evaluationStatus: EVALUATION_STATUS.PENDING,
  });

  await trackActivity({
    userId,
    promptId: prompt._id,
    type: ACTIVITY_TYPES.CREATE,
    tagsSnapshot: prompt.tags,
    categorySnapshot: prompt.category,
  });
  await recalculatePromptRanking(prompt._id);
  triggerPromptEvaluation(prompt._id);

  return Prompt.findById(prompt._id).populate("author", "name avatarUrl").lean();
}

async function listPrompts(query) {
  const { page, limit, skip } = getPagination(query);
  const filters = buildPromptFilters(query);
  const sort = getSort(query.sortBy);

  const [items, total] = await Promise.all([
    Prompt.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("author", "name avatarUrl")
      .lean(),
    Prompt.countDocuments(filters),
  ]);

  return {
    items,
    meta: buildPaginationMeta({ total, page, limit }),
  };
}

async function listPromptsForViewer(query, viewer) {
  const result = await listPrompts(query);
  const promptsWithFavoriteState = await attachFavoriteState(
    result.items,
    viewer?._id
  );

  return {
    ...result,
    items: await attachLikeState(promptsWithFavoriteState, viewer?._id),
  };
}

async function getPromptByIdOrSlug(identifier, viewer) {
  const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
  const query = isObjectId ? { _id: identifier } : { slug: identifier };
  const prompt = await Prompt.findOne(query)
    .populate("author", "name avatarUrl bio favoriteTags")
    .lean();

  if (!prompt) {
    throw new ApiError(404, "Prompt not found");
  }

  if (
    prompt.status !== PROMPT_STATUS.PUBLISHED &&
    (!viewer ||
      (prompt.author._id.toString() !== viewer._id.toString() &&
        viewer.role !== "admin"))
  ) {
    throw new ApiError(404, "Prompt not found");
  }

  const [promptWithFavoriteState] = await attachFavoriteState(
    [prompt],
    viewer?._id
  );
  const [enrichedPrompt] = await attachLikeState(
    [promptWithFavoriteState],
    viewer?._id
  );

  return enrichedPrompt;
}

async function updatePrompt(promptId, user, payload) {
  const prompt = await Prompt.findById(promptId);

  if (!prompt) {
    throw new ApiError(404, "Prompt not found");
  }

  const isOwner = prompt.author.toString() === user._id.toString();
  const isAdmin = user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You cannot update this prompt");
  }

  if (payload.title && payload.title !== prompt.title) {
    prompt.slug = await generateUniqueSlug(payload.title);
  }

  Object.assign(prompt, payload, {
    evaluationStatus: EVALUATION_STATUS.PENDING,
  });
  await prompt.save();
  await recalculatePromptRanking(prompt._id);
  triggerPromptEvaluation(prompt._id);

  return Prompt.findById(prompt._id).populate("author", "name avatarUrl").lean();
}

async function deletePrompt(promptId, user) {
  const prompt = await Prompt.findById(promptId);

  if (!prompt) {
    throw new ApiError(404, "Prompt not found");
  }

  const isOwner = prompt.author.toString() === user._id.toString();
  const isAdmin = user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You cannot delete this prompt");
  }

  await prompt.deleteOne();
}

async function recordPromptView(promptId, userId) {
  const prompt = await Prompt.findByIdAndUpdate(
    promptId,
    {
      $inc: {
        views: 1,
      },
    },
    { new: true }
  );

  if (!prompt) {
    throw new ApiError(404, "Prompt not found");
  }

  prompt.engagementScore = calculateEngagementScore(prompt);
  await prompt.save();
  await recalculatePromptRanking(prompt._id);

  if (userId) {
    await trackActivity({
      userId,
      promptId,
      type: ACTIVITY_TYPES.VIEW,
      tagsSnapshot: prompt.tags,
      categorySnapshot: prompt.category,
    });
  }

  return prompt;
}

async function listTrendingPrompts(limit = 10) {
  return Prompt.find({
    status: PROMPT_STATUS.PUBLISHED,
  })
    .sort({ rankingScore: -1, views: -1, createdAt: -1 })
    .limit(limit)
    .populate("author", "name avatarUrl")
    .lean();
}

async function listTrendingPromptsForViewer(limit, viewer) {
  const prompts = await listTrendingPrompts(limit);
  const promptsWithFavoriteState = await attachFavoriteState(
    prompts,
    viewer?._id
  );
  return attachLikeState(promptsWithFavoriteState, viewer?._id);
}

module.exports = {
  createPrompt,
  listPrompts,
  listPromptsForViewer,
  getPromptByIdOrSlug,
  updatePrompt,
  deletePrompt,
  recordPromptView,
  listTrendingPrompts,
  listTrendingPromptsForViewer,
};
