const assert = require("node:assert/strict");
const { evaluatePromptHeuristically } = require("../src/utils/heuristicEvaluation");

const evaluation = evaluatePromptHeuristically({
  title: "Advanced SEO Blog Prompt",
  description:
    "Write a high-quality SEO blog post with headings, outline, search intent, and CTA.",
  content:
    "Create a detailed article prompt with keyword goals, structure, tone, audience, examples, and revision instructions.",
  category: "Writing",
  tags: ["seo", "blog", "marketing"],
});

assert.ok(evaluation.clarity >= 0 && evaluation.clarity <= 100);
assert.ok(evaluation.creativity >= 0 && evaluation.creativity <= 100);
assert.ok(evaluation.relevance >= 0 && evaluation.relevance <= 100);
assert.ok(evaluation.overall >= 0 && evaluation.overall <= 100);
assert.equal(evaluation.source, "heuristic");
assert.ok(evaluation.summary.length > 0);

console.log("heuristicEvaluation.test.js passed");
