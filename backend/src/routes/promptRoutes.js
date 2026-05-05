const express = require("express");
const controller = require("../controllers/promptController");
const validate = require("../middleware/validate");
const { requireAuth, optionalAuth } = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const { ROLES } = require("../constants/roles");
const {
  createPromptSchema,
  updatePromptSchema,
  promptQuerySchema,
} = require("../validators/promptValidator");

const router = express.Router();

router.get(
  "/prompts",
  optionalAuth,
  validate(promptQuerySchema, "query"),
  controller.listPrompts
);
router.get("/prompts/trending", optionalAuth, controller.listTrending);
router.get("/prompts/recommended", optionalAuth, controller.listRecommended);
router.get("/prompts/:idOrSlug", optionalAuth, controller.getPrompt);
router.post(
  "/prompts",
  requireAuth,
  validate(createPromptSchema),
  controller.createPrompt
);
router.patch(
  "/prompts/:id",
  requireAuth,
  validate(updatePromptSchema),
  controller.updatePrompt
);
router.delete("/prompts/:id", requireAuth, controller.deletePrompt);
router.post("/prompts/:id/view", optionalAuth, controller.recordView);
router.post("/prompts/:id/like", requireAuth, controller.likePrompt);
router.delete("/prompts/:id/like", requireAuth, controller.unlikePrompt);
router.post("/prompts/:id/favorite", requireAuth, controller.favoritePrompt);
router.delete("/prompts/:id/favorite", requireAuth, controller.unfavoritePrompt);
router.post(
  "/prompts/:id/evaluate",
  requireAuth,
  authorize(ROLES.ADMIN),
  controller.triggerEvaluation
);

module.exports = router;
