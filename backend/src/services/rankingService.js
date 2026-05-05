const Prompt = require("../models/Prompt");
const { calculateRankingScore } = require("../utils/ranking");

async function recalculatePromptRanking(promptId) {
  const prompt = await Prompt.findById(promptId);

  if (!prompt) {
    return null;
  }

  prompt.rankingScore = calculateRankingScore(prompt);
  await prompt.save();

  return prompt;
}

module.exports = {
  recalculatePromptRanking,
};
