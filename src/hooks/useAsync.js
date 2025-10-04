import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * 异步操作管理自定义hook
 */
const useAsync = (asyncFunction, immediate = false) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction(...args);
      if (isMountedRef.current) {
        setData(result);
      }
      return result;
    } catch (err) {
      if (isMountedRef.current) {
        setError(err);
      }
      throw err;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [asyncFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
};

/**
 * 异步状态管理自定义hook
 */
const useAsyncState = (initialState = null) => {
  const [state, setState] = useState({
    data: initialState,
    loading: false,
    error: null
  });

  const setData = useCallback((data) => {
    setState(prev => ({ ...prev, data, error: null }));
  }, []);

  const setLoading = useCallback((loading) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialState,
      loading: false,
      error: null
    });
  }, [initialState]);

  return {
    ...state,
    setData,
    setLoading,
    setError,
    reset
  };
};

export default useAsync;
export { useAsyncState };
