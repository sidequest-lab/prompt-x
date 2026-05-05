const app = require("./app");
const env = require("./src/config/env");
const logger = require("./src/config/logger");
const { connectDatabase } = require("./src/config/database");
const { connectRedis } = require("./src/config/redis");
const { resumeEvaluationQueue } = require("./src/jobs/promptEvaluationJob");

let server;

async function startServer() {
  await connectDatabase();
  await connectRedis();
  await resumeEvaluationQueue();

  server = app.listen(env.port, () => {
    logger.info(`PromptX backend listening on port ${env.port}`);
  });
}

function shutdown(signal) {
  logger.info(`Received ${signal}, shutting down gracefully`);

  if (server) {
    server.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (error) => {
  logger.error("Unhandled promise rejection", {
    error: error.message,
    stack: error.stack,
  });
  shutdown("unhandledRejection");
});
process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", {
    error: error.message,
    stack: error.stack,
  });
  shutdown("uncaughtException");
});

startServer().catch((error) => {
  logger.error("Failed to start server", {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});
