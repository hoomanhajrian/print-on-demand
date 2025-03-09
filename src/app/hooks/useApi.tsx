import { useState, useCallback } from 'react';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiHook<T> {
  apiCall: (url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any) => Promise<ApiResponse<T>>;
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useApi<T>(): ApiHook<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = useCallback(
    async (url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok) {
          throw new Error(`API call failed with status ${response.status}`);
        }

        const responseData = await response.json();
        setData(responseData);
        return { data: responseData, loading: false, error: null };
      } catch (error: any) {
        setError(error.message);
        setData(null);
        return { data: null, loading: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { apiCall, data, loading, error };
}

export default useApi;