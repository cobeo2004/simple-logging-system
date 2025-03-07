// Example usage of the experimental-logging-client library

const { LoggerClient } = require("experimental-logging-client");

// Initialize the logger
const logger = new LoggerClient({
  apiUrl: "https://logs.example.com/api/log",
  apiKey: "your-api-key",
  source: "example-application",
  // Optional configurations
  enabled: true,
  batchSize: 5,
  flushInterval: 10000, // 10 seconds
});

// Log different message types
logger.info("Application started", { version: "1.0.0" });
logger.debug("Configuration loaded", {
  config: { debug: true, environment: "development" },
});
logger.warn("API rate limit approaching", {
  endpoint: "/users",
  remaining: 10,
});

// Log an error with stack trace
try {
  throw new Error("Failed to process data");
} catch (error) {
  logger.error(error, { userId: "123", operation: "data-processing" });
}

// Access the current log queue
const pendingLogs = logger.getQueueLogs();
console.log("Pending logs:", pendingLogs.length);

// Manually flush logs to the server
logger
  .flush()
  .then(() => {
    console.log("Logs have been sent to the server");
  })
  .catch((err) => {
    console.error("Failed to send logs:", err);
  });

// When application is shutting down
process.on("SIGINT", () => {
  console.log("Cleaning up logger...");
  logger.destroy();
  process.exit(0);
});
