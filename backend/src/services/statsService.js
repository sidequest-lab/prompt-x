const Prompt = require("../models/Prompt");
const User = require("../models/User");
const Review = require("../models/Review");
const { PROMPT_STATUS } = require("../constants/prompt");

async function getOverviewStats() {
  const [promptCount, creatorCount, reviewAggregate] = await Promise.all([
    Prompt.countDocuments({ status: PROMPT_STATUS.PUBLISHED }),
    User.countDocuments(),
    Review.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]),
  ]);

  return {
    promptCount,
    creatorCount,
    averageRating: Number((reviewAggregate[0]?.averageRating || 0).toFixed(2)),
    totalReviews: reviewAggregate[0]?.totalReviews || 0,
  };
}

module.exports = {
  getOverviewStats,
};
