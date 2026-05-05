const dotenv = require("dotenv");

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number.parseInt(process.env.PORT || "4000", 10),
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/promptx",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "",
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  groqApiKey: process.env.GROQ_API_KEY || "",
  groqModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  groqTimeoutMs: Number.parseInt(
    process.env.GROQ_TIMEOUT_MS || process.env.OPENAI_TIMEOUT_MS || "15000",
    10
  ),
  openAiApiKey: process.env.OPENAI_API_KEY || "",
  openAiModel: process.env.OPENAI_MODEL || "gpt-4.1-mini",
  openAiTimeoutMs: Number.parseInt(process.env.OPENAI_TIMEOUT_MS || "15000", 10),
  redisUrl: process.env.REDIS_URL || "",
  logLevel: process.env.LOG_LEVEL || "info",
};

const missingSecrets = [];

if (!env.jwtAccessSecret) {
  missingSecrets.push("JWT_ACCESS_SECRET");
}

if (!env.jwtRefreshSecret) {
  missingSecrets.push("JWT_REFRESH_SECRET");
}

if (missingSecrets.length) {
  throw new Error(`Missing required secrets: ${missingSecrets.join(", ")}`);
}

module.exports = env;
