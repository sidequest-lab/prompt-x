process.env.JWT_ACCESS_SECRET = "test-access-secret";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret";

const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../app");

(async () => {
  const response = await request(app).get("/health");

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.status, "ok");

  console.log("health.test.js passed");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
