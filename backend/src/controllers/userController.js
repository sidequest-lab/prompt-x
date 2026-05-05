const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");
const userService = require("../services/userService");

const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return sendSuccess(res, { user });
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateCurrentUser(req.user._id, req.body);
  return sendSuccess(res, { user });
});

const listCreators = asyncHandler(async (req, res) => {
  const result = await userService.listCreators(req.query);

  return sendSuccess(res, { creators: result.items, meta: result.meta });
});

const getCreator = asyncHandler(async (req, res) => {
  const creator = await userService.getCreatorProfile(req.params.id);
  return sendSuccess(res, { creator });
});

const getCreatorPrompts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { items, total } = await userService.getCreatorPrompts(req.params.id, {
    limit,
    skip,
  });

  return sendSuccess(res, {
    prompts: items,
    meta: buildPaginationMeta({ total, page, limit }),
  });
});

const getWorkspace = asyncHandler(async (req, res) => {
  const workspace = await userService.getCurrentWorkspace(req.user._id, req.query);
  return sendSuccess(res, workspace);
});

module.exports = {
  getUser,
  updateMe,
  listCreators,
  getCreator,
  getCreatorPrompts,
  getWorkspace,
};
