const assert = require("node:assert/strict");
const { calculateRankingScore } = require("../src/utils/ranking");

const basePrompt = {
  aiScore: { overall: 80 },
  ratingAverage: 4.5,
  reviewCount: 12,
  views: 300,
  engagementScore: 120,
  favoriteCount: 0,
  likeCount: 0,
  createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
};

const withoutFavorites = calculateRankingScore(basePrompt);
const withFavorites = calculateRankingScore({
  ...basePrompt,
  favoriteCount: 20,
});

assert.equal(typeof withoutFavorites, "number");
assert.ok(withFavorites > withoutFavorites, "favorites should improve ranking");

const withLikes = calculateRankingScore({
  ...basePrompt,
  likeCount: 30,
});

assert.ok(withLikes > withoutFavorites, "likes should improve ranking");

console.log("ranking.test.js passed");
