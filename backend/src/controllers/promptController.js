const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const promptService = require("../services/promptService");
const recommendationService = require("../services/recommendationService");
const { evaluatePrompt } = require("../services/evaluationService");
const favoriteService = require("../services/favoriteService");
const likeService = require("../services/likeService");

const createPrompt = asyncHandler(async (req, res) => {
  const prompt = await promptService.createPrompt(req.user._id, req.body);
  return sendSuccess(res, { prompt }, 201);
});

const listPrompts = asyncHandler(async (req, res) => {
  const result = await promptService.listPromptsForViewer(req.query, req.user);
  return sendSuccess(res, { prompts: result.items, meta: result.meta });
});

const getPrompt = asyncHandler(async (req, res) => {
  const prompt = await promptService.getPromptByIdOrSlug(
    req.params.idOrSlug,
    req.user
  );
  return sendSuccess(res, { prompt });
});

const updatePrompt = asyncHandler(async (req, res) => {
  const prompt = await promptService.updatePrompt(
    req.params.id,
    req.user,
    req.body
  );
  return sendSuccess(res, { prompt });
});

const deletePrompt = asyncHandler(async (req, res) => {
  await promptService.deletePrompt(req.params.id, req.user);
  return sendSuccess(res, { message: "Prompt deleted successfully" });
});

const recordView = asyncHandler(async (req, res) => {
  const prompt = await promptService.recordPromptView(
    req.params.id,
    req.user?._id
  );
  return sendSuccess(res, { prompt });
});

const listTrending = asyncHandler(async (req, res) => {
  const prompts = await promptService.listTrendingPromptsForViewer(
    10,
    req.user
  );
  return sendSuccess(res, { prompts });
});

const listRecommended = asyncHandler(async (req, res) => {
  const prompts = await recommendationService.getRecommendedPrompts(
    req.user,
    Number.parseInt(req.query.limit || "10", 10)
  );
  return sendSuccess(res, { prompts });
});

const triggerEvaluation = asyncHandler(async (req, res) => {
  const prompt = await evaluatePrompt(req.params.id);
  return sendSuccess(res, { prompt });
});

const favoritePrompt = asyncHandler(async (req, res) => {
  const prompt = await favoriteService.addFavorite(req.params.id, req.user._id);
  return sendSuccess(res, { prompt });
});

const likePrompt = asyncHandler(async (req, res) => {
  const prompt = await likeService.addLike(req.params.id, req.user._id);
  return sendSuccess(res, { prompt });
});

const unfavoritePrompt = asyncHandler(async (req, res) => {
  const prompt = await favoriteService.removeFavorite(
    req.params.id,
    req.user._id
  );
  return sendSuccess(res, { prompt });
});

const unlikePrompt = asyncHandler(async (req, res) => {
  const prompt = await likeService.removeLike(req.params.id, req.user._id);
  return sendSuccess(res, { prompt });
});

module.exports = {
  createPrompt,
  listPrompts,
  getPrompt,
  updatePrompt,
  deletePrompt,
  recordView,
  listTrending,
  listRecommended,
  triggerEvaluation,
  favoritePrompt,
  likePrompt,
  unfavoritePrompt,
  unlikePrompt,
};
