const mongoose = require("mongoose");
const env = require("./env");
const logger = require("./logger");

async function connectDatabase() {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.mongodbUri, {
    maxPoolSize: 20,
    autoIndex: env.nodeEnv !== "production",
  });

  logger.info("MongoDB connection established");
}

module.exports = {
  connectDatabase,
};
