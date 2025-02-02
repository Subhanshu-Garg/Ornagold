import { useState, useCallback } from 'react';
import AppError from '../utils/errorHandler';

type AsyncFunction<T> = () => Promise<T>;

export default function useAsync<T>(asyncFunction: AsyncFunction<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await asyncFunction();
      setData(result);
      setError(null);
      return result;
    } catch (error) {
      setError(error instanceof AppError ? error : new AppError('SERVER', 'Error in useAsync', error));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [asyncFunction]);

  return { data, isLoading, error, execute };
} 