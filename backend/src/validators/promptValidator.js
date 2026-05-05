const { z } = require("zod");
const { PROMPT_STATUS } = require("../constants/prompt");

const promptBaseSchema = {
  title: z.string().trim().min(5).max(160),
  description: z.string().trim().min(20).max(1000),
  content: z.string().trim().min(20).max(10000),
  category: z.string().trim().min(2).max(60),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  status: z.enum(Object.values(PROMPT_STATUS)).optional(),
};

const createPromptSchema = z.object(promptBaseSchema);

const updatePromptSchema = z.object({
  title: promptBaseSchema.title.optional(),
  description: promptBaseSchema.description.optional(),
  content: promptBaseSchema.content.optional(),
  category: promptBaseSchema.category.optional(),
  tags: promptBaseSchema.tags.optional(),
  status: z.enum(Object.values(PROMPT_STATUS)).optional(),
});

const promptQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  tags: z.string().trim().optional(),
  author: z.string().trim().optional(),
  sortBy: z
    .enum(["ranking", "newest", "rating", "views", "aiScore"])
    .optional(),
  status: z.enum(Object.values(PROMPT_STATUS)).optional(),
});

module.exports = {
  createPromptSchema,
  updatePromptSchema,
  promptQuerySchema,
};
