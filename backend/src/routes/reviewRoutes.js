const express = require("express");
const controller = require("../controllers/reviewController");
const validate = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const { createReviewSchema } = require("../validators/reviewValidator");

const router = express.Router();

router.post(
  "/prompts/:id/reviews",
  requireAuth,
  validate(createReviewSchema),
  controller.addReview
);
router.get("/prompts/:id/reviews", controller.listReviews);
router.patch(
  "/reviews/:id",
  requireAuth,
  validate(createReviewSchema),
  controller.updateReview
);
router.delete("/reviews/:id", requireAuth, controller.deleteReview);

module.exports = router;
