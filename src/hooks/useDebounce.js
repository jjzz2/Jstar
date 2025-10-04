import { useState, useEffect } from 'react';
import { useDebounce as useAhooksDebounce } from 'ahooks';

/**
 * 防抖自定义hook
 */
const useDebounce = (value, delay = 300) => {
  return useAhooksDebounce(value, { wait: delay });
};

/**
 * 防抖回调自定义hook
 */
const useDebounceCallback = (callback, delay = 300, deps = []) => {
  const [debouncedCallback, setDebouncedCallback] = useState(callback);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCallback(callback);
    }, delay);

    return () => clearTimeout(timer);
  }, [callback, delay, ...deps]);

  return debouncedCallback;
};

/**
 * 防抖状态自定义hook
 */
const useDebounceState = (initialValue, delay = 300) => {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, delay);

  return [value, setValue, debouncedValue];
};

export default useDebounce;
export { useDebounceCallback, useDebounceState };
