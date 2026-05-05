const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const categoryService = require("../services/categoryService");

const listCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.listCategories(req.query);
  return sendSuccess(res, { categories: result.items, meta: result.meta });
});

module.exports = {
  listCategories,
};
