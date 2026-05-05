const mongoose = require("mongoose");
const { ACTIVITY_TYPES } = require("../constants/prompt");

const userActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    prompt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prompt",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(ACTIVITY_TYPES),
      required: true,
      index: true,
    },
    tagsSnapshot: {
      type: [String],
      default: [],
    },
    categorySnapshot: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

userActivitySchema.index({ user: 1, createdAt: -1 });
userActivitySchema.index({ user: 1, type: 1, createdAt: -1 });

module.exports = mongoose.model("UserActivity", userActivitySchema);
