const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

likeSchema.index({ user: 1, prompt: 1 }, { unique: true });
likeSchema.index({ prompt: 1, createdAt: -1 });

module.exports = mongoose.model("Like", likeSchema);
