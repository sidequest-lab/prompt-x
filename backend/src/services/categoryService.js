const Prompt = require("../models/Prompt");
const { PROMPT_STATUS } = require("../constants/prompt");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");

async function listCategories(query = {}) {
  const { page, limit, skip } = getPagination(query);
  const search = query.search?.trim();
  const pipeline = [
    {
      $match: {
        status: PROMPT_STATUS.PUBLISHED,
      },
    },
    {
      $group: {
        _id: "$category",
        promptCount: { $sum: 1 },
        averageAiScore: { $avg: "$aiScore.overall" },
        averageRating: { $avg: "$ratingAverage" },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$_id",
        slug: {
          $replaceAll: {
            input: { $toLower: "$_id" },
            find: " ",
            replacement: "-",
          },
        },
        promptCount: 1,
        averageAiScore: { $round: ["$averageAiScore", 2] },
        averageRating: { $round: ["$averageRating", 2] },
      },
    },
  ];

  if (search) {
    pipeline.push({
      $match: {
        name: {
          $regex: search,
          $options: "i",
        },
      },
    });
  }

  pipeline.push(
    { $sort: { promptCount: -1, name: 1 } },
    {
      $facet: {
        items: [{ $skip: skip }, { $limit: limit }],
        meta: [{ $count: "total" }],
      },
    }
  );

  const [result] = await Prompt.aggregate(pipeline);
  const items = result?.items || [];
  const total = result?.meta?.[0]?.total || 0;

  return {
    items,
    meta: buildPaginationMeta({ total, page, limit }),
  };
}

module.exports = {
  listCategories,
};
