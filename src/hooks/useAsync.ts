import { useState, useCallback, useEffect } from 'react';
import AppError from '../utils/errorHandler';

export default function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const memoizedAsyncFunction = useCallback(asyncFunction, dependencies);

  const execute = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await memoizedAsyncFunction();
      setData(result);
      setError(null);
      return result;
    } catch (error) {
      const normalizedError = error instanceof AppError 
        ? error 
        : new AppError('SERVER', 'Error in useAsync', error);
      setError(normalizedError);
      throw normalizedError;
    } finally {
      setIsLoading(false);
    }
  }, [memoizedAsyncFunction]);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, isLoading, error, execute };
} 