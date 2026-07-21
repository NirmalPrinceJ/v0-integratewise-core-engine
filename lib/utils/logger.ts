/**
 * Enterprise-grade logging utility
 * Provides structured logging with appropriate log levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  timestamp: string
  message: string
  context?: Record<string, unknown>
  stack?: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatTimestamp(): string {
    return new Date().toISOString()
  }

  private formatMessage(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      level,
      timestamp: this.formatTimestamp(),
      message,
      context,
    }
  }

  /**
   * Debug level logging (development only)
   */
  debug(message: string, context?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      const entry = this.formatMessage('debug', message, context)
      console.debug(`[DEBUG] ${entry.message}`, entry.context || '')
    }
  }

  /**
   * Info level logging
   */
  info(message: string, context?: Record<string, unknown>): void {
    const entry = this.formatMessage('info', message, context)
    console.log(`[INFO] ${entry.message}`, entry.context || '')
  }

  /**
   * Warning level logging
   */
  warn(message: string, context?: Record<string, unknown>): void {
    const entry = this.formatMessage('warn', message, context)
    console.warn(`[WARN] ${entry.message}`, entry.context || '')
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error | unknown, context?: Record<string, unknown>): void {
    const entry: LogEntry = this.formatMessage('error', message, context)

    if (error instanceof Error) {
      entry.stack = error.stack
      console.error(`[ERROR] ${entry.message}: ${error.message}`, entry.context || '', entry.stack)
    } else if (typeof error === 'string') {
      console.error(`[ERROR] ${entry.message}: ${error}`, entry.context || '')
    } else {
      console.error(`[ERROR] ${entry.message}`, entry.context || '', error)
    }
  }

  /**
   * Performance timing
   */
  time(label: string): () => void {
    const start = performance.now()
    return () => {
      const duration = performance.now() - start
      this.debug(`${label} took ${duration.toFixed(2)}ms`, { duration })
    }
  }
}

export const logger = new Logger()
