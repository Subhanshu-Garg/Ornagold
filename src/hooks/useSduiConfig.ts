import { useState, useEffect } from 'react';
import { getSduiConfiguration } from '../services/sduiConfigurations';
import { SduiConfigResponse } from '../types/sduiConfig';
import { parseSduiConfiguration } from '../utils/parseSduiConfiguration';

export const useSduiConfig = <T = any>(key: string) => {
  const [config, setConfig] = useState<SduiConfigResponse<T> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        const data = await getSduiConfiguration<T>(key);
        if(!data) return null
        const parsedData = parseSduiConfiguration<SduiConfigResponse<T>>(data)
        setConfig(parsedData);
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [key]);

  return { config, isLoading, error };
}; 