/**
 * Logger Service for BuyRight App
 * 
 * Provides centralized logging with different levels and environment-aware behavior.
 * Replaces scattered console.log statements throughout the application.
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private level: LogLevel;
  private enableConsole: boolean;
  private logs: LogEntry[] = [];
  private maxLogs = 50; // Reduced from 1000 for ephemeral compliance
  private sensitiveDataCleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Set log level based on environment
    this.level = process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO;
    this.enableConsole = process.env.NODE_ENV === 'development';
    
    // Set up automatic cleanup of sensitive data every 60 seconds
    this.sensitiveDataCleanupInterval = setInterval(() => {
      this.clearSensitiveLogs();
    }, 60 * 1000);
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.level;
  }

  private sanitizeLogEntry(entry: LogEntry): LogEntry {
    if (!entry.context) return entry;
    
    const sanitized = { ...entry.context };
    
    // Remove sensitive fields for ephemeral compliance
    const sensitiveFields = ['password', 'token', 'email', 'income', 'debts', 'inputs', 'results', 'calculatorData'];
    sensitiveFields.forEach(field => {
      if (sanitized[field] !== undefined) {
        delete sanitized[field];
      }
    });
    
    // Sanitize nested objects
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sensitiveFields.forEach(field => {
          if (sanitized[key][field] !== undefined) {
            delete sanitized[key][field];
          }
        });
      }
    });
    
    return {
      ...entry,
      context: Object.keys(sanitized).length > 0 ? sanitized : undefined
    };
  }

  private clearSensitiveLogs(): void {
    // Remove logs that may contain sensitive data after processing
    this.logs = this.logs.filter(log => {
      const hasSensitiveContent = log.message.toLowerCase().includes('calculation') ||
                                  log.message.toLowerCase().includes('login') ||
                                  log.message.toLowerCase().includes('auth') ||
                                  log.message.toLowerCase().includes('password') ||
                                  log.message.toLowerCase().includes('income') ||
                                  (log.context && Object.keys(log.context).some(key => 
                                    ['email', 'password', 'token', 'income', 'debts'].includes(key.toLowerCase())
                                  ));
      
      // Keep non-sensitive logs, remove sensitive ones for ephemeral compliance
      return !hasSensitiveContent;
    });
  }

  private addLog(entry: LogEntry): void {
    // Sanitize entry before storing
    const sanitizedEntry = this.sanitizeLogEntry(entry);
    this.logs.push(sanitizedEntry);
    
    // Trim logs if we exceed the maximum
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  // Add cleanup method for explicit data clearing
  public clearAllLogs(): void {
    this.logs = [];
  }

  // Cleanup method for shutdown
  public cleanup(): void {
    if (this.sensitiveDataCleanupInterval) {
      clearInterval(this.sensitiveDataCleanupInterval);
      this.sensitiveDataCleanupInterval = null;
    }
    this.clearAllLogs();
  }

  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>): string {
    const levelNames = ['ERROR', 'WARN', 'INFO', 'DEBUG'];
    const timestamp = new Date().toISOString();
    const levelName = levelNames[level];
    
    let formattedMessage = `[${timestamp}] [${levelName}] ${message}`;
    
    if (context && Object.keys(context).length > 0) {
      formattedMessage += ` | Context: ${JSON.stringify(context)}`;
    }
    
    return formattedMessage;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      error,
    };

    this.addLog(entry);

    if (this.enableConsole) {
      const formattedMessage = this.formatMessage(level, message, context);
      
      switch (level) {
        case LogLevel.ERROR:
          console.error(formattedMessage, error || '');
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage);
          break;
        case LogLevel.INFO:
          console.info(formattedMessage);
          break;
        case LogLevel.DEBUG:
          console.log(formattedMessage);
          break;
      }
    }
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Get recent logs for debugging purposes
   */
  getRecentLogs(count = 100): LogEntry[] {
    return this.logs.slice(-count);
  }

  /**
   * Clear all stored logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Set the minimum log level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Enable or disable console output
   */
  setConsoleOutput(enabled: boolean): void {
    this.enableConsole = enabled;
  }

  /**
   * Create a domain-specific logger
   */
  createDomainLogger(domain: string) {
    return {
      error: (message: string, error?: Error, context?: Record<string, any>) => 
        this.error(`${domain}: ${message}`, error, context),
      warn: (message: string, context?: Record<string, any>) => 
        this.warn(`${domain}: ${message}`, context),
      info: (message: string, context?: Record<string, any>) => 
        this.info(`${domain}: ${message}`, context),
      debug: (message: string, context?: Record<string, any>) => 
        this.debug(`${domain}: ${message}`, context),
    };
  }
}

