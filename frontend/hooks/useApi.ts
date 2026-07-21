import { useState, useCallback } from "react";

export function useApi<T>(apiFunc: (...args: any[]) => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiFunc(...args);
        setData(result);
        return result;
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunc]
  );

  return { data, isLoading, error, execute };
}