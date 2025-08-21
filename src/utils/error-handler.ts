import type { ApiError, DatabaseError } from '@/types/api';

// Error types
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403);
  }
}

// Error handling utilities
export const _handleDatabaseError = (error: unknown): never => {
  if (error instanceof Error) {
    // Prisma specific errors
    if ('code' in error) {
      const _dbError = error as DatabaseError;
      
      switch (_dbError.code) {
        case 'P2002':
          throw new Error('A record with this unique field already exists');
        case 'P2025':
          throw new Error('Record not found');
        case 'P2003':
          throw new Error('Foreign key constraint failed');
        default:
          throw new Error('Database operation failed');
      }
    }
    
    // Generic error
    throw new Error(error.message || 'An unexpected error occurred');
  }
  
  // Unknown error type
  throw new Error('An unexpected error occurred');
};

export const _handleExternalApiError = (error: unknown): never => {
  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('fetch')) {
      throw new Error('External service is currently unavailable');
    }
    
    // API errors
    if ('status' in error) {
      const _apiError = error as ApiError;
      
      switch (_apiError.status) {
        case 401:
          throw new Error('External API authentication failed');
        case 403:
          throw new Error('External API access forbidden');
        case 404:
          throw new Error('External resource not found');
        case 429:
          throw new Error('External API rate limit exceeded');
        case 500:
          throw new Error('External service error');
        default:
          throw new Error('External API error');
      }
    }
    
    // Generic error
    throw new Error(error.message || 'External API error');
  }
  
  // Unknown error type
  throw new Error('External API error');
};

// Type-safe error checking
export const _isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

export const _isValidationError = (error: unknown): error is ValidationError => {
  return error instanceof ValidationError;
};

export const _isNotFoundError = (error: unknown): error is NotFoundError => {
  return error instanceof NotFoundError;
};

export const _isUnauthorizedError = (error: unknown): error is UnauthorizedError => {
  return error instanceof UnauthorizedError;
};

export const _isForbiddenError = (error: unknown): error is ForbiddenError => {
  return error instanceof ForbiddenError;
};

// Safe property access utilities
export const _safeGet = <T, K extends keyof T>(obj: T, key: K): T[K] | undefined => {
  try {
    return obj[key];
  } catch {
    return undefined;
  }
};



// Type guards for runtime type checking
export const _isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const _isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !Number.isNaN(value);
};

export const _isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

export const _isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const _isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

export const _isDate = (value: unknown): value is Date => {
  return value instanceof Date;
};

// Safe JSON parsing
export const _safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
};

// Safe async operation wrapper
export const _safeAsync = async <T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> => {
  try {
    return await operation();
  } catch {
    return fallback;
  }
};

// Error logging utility
export const _logError = (): void => {
  // Error logging functionality
};

// Retry utility with exponential backoff
export const _retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: unknown;
  
  for (let _attempt = 0; _attempt <= maxRetries; _attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (_attempt === maxRetries) {
        break;
      }
      
      const _delay = baseDelay * Math.pow(2, _attempt);
      await new Promise(resolve => setTimeout(resolve, _delay));
    }
  }
  
  throw lastError;
};