// Create singleton instance
const logger = new Logger();

export default logger;
export { logger };

// Convenience exports for common logging operations
export const logError = (message: string, error?: Error, context?: Record<string, any>) => 
  logger.error(message, error, context);

export const logWarn = (message: string, context?: Record<string, any>) => 
  logger.warn(message, context);

export const logInfo = (message: string, context?: Record<string, any>) => 
  logger.info(message, context);

export const logDebug = (message: string, context?: Record<string, any>) => 
  logger.debug(message, context);

// Domain-specific loggers for better organization
export const journeyLogger = {
  stepCompleted: (stepId: string, context?: Record<string, any>) => 
    logger.info(`Journey step completed: ${stepId}`, context),
  
  stepStarted: (stepId: string, context?: Record<string, any>) => 
    logger.info(`Journey step started: ${stepId}`, context),
  
  progressUpdated: (percentage: number, context?: Record<string, any>) => 
    logger.debug(`Journey progress updated: ${percentage}%`, context),
  
  info: (message: string, context?: Record<string, any>) => 
    logger.info(`Journey: ${message}`, context),
  
  debug: (message: string, context?: Record<string, any>) => 
    logger.debug(`Journey: ${message}`, context),
  
  warn: (message: string, context?: Record<string, any>) => 
    logger.warn(`Journey: ${message}`, context),
  
  error: (message: string, error?: Error, context?: Record<string, any>) => 
    logger.error(`Journey Error: ${message}`, error, context),
};

export const calculatorLogger = {
  calculationPerformed: (calculatorType: string, inputs: Record<string, any>, result: any) => 
    logger.info(`Calculator calculation performed: ${calculatorType}`, { inputs, result }),
  
  validationError: (calculatorType: string, field: string, error: string) => 
    logger.warn(`Calculator validation error: ${calculatorType}`, { field, error }),
  
  error: (message: string, error?: Error, context?: Record<string, any>) => 
    logger.error(`Calculator Error: ${message}`, error, context),
};

export const regionalLogger = {
  contentLoaded: (region: string, contentType: string) => 
    logger.info(`Regional content loaded: ${region}/${contentType}`),
  
  cacheHit: (region: string, contentType: string) => 
    logger.debug(`Regional content cache hit: ${region}/${contentType}`),
  
  cacheMiss: (region: string, contentType: string) => 
    logger.debug(`Regional content cache miss: ${region}/${contentType}`),
  
  error: (message: string, error?: Error, context?: Record<string, any>) => 
    logger.error(`Regional Error: ${message}`, error, context),
};

export const authLogger = {
  loginAttempt: (email: string) => 
    logger.info('Login attempt', { email }),
  
  loginSuccess: (userId: string) => 
    logger.info('Login successful', { userId }),
  
  loginFailure: (email: string, reason: string) => 
    logger.warn('Login failed', { email, reason }),
  
  logout: (userId: string) => 
    logger.info('User logged out', { userId }),
  
  error: (message: string, error?: Error, context?: Record<string, any>) => 
    logger.error(`Auth Error: ${message}`, error, context),
};