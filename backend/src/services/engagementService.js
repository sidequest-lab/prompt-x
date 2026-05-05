function calculateEngagementScore(prompt) {
  return (
    (prompt?.views || 0) +
    (prompt?.reviewCount || 0) * 3 +
    (prompt?.favoriteCount || 0) * 5 +
    (prompt?.likeCount || 0) * 4
  );
}

module.exports = {
  calculateEngagementScore,
};
