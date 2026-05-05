const Redis = require("ioredis");
const env = require("./env");
const logger = require("./logger");

let redisClient = null;

async function connectRedis() {
  if (!env.redisUrl) {
    logger.info("Redis not configured, caching will run in pass-through mode");
    return null;
  }

  redisClient = new Redis(env.redisUrl, {
    maxRetriesPerRequest: 1,
    lazyConnect: true,
  });

  redisClient.on("error", (error) => {
    logger.error("Redis connection error", { error: error.message });
  });

  await redisClient.connect();
  logger.info("Redis connection established");

  return redisClient;
}

function getRedisClient() {
  return redisClient;
}

module.exports = {
  connectRedis,
  getRedisClient,
};
