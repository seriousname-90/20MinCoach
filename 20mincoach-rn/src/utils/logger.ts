// /src/utils/logger.ts

// Logger strategies
export interface LoggerStrategy {
  log(level: LogLevel, message: string, meta?: Record<string, any>): void;
  error(message: string, error?: Error, meta?: Record<string, any>): void;
  warn(message: string, meta?: Record<string, any>): void;
  info(message: string, meta?: Record<string, any>): void;
  debug(message: string, meta?: Record<string, any>): void;
}

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

// Console Strategy (default for development)
class ConsoleLoggerStrategy implements LoggerStrategy {
  private colors = {
    error: '\x1b[31m', // red
    warn: '\x1b[33m',  // yellow
    info: '\x1b[32m',  // green
    debug: '\x1b[36m', // cyan
    reset: '\x1b[0m'   // reset
  };

  log(level: LogLevel, message: string, meta?: Record<string, any>): void {
    const timestamp = new Date().toISOString();
    const color = this.colors[level];
    
    console.log(
      `${color}[${timestamp}] ${level.toUpperCase()}: ${message}${this.colors.reset}`
    );
    
    if (meta && Object.keys(meta).length > 0) {
      console.log(`${color}Metadata:`, meta, this.colors.reset);
    }
  }

  error(message: string, error?: Error, meta?: Record<string, any>): void {
    const fullMeta = {
      ...meta,
      errorName: error?.name,
      errorMessage: error?.message,
      stack: error?.stack
    };
    this.log('error', message, fullMeta);
  }

  warn(message: string, meta?: Record<string, any>): void {
    this.log('warn', message, meta);
  }

  info(message: string, meta?: Record<string, any>): void {
    this.log('info', message, meta);
  }

  debug(message: string, meta?: Record<string, any>): void {
    this.log('debug', message, meta);
  }
}

// Remote Strategy (for production - can be extended for services like Sentry, LogRocket)
class RemoteLoggerStrategy implements LoggerStrategy {
  private baseUrl: string;
  private appVersion: string;

  constructor(baseUrl: string, appVersion: string) {
    this.baseUrl = baseUrl;
    this.appVersion = appVersion;
  }

  private async sendToRemote(level: LogLevel, message: string, meta?: Record<string, any>) {
    try {
      const logEntry = {
        level,
        message,
        meta,
        timestamp: new Date().toISOString(),
        appVersion: this.appVersion,
        platform: Platform.OS,
        userId: await this.getUserId() // You'd implement this
      };

      // In a real app, you'd send this to your logging service
      if (__DEV__) {
        console.log('📡 [REMOTE LOG]:', logEntry);
      } else {
        // await fetch(`${this.baseUrl}/logs`, { method: 'POST', body: JSON.stringify(logEntry) });
      }
    } catch (error) {
      // Fallback to console if remote logging fails
      console.error('Remote logging failed:', error);
    }
  }

  private async getUserId(): Promise<string | undefined> {
    // Implement based on your auth system
    return undefined;
  }

  log(level: LogLevel, message: string, meta?: Record<string, any>): void {
    this.sendToRemote(level, message, meta);
    
    // Also log to console in development
    if (__DEV__) {
      const consoleLogger = new ConsoleLoggerStrategy();
      consoleLogger.log(level, message, meta);
    }
  }

  error(message: string, error?: Error, meta?: Record<string, any>): void {
    const fullMeta = { ...meta, error: error?.message, stack: error?.stack };
    this.log('error', message, fullMeta);
  }

  warn(message: string, meta?: Record<string, any>): void {
    this.log('warn', message, meta);
  }

  info(message: string, meta?: Record<string, any>): void {
    this.log('info', message, meta);
  }

  debug(message: string, meta?: Record<string, any>): void {
    this.log('debug', message, meta);
  }
}

// Logger Factory
class Logger {
  private strategy: LoggerStrategy;

  constructor(strategy?: LoggerStrategy) {
    this.strategy = strategy || this.createDefaultStrategy();
  }

  private createDefaultStrategy(): LoggerStrategy {
    return __DEV__ ? new ConsoleLoggerStrategy() : new RemoteLoggerStrategy(
      'https://logs.your-app.com',
      '1.0.0' // This should come from app.json or similar
    );
  }

  setStrategy(strategy: LoggerStrategy): void {
    this.strategy = strategy;
  }

  error(message: string, error?: Error, meta?: Record<string, any>): void {
    this.strategy.error(message, error, meta);
  }

  warn(message: string, meta?: Record<string, any>): void {
    this.strategy.warn(message, meta);
  }

  info(message: string, meta?: Record<string, any>): void {
    this.strategy.info(message, meta);
  }

  debug(message: string, meta?: Record<string, any>): void {
    this.strategy.debug(message, meta);
  }

  // Method for API requests/responses
  apiRequest(url: string, method: string, meta?: Record<string, any>): void {
    this.info(`API ${method} ${url}`, { type: 'api_request', ...meta });
  }

  apiResponse(url: string, method: string, status: number, duration: number): void {
    const level = status >= 400 ? 'error' : 'info';
    this[level](`API ${method} ${url} - ${status} (${duration}ms)`, {
      type: 'api_response',
      status,
      duration
    });
  }
}

// Singleton instance
export const logger = new Logger();