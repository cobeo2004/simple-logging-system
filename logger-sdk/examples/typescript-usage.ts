// Example usage of the simple-logging-client library in TypeScript

import LoggerClient, { LogConfig, LogEntry } from "simple-logging-client";

// Define configuration with TypeScript types
const config: LogConfig = {
  apiUrl: "https://logs.example.com/api/log",
  apiKey: "your-api-key",
  source: "typescript-example",
  enabled: true,
  batchSize: 5,
  flushInterval: 10000, // 10 seconds
};

// Initialize the logger
const logger = new LoggerClient(config);

// Custom data types for your logs
interface UserData {
  userId: string;
  username: string;
  role: string;
}

interface PerformanceData {
  operation: string;
  duration: number;
  memory?: number;
}

// Log with strongly typed data
const userData: UserData = {
  userId: "123456",
  username: "johndoe",
  role: "admin",
};

logger.info("User logged in", userData);

// Log performance metrics
const performanceData: PerformanceData = {
  operation: "database-query",
  duration: 235, // ms
  memory: 15420, // kb
};

logger.debug("Operation completed", performanceData);

// Error handling with TypeScript
try {
  throw new Error("Authentication failed");
} catch (error) {
  // The error parameter is automatically typed as Error
  logger.error(error as Error, { userId: userData.userId });
}

// Get current queue logs and type them
const pendingLogs: LogEntry[] = logger.getQueueLogs();
console.log(`Pending logs: ${pendingLogs.length}`);

// Using async/await with flush
async function sendLogsAndExit(): Promise<void> {
  try {
    await logger.flush();
    console.log("Logs have been sent to the server");
  } catch (error) {
    console.error("Failed to send logs:", error);
  } finally {
    logger.destroy();
    process.exit(0);
  }
}

// When application is shutting down
process.on("SIGINT", sendLogsAndExit);
