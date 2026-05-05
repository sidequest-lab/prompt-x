const express = require("express");
const controller = require("../controllers/userController");
const validate = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const {
  updateProfileSchema,
  creatorListQuerySchema,
  workspaceQuerySchema,
} = require("../validators/userValidator");

const router = express.Router();

router.get("/creators", validate(creatorListQuerySchema, "query"), controller.listCreators);
router.get("/creators/:id", controller.getCreator);
router.get(
  "/users/me/workspace",
  requireAuth,
  validate(workspaceQuerySchema, "query"),
  controller.getWorkspace
);
router.get("/users/:id", controller.getUser);
router.get("/users/:id/prompts", controller.getCreatorPrompts);
router.patch(
  "/users/me",
  requireAuth,
  validate(updateProfileSchema),
  controller.updateMe
);

module.exports = router;
