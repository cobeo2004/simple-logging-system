# Simple Logging Client

A simple JavaScript/TypeScript logger client for sending logs to a centralized logging service.

## Installation

```bash
npm install simple-logging-client
```

Or with yarn:

```bash
yarn add simple-logging-client
```

## Usage

```typescript
import LoggerClient from "simple-logging-client";

// Initialize the logger
const logger = new LoggerClient({
  apiUrl: "https://logs.example.com/api/log",
  apiKey: "your-api-key",
  source: "web-app-frontend",
  // Optional configurations
  enabled: true, // Default: true
  batchSize: 10, // Default: 10
  flushInterval: 5000, // Default: 5000ms (5 seconds)
});

// Log different types of messages
logger.info("User logged in", { userId: "123" });
logger.warn("API call rate limit approaching", { endpoint: "/users" });
logger.error(new Error("Failed to load data"));
logger.debug("Rendering component", { componentId: "user-profile" });

// Manually flush logs (normally happens automatically)
await logger.flush();

// Clean up when done
logger.destroy();
```

## API Reference

### Configuration

The `LoggerClient` constructor accepts a configuration object with the following properties:

| Property      | Type    | Required | Default | Description                                                  |
| ------------- | ------- | -------- | ------- | ------------------------------------------------------------ |
| apiUrl        | string  | Yes      | -       | The URL of the logging API endpoint                          |
| apiKey        | string  | Yes      | -       | API key for authentication                                   |
| source        | string  | Yes      | -       | Identifier for the source of logs (e.g., 'web-app-frontend') |
| enabled       | boolean | No       | true    | Whether logging is enabled                                   |
| batchSize     | number  | No       | 10      | Number of logs to batch before sending                       |
| flushInterval | number  | No       | 5000    | Milliseconds to wait before auto-flushing logs               |

### Methods

- **info(message, data?)**: Log an informational message
- **warn(message, data?)**: Log a warning message
- **error(messageOrError, data?)**: Log an error (accepts string or Error object)
- **debug(message, data?)**: Log a debug message
- **log(level, message, data?)**: Internal method to queue a log
- **flush()**: Send queued logs to the server (returns a Promise)
- **destroy()**: Clean up resources when logger is no longer needed
- **getQueueLogs()**: Get the current queue of logs

## License

MIT
