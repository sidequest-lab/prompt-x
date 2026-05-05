function normalize(number, min, max) {
  if (max === min) {
    return 0;
  }

  return (number - min) / (max - min);
}

function calculateRankingScore(prompt) {
  const aiScore = prompt?.aiScore?.overall || 0;
  const ratingAverage = prompt?.ratingAverage || 0;
  const reviewCount = prompt?.reviewCount || 0;
  const views = prompt?.views || 0;
  const engagementScore = prompt?.engagementScore || 0;
  const favoriteCount = prompt?.favoriteCount || 0;
  const likeCount = prompt?.likeCount || 0;
  const recencyHours = Math.max(
    (Date.now() - new Date(prompt.createdAt || Date.now()).getTime()) /
      (1000 * 60 * 60),
    1
  );
  const freshnessBoost = 1 / Math.log2(recencyHours + 2);

  const weightedScore =
    aiScore * 0.45 +
    ratingAverage * 20 * 0.25 +
    Math.log10(reviewCount + 1) * 12 * 0.1 +
    Math.log10(views + 1) * 10 * 0.1 +
    Math.log10(favoriteCount + 1) * 14 * 0.05 +
    Math.log10(likeCount + 1) * 12 * 0.08 +
    normalize(engagementScore, 0, 250) * 100 * 0.1 +
    freshnessBoost * 100 * 0.05;

  return Number.parseFloat(weightedScore.toFixed(4));
}

module.exports = {
  calculateRankingScore,
};
