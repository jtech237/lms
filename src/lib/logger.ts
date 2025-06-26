type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private log(level: LogLevel, message: string, ...args: unknown[]) {
    if (this.isDevelopment) {
      console[level](`[${level.toUpperCase()}] ${message}`, ...args);
    } else {
      // Ici, vous pourriez implémenter une logique pour envoyer les logs
      // vers un service externe comme Sentry, LogRocket, etc.
    }
  }

  info(message: string, ...args: unknown[]) {
    this.log('info', message, ...args);
    console.log();
  }

  warn(message: string, ...args: unknown[]) {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: unknown[]) {
    this.log('error', message, ...args);
  }

  debug(message: string, ...args: unknown[]) {
    this.log('debug', message, ...args);
  }
}

export const logger = new Logger();
