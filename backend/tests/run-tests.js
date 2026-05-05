const { spawnSync } = require("node:child_process");
const path = require("node:path");

const testFiles = [
  "health.test.js",
  "ranking.test.js",
  "heuristicEvaluation.test.js",
];

for (const testFile of testFiles) {
  const fullPath = path.join(__dirname, testFile);
  const result = spawnSync(process.execPath, [fullPath], {
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

console.log("All backend tests passed");
