import { TRPCError } from '@trpc/server';
import { middleware } from '../api/trpc';

export const errorHandlerMiddleware = middleware(async ({ path, next }) => {
  try {
    return await next();
  } catch (error) {
    console.error(`Error in ${path}:`, error);
    
    // Handle database connection errors
    if (error instanceof Error) {
      if (error.message.includes('too many clients already') || 
          error.message.includes('connection') ||
          error.message.includes('database')) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database connection temporarily unavailable. Please try again.',
          cause: error,
        });
      }
    }
    
    // Re-throw the original error if it's not a database connection issue
    throw error;
  }
});

export const withErrorHandler = errorHandlerMiddleware;
