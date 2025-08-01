export class ErrorReporter {
  private static instance: ErrorReporter;
  private errorQueue: Array<{ timestamp: Date; error: Error; context?: string }> = [];
  
  private constructor() {
    this.setupGlobalHandlers();
  }
  
  static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter();
    }
    return ErrorReporter.instance;
  }
  
  private setupGlobalHandlers(): void {
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      this.reportError(
        new Error(`${event.message} at ${event.filename}:${event.lineno}:${event.colno}`),
        'Uncaught Error'
      );
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError(
        new Error(`Unhandled Promise Rejection: ${event.reason}`),
        'Promise Rejection'
      );
    });
    
    // Override console.error to capture all errors
    const originalError = console.error;
    console.error = (...args) => {
      originalError.apply(console, args);
      
      const errorMessage = args
        .map(arg => {
          if (arg instanceof Error) return arg.stack || arg.message;
          if (typeof arg === 'object') return JSON.stringify(arg);
          return String(arg);
        })
        .join(' ');
      
      this.reportError(new Error(errorMessage), 'Console Error');
    };
  }
  
  reportError(error: Error, context?: string): void {
    const errorEntry = {
      timestamp: new Date(),
      error,
      context
    };
    
    this.errorQueue.push(errorEntry);
    
    // Log to console with formatting
    console.error(`🚨 [${context || 'Error'}] ${errorEntry.timestamp.toISOString()}`, error);
    
    // Send to server endpoint if available
    if (import.meta.hot) {
      fetch('/__vite_error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: errorEntry.timestamp,
          message: error.message,
          stack: error.stack,
          context
        })
      }).catch(() => {
        // Silently fail if endpoint not available
      });
    }
  }
  
  getErrors(): Array<{ timestamp: Date; error: Error; context?: string }> {
    return [...this.errorQueue];
  }
  
  clearErrors(): void {
    this.errorQueue = [];
  }
}

// Initialize error reporter
export const errorReporter = ErrorReporter.getInstance();