function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function tokenize(text) {
  return String(text || "").toLowerCase().match(/[a-z0-9]+/g) || [];
}

function lexicalDiversity(tokens) {
  if (!tokens.length) {
    return 0;
  }

  return new Set(tokens).size / tokens.length;
}

function overlapRatio(sourceTokens, targetTokens) {
  if (!sourceTokens.length || !targetTokens.length) {
    return 0;
  }

  const targetSet = new Set(targetTokens);
  let matches = 0;

  for (const token of sourceTokens) {
    if (targetSet.has(token)) {
      matches += 1;
    }
  }

  return matches / sourceTokens.length;
}

function evaluatePromptHeuristically(prompt) {
  const title = String(prompt.title || "");
  const description = String(prompt.description || "");
  const content = String(prompt.content || "");
  const tags = Array.isArray(prompt.tags) ? prompt.tags : [];
  const category = String(prompt.category || "");

  const descriptionTokens = tokenize(description);
  const contentTokens = tokenize(content);
  const titleTokens = tokenize(title);
  const tagTokens = tokenize(tags.join(" "));
  const categoryTokens = tokenize(category);

  const sentenceCount = Math.max(
    description.split(/[.!?]+/).filter(Boolean).length +
      content.split(/[.!?]+/).filter(Boolean).length,
    1
  );
  const contentWordCount = contentTokens.length;
  const diversity = lexicalDiversity(contentTokens);
  const titleOverlap = overlapRatio(
    titleTokens,
    descriptionTokens.concat(contentTokens)
  );
  const tagOverlap = overlapRatio(
    tagTokens,
    descriptionTokens.concat(contentTokens)
  );
  const categoryOverlap = overlapRatio(
    categoryTokens,
    descriptionTokens.concat(contentTokens)
  );

  const clarity =
    42 +
    Math.min(description.length / 8, 16) +
    Math.min(contentWordCount / 20, 18) +
    Math.min(sentenceCount * 1.5, 10) +
    Math.min(tags.length * 2, 8);

  const creativity =
    35 +
    diversity * 28 +
    Math.min(new Set(contentTokens).size / 3, 18) +
    Math.min(tags.length * 1.5, 8);

  const relevance =
    38 +
    titleOverlap * 24 +
    tagOverlap * 20 +
    categoryOverlap * 18 +
    Math.min(descriptionTokens.length / 4, 8);

  const normalized = {
    clarity: clampScore(clarity),
    creativity: clampScore(creativity),
    relevance: clampScore(relevance),
  };

  const overall = clampScore(
    normalized.clarity * 0.4 +
      normalized.creativity * 0.25 +
      normalized.relevance * 0.35
  );

  const weakestDimension = Object.entries(normalized).sort(
    (left, right) => left[1] - right[1]
  )[0][0];
  const strongestDimension = Object.entries(normalized).sort(
    (left, right) => right[1] - left[1]
  )[0][0];

  return {
    ...normalized,
    overall,
    summary: `Heuristic evaluation completed. Strongest area: ${strongestDimension}. Needs the most improvement: ${weakestDimension}.`,
    source: "heuristic",
  };
}

module.exports = {
  evaluatePromptHeuristically,
};
