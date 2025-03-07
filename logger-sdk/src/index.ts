/**
 * Simple JavaScript logger client for sending logs to the centralized logging service
 */

export interface LogConfig {
  apiUrl: string;
  apiKey: string;
  source: string;
  enabled?: boolean;
  batchSize?: number;
  flushInterval?: number;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  source: string;
  data: Record<string, any>;
}

export class LoggerClient {
  private config: {
    apiUrl: string;
    apiKey: string;
    source: string;
    enabled: boolean;
    batchSize: number;
    flushInterval: number;
  };
  private queue: LogEntry[];
  private flushInterval: ReturnType<typeof setInterval> | null = null;

  /**
   * Initialize the logger
   * @param {Object} config - Configuration options
   * @param {string} config.apiUrl - The URL of the logging API
   * @param {string} config.apiKey - The API key for authentication
   * @param {string} config.source - The source identifier for this application
   * @param {boolean} config.enabled - Whether logging is enabled (default: true)
   * @param {number} config.batchSize - Number of logs to batch before sending (default: 10)
   * @param {number} config.flushInterval - Milliseconds to wait before flushing logs (default: 5000)
   */
  constructor(config: LogConfig) {
    this.config = {
      apiUrl: config.apiUrl || "",
      apiKey: config.apiKey || "",
      source: config.source || "unknown",
      enabled: config.enabled !== false,
      batchSize: config.batchSize || 10,
      flushInterval: config.flushInterval || 5000,
    };

    // Validate required config
    if (!this.config.apiUrl) {
      console.error("LoggerClient: apiUrl is required");
      this.config.enabled = false;
    }

    if (!this.config.apiKey) {
      console.error("LoggerClient: apiKey is required");
      this.config.enabled = false;
    }

    // Initialize batch queue
    this.queue = [];

    // Set up automatic flush interval
    if (this.config.enabled) {
      this.flushInterval = setInterval(
        () => this.flush(),
        this.config.flushInterval
      );

      // Add window unload handler to flush logs before page close
      if (typeof window !== "undefined") {
        window.addEventListener("beforeunload", () => this.flush());
      }
    }
  }

  /**
   * Log an info message
   * @param {string} message - The log message
   * @param {Object} data - Optional additional data
   */
  info(message: string, data?: Record<string, any>): void {
    this.log("info", message, data);
  }

  /**
   * Log a warning message
   * @param {string} message - The log message
   * @param {Object} data - Optional additional data
   */
  warn(message: string, data?: Record<string, any>): void {
    this.log("warn", message, data);
  }

  /**
   * Log an error message
   * @param {string|Error} messageOrError - The log message or Error object
   * @param {Object} data - Optional additional data
   */
  error(messageOrError: string | Error, data: Record<string, any> = {}): void {
    let message = messageOrError as string;
    let errorData = { ...data };

    // Handle Error objects
    if (messageOrError instanceof Error) {
      message = messageOrError.message;
      errorData = {
        ...errorData,
        name: messageOrError.name,
        stack: messageOrError.stack,
      };
    }

    this.log("error", message, errorData);
  }

  /**
   * Log a debug message
   * @param {string} message - The log message
   * @param {Object} data - Optional additional data
   */
  debug(message: string, data?: Record<string, any>): void {
    this.log("debug", message, data);
  }

  /**
   * Internal method to queue a log
   * @param {string} level - The log level
   * @param {string} message - The log message
   * @param {Object} data - Optional additional data
   */
  log(level: string, message: string, data: Record<string, any> = {}): void {
    if (!this.config.enabled) return;

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      source: this.config.source,
      data,
    };

    this.queue.push(logEntry);

    // Check if we should flush based on batch size
    if (this.queue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  /**
   * Send queued logs to the server
   * @returns {Promise} - Promise that resolves when logs are sent
   */
  async flush(): Promise<void> {
    if (!this.config.enabled || this.queue.length === 0) return;

    const logs = [...this.queue];
    this.queue = [];

    try {
      // Send logs one by one to match the API's single log entry format
      // In a production system, you might want to add a batch endpoint
      const promises = logs.map((log) =>
        fetch(this.config.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": this.config.apiKey,
          },
          body: JSON.stringify(log),
        })
      );

      await Promise.all(promises);
    } catch (error) {
      console.error("LoggerClient: Failed to send logs", error);

      // Re-queue failed logs (up to batch size to prevent excessive queuing)
      if (this.queue.length + logs.length <= this.config.batchSize * 2) {
        this.queue = [...logs, ...this.queue];
      }
    }
  }

  /**
   * Clean up resources when logger is no longer needed
   */
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }

    // Final flush attempt
    this.flush();

    if (typeof window !== "undefined") {
      window.removeEventListener("beforeunload", () => this.flush());
    }
  }

  /**
   * Get the current queue of logs
   * @returns {LogEntry[]} - Array of queued log entries
   */
  getQueueLogs(): LogEntry[] {
    return this.queue;
  }
}

// Default export for easier imports
export default LoggerClient;

// Also provide named exports for those who prefer them
export { LoggerClient as Logger };
