const { createLogger, format, transports } = require("winston");
const env = require("./env");

const logger = createLogger({
  level: env.logLevel,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: {
    service: "promptx-backend",
    environment: env.nodeEnv,
  },
  transports: [
    new transports.Console({
      format:
        env.nodeEnv === "development"
          ? format.combine(
              format.colorize(),
              format.timestamp(),
              format.printf(({ level, message, timestamp, ...meta }) => {
                const metadata = Object.keys(meta).length
                  ? ` ${JSON.stringify(meta)}`
                  : "";

                return `${timestamp} ${level}: ${message}${metadata}`;
              })
            )
          : format.combine(format.timestamp(), format.json()),
    }),
  ],
});

module.exports = logger;
