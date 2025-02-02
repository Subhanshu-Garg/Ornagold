export default class AppError extends Error {
  constructor(
    public readonly type: 'NETWORK' | 'SERVER' | 'VALIDATION' | 'UNKNOWN',
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
  }
}

export const errorHandler = {
  handle: (error: unknown, context?: string): AppError => {
    console.error('Error', JSON.stringify(error))
    // Convert to standardized error
    const appError = errorHandler.normalize(error);
    
    // Handle different error types
    switch(appError.type) {
      case 'NETWORK':
        console.error('Network Error:', appError.message, `Context: ${context}`);
        // Show user-friendly alert
        alert('Please check your internet connection');
        break;
      case 'SERVER':
        console.error('Server Error:', appError.message, `Context: ${context}`);
        alert('Server issue occurred. Please try again later');
        break;
      default:
        console.error('Unexpected Error:', appError.message, `Context: ${context}`);
        alert('Something went wrong. Our team has been notified');
    }
    
    // TODO: Add error reporting service integration
    return appError;
  },

  normalize: (error: unknown): AppError => {
    if (error instanceof AppError) return error;
    
    if (error instanceof Error) {
      // Handle Supabase errors
      if ('code' in error) {
        const code = (error as any).code;
        if (code?.startsWith('22') || code?.startsWith('23')) {
          return new AppError('VALIDATION', error.message, error);
        }
        if (code === '23505') { // Supabase unique constraint
          return new AppError('VALIDATION', 'Item already exists', error);
        }
      }
      
      // Network errors
      if (error.message.includes('Network')) {
        return new AppError('NETWORK', 'Network request failed', error);
      }
      
      return new AppError('UNKNOWN', error.message, error);
    }
    
    return new AppError('UNKNOWN', 'Unknown error occurred', error);
  }
}; 