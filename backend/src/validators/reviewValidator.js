const { z } = require("zod");

const createReviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().trim().max(1000).default(""),
});

module.exports = {
  createReviewSchema,
};
