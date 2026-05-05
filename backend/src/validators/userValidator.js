const { z } = require("zod");

const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  bio: z.string().trim().max(500).optional(),
  avatarUrl: z.string().trim().url().or(z.literal("")).optional(),
  favoriteTags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
});

const creatorListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().trim().optional(),
});

const workspaceQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(24).optional(),
});

module.exports = {
  updateProfileSchema,
  creatorListQuerySchema,
  workspaceQuerySchema,
};
