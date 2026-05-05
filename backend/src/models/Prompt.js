const mongoose = require("mongoose");
const {
  PROMPT_STATUS,
  EVALUATION_STATUS,
} = require("../constants/prompt");

const promptSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 160,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 1000,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 10000,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(PROMPT_STATUS),
      default: PROMPT_STATUS.PUBLISHED,
      index: true,
    },
    aiScore: {
      clarity: { type: Number, default: 0 },
      creativity: { type: Number, default: 0 },
      relevance: { type: Number, default: 0 },
      overall: { type: Number, default: 0, index: true },
    },
    evaluationStatus: {
      type: String,
      enum: Object.values(EVALUATION_STATUS),
      default: EVALUATION_STATUS.PENDING,
      index: true,
    },
    evaluationSummary: {
      type: String,
      default: "",
      maxlength: 1000,
    },
    evaluationSource: {
      type: String,
      default: "pending",
      index: true,
    },
    ratingAverage: {
      type: Number,
      default: 0,
      index: true,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
      index: true,
    },
    favoriteCount: {
      type: Number,
      default: 0,
      index: true,
    },
    likeCount: {
      type: Number,
      default: 0,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
      index: true,
    },
    engagementScore: {
      type: Number,
      default: 0,
    },
    rankingScore: {
      type: Number,
      default: 0,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

promptSchema.index({ status: 1, rankingScore: -1 });
promptSchema.index({ status: 1, createdAt: -1 });
promptSchema.index({ status: 1, category: 1, rankingScore: -1 });
promptSchema.index({ status: 1, favoriteCount: -1, rankingScore: -1 });
promptSchema.index({ status: 1, likeCount: -1, rankingScore: -1 });
promptSchema.index({
  title: "text",
  description: "text",
  tags: "text",
  category: "text",
});

module.exports = mongoose.model("Prompt", promptSchema);
